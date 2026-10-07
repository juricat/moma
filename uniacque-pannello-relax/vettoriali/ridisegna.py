"""Ridisegna lo sfondo a onde come vettoriale pulito.

1. vtracer ricava le forme dall'immagine ingrandita 3x (poligoni, modalità "stacked":
   ogni forma è intera anche dove è coperta da quella sopra).
2. Ogni forma viene ridisegnata: cerchi riconosciuti e sostituiti da <circle> veri,
   le altre levigate e riadattate con poche curve di Bézier, mantenendo gli spigoli
   (punte delle gocce e delle onde).
3. I colori vengono agganciati alla palette Uniacque e le forme divise in livelli.

Uso: python3 ridisegna.py <immagine> <uscita.svg>
"""
import math
import re
import sys
from pathlib import Path

import numpy as np
import vtracer
from PIL import Image
from scipy.ndimage import gaussian_filter1d

SCALE = 3
NAVY, AZZURRO, CELESTE = "#1D2A53", "#009EDA", "#79BEE2"
CREMA, CAFFE = "#F8F5F0", "#6A3B1F"


def mix(a, b, t):
    a = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#%02X%02X%02X" % tuple(round(x + (y - x) * t) for x, y in zip(a, b))


# colore rilevato nell'immagine -> (colore Uniacque, nome)
PALETTE = {
    "#F8F5F0": (CREMA, "crema"),
    "#053D77": (NAVY, "blu-notte"),
    "#2A86C6": (mix(AZZURRO, NAVY, .22), "azzurro-scuro"),
    "#3C99D5": (AZZURRO, "azzurro"),
    "#53A7DD": (mix(AZZURRO, CELESTE, .5), "azzurro-celeste"),
    "#72BAE6": (mix(CELESTE, AZZURRO, .15), "celeste-intenso"),
    "#7EC0E8": (CELESTE, "celeste"),
    "#A4D2ED": (mix(CELESTE, "#FFFFFF", .4), "celeste-60"),
    "#C2E1F3": (mix(CELESTE, "#FFFFFF", .6), "celeste-40"),
    "#6D3E24": (CAFFE, "caffe"),
}
_REF = np.array([[int(k[i:i + 2], 16) for i in (1, 3, 5)] for k in PALETTE], float)


def snap(hexcol):
    c = np.array([int(hexcol[i:i + 2], 16) for i in (1, 3, 5)], float)
    return list(PALETTE.values())[int(np.argmin(((_REF - c) ** 2).sum(1)))]


# ---------------------------------------------------------------- geometria
def area(p):
    x, y = p[:, 0], p[:, 1]
    return 0.5 * (np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


def resample(p, step):
    q = np.vstack([p, p[:1]])
    d = np.hypot(*np.diff(q, axis=0).T)
    s = np.concatenate([[0], np.cumsum(d)])
    n = max(int(s[-1] / step), 8)
    t = np.linspace(0, s[-1], n, endpoint=False)
    return np.column_stack([np.interp(t, s, q[:, 0]), np.interp(t, s, q[:, 1])])


def fit_circle(p):
    A = np.column_stack([2 * p[:, 0], 2 * p[:, 1], np.ones(len(p))])
    b = (p ** 2).sum(1)
    cx, cy, c = np.linalg.lstsq(A, b, rcond=None)[0]
    r = math.sqrt(max(c + cx * cx + cy * cy, 1e-9))
    res = np.hypot(p[:, 0] - cx, p[:, 1] - cy) - r
    return cx, cy, r, res


# Schneider: adattamento di curve di Bézier cubiche a una sequenza di punti
def _bez(c, t):
    t = t[:, None]
    return (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[1] + 3 * (1 - t) * t ** 2 * c[2] + t ** 3 * c[3]


def _bez_d(c, t):
    t = t[:, None]
    return 3 * (1 - t) ** 2 * (c[1] - c[0]) + 6 * (1 - t) * t * (c[2] - c[1]) + 3 * t ** 2 * (c[3] - c[2])


def _bez_dd(c, t):
    t = t[:, None]
    return 6 * (1 - t) * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])


def _unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-9 else v


def _generate(pts, u, t1, t2):
    C = np.zeros((2, 2))
    X = np.zeros(2)
    p0, p3 = pts[0], pts[-1]
    for p, uu in zip(pts, u):
        a1 = t1 * 3 * (1 - uu) ** 2 * uu
        a2 = t2 * 3 * (1 - uu) * uu ** 2
        C[0, 0] += a1 @ a1
        C[0, 1] += a1 @ a2
        C[1, 1] += a2 @ a2
        tmp = p - ((1 - uu) ** 3 * p0 + 3 * (1 - uu) ** 2 * uu * p0 + 3 * (1 - uu) * uu ** 2 * p3 + uu ** 3 * p3)
        X[0] += a1 @ tmp
        X[1] += a2 @ tmp
    C[1, 0] = C[0, 1]
    det = C[0, 0] * C[1, 1] - C[0, 1] ** 2
    seg = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        al = (X[0] * C[1, 1] - X[1] * C[0, 1]) / det
        ar = (C[0, 0] * X[1] - C[0, 1] * X[0]) / det
    else:
        al = ar = 0
    if al < 1e-6 * seg or ar < 1e-6 * seg:
        al = ar = seg / 3
    return np.array([p0, p0 + t1 * al, p3 + t2 * ar, p3])


def fit_cubic(pts, t1, t2, err):
    if len(pts) == 2:
        d = np.linalg.norm(pts[1] - pts[0]) / 3
        return [np.array([pts[0], pts[0] + t1 * d, pts[1] + t2 * d, pts[1]])]
    d = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(pts, axis=0).T))])
    u = d / d[-1]
    bez = _generate(pts, u, t1, t2)
    for _ in range(6):
        dist = np.hypot(*(_bez(bez, u) - pts).T)
        i = int(np.argmax(dist))
        if dist[i] < err:
            return [bez]
        q, q1, q2 = _bez(bez, u), _bez_d(bez, u), _bez_dd(bez, u)
        num = ((q - pts) * q1).sum(1)
        den = (q1 * q1).sum(1) + ((q - pts) * q2).sum(1)
        u = np.clip(u - np.where(np.abs(den) > 1e-12, num / den, 0), 0, 1)
        bez = _generate(pts, u, t1, t2)
    dist = np.hypot(*(_bez(bez, u) - pts).T)
    i = int(np.clip(np.argmax(dist), 1, len(pts) - 2))
    tc = _unit(pts[i - 1] - pts[i + 1])
    return fit_cubic(pts[: i + 1], t1, tc, err) + fit_cubic(pts[i:], -tc, t2, err)


def fit_open(seg, err):
    t1 = _unit(seg[min(2, len(seg) - 1)] - seg[0])
    t2 = _unit(seg[max(-3, -len(seg))] - seg[-1])
    return fit_cubic(seg, t1, t2, err)


# ---------------------------------------------------------------- ridisegno
def smooth_contour(p, W, H, step=3.0, sigma=9.0, err=2.5):
    p = resample(p, step)
    n = len(p)
    on_border = (p[:, 0] < 2) | (p[:, 0] > W - 2) | (p[:, 1] < 2) | (p[:, 1] > H - 2)
    # angolo di svolta su finestra larga: individua gli spigoli veri
    k = 5
    a = p - np.roll(p, k, 0)
    b = np.roll(p, -k, 0) - p
    ang = np.abs(np.arctan2(a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0], (a * b).sum(1)))
    corner = ang > math.radians(48)
    idx = [i for i in range(n) if corner[i] and ang[i] == ang[[(i + j) % n for j in range(-k, k + 1)]].max()]
    # ingresso/uscita dal bordo del formato = spigolo
    idx += [i for i in range(n) if on_border[i] != on_border[i - 1]]
    idx = sorted(set(idx))
    out = []
    if not idx:
        q = np.vstack([gaussian_filter1d(p[:, 0], sigma, mode="wrap"), gaussian_filter1d(p[:, 1], sigma, mode="wrap")]).T
        q = np.vstack([q, q[:1]])
        return fit_open(q, err)
    for j, i0 in enumerate(idx):
        i1 = idx[(j + 1) % len(idx)]
        seg_i = [(i0 + m) % n for m in range(((i1 - i0) % n or n) + 1)]
        seg = p[seg_i].copy()
        if on_border[seg_i[len(seg_i) // 2]]:
            seg = np.clip(seg, 0, [W, H])
            seg[:, 0] = np.where(seg[:, 0] < 2, 0, np.where(seg[:, 0] > W - 2, W, seg[:, 0]))
            seg[:, 1] = np.where(seg[:, 1] < 2, 0, np.where(seg[:, 1] > H - 2, H, seg[:, 1]))
            out.append(np.array([seg[0], seg[0], seg[-1], seg[-1]]))  # tratto dritto sul bordo
            continue
        if len(seg) > 4:
            s = min(sigma, (len(seg) - 1) / 4)
            sm = np.vstack([gaussian_filter1d(seg[:, 0], s, mode="nearest"), gaussian_filter1d(seg[:, 1], s, mode="nearest")]).T
            sm[0], sm[-1] = seg[0], seg[-1]
            seg = sm
        out += fit_open(seg, err)
    return out


def path_d(beziers, f):
    d = "M%.1f,%.1f" % tuple(beziers[0][0] / f)
    for b in beziers:
        if np.allclose(b[0], b[1]) and np.allclose(b[2], b[3]):
            d += " L%.1f,%.1f" % tuple(b[3] / f)
        else:
            d += " C%.1f,%.1f %.1f,%.1f %.1f,%.1f" % tuple((b[1:] / f).ravel())
    return d + " Z"


def centerlines(mask, min_len=25 * SCALE):
    """Linea centrale dei tratti sottili: scheletro -> rami -> curve levigate."""
    import cv2
    from skimage.morphology import skeletonize
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    sk = skeletonize(mask > 0)
    ys, xs = np.nonzero(sk)
    pts = set(zip(ys.tolist(), xs.tolist()))
    nb = lambda y, x: [(y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and (y + dy, x + dx) in pts]
    deg = {p: len(nb(*p)) for p in pts}
    nodes = {p for p, d in deg.items() if d != 2}
    seen, branches = set(), []
    for n in nodes:
        for q in nb(*n):
            if (n, q) in seen:
                continue
            br, prev, cur = [n], n, q
            while True:
                seen.add((prev, cur)); seen.add((cur, prev))
                br.append(cur)
                if cur in nodes:
                    break
                nxt = [r for r in nb(*cur) if r != prev and (cur, r) not in seen]
                if not nxt:
                    break
                prev, cur = cur, nxt[0]
            branches.append(np.array([(x, y) for y, x in br], float))
    out = []
    for b in branches:
        length = np.hypot(*np.diff(b, axis=0).T).sum() if len(b) > 1 else 0
        if length < min_len:
            continue
        b = resample_open(b, 3.0)
        if len(b) > 8:
            b = np.vstack([gaussian_filter1d(b[:, 0], 10, mode="nearest"), gaussian_filter1d(b[:, 1], 10, mode="nearest")]).T
        out.append(fit_open(b, 2.5))
    return out


def resample_open(p, step):
    d = np.hypot(*np.diff(p, axis=0).T)
    s = np.concatenate([[0], np.cumsum(d)])
    n = max(int(s[-1] / step), 2)
    t = np.linspace(0, s[-1], n)
    return np.column_stack([np.interp(t, s, p[:, 0]), np.interp(t, s, p[:, 1])])


def open_d(beziers):
    d = "M%.1f,%.1f" % tuple(beziers[0][0] / SCALE)
    for b in beziers:
        d += " C%.1f,%.1f %.1f,%.1f %.1f,%.1f" % tuple((b[1:] / SCALE).ravel())
    return d


def trace(src, tmp):
    im = Image.open(src).convert("RGB")
    W, H = im.size[0] * SCALE, im.size[1] * SCALE
    im.resize((W, H), Image.LANCZOS).save(tmp)
    raw = tmp.with_suffix(".svg")
    vtracer.convert_image_to_svg_py(str(tmp), str(raw), colormode="color", hierarchical="stacked",
                                    mode="polygon", filter_speckle=16, color_precision=6, layer_difference=16)
    shapes = []
    big = np.asarray(Image.open(tmp).convert("RGB"), float)
    for d, fill, tx, ty in re.findall(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"', raw.read_text()):
        subs = []
        for sp in re.split(r"(?=M)", d.strip()):
            nums = np.array(re.findall(r"-?\d+\.?\d*", sp), float)
            if len(nums) >= 6:
                subs.append(nums.reshape(-1, 2) + [float(tx), float(ty)])
        if subs:
            shapes.append((fill.upper(), subs))
    # la "lente" celeste chiaro in basso al centro: vtracer la fonde con il fondo,
    # la ricavo direttamente dai pixel e la inserisco subito sopra il fondo crema
    import cv2
    x0, x1, y0, y1 = 960 * SCALE, 1345 * SCALE, 455 * SCALE, H
    sub = big[y0:y1, x0:x1]
    mask = (np.abs(sub - [194, 225, 243]).sum(2) < 40).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    lens = max(cs, key=cv2.contourArea)[:, 0, :].astype(float) + [x0, y0]
    pos = next(i for i, (f, sb) in enumerate(shapes) if i > 0 and snap(f)[1] == "crema" and abs(area(sb[0])) > 1e6)
    shapes.insert(pos + 1, ("#C2E1F3", [lens]))
    return im.size, W, H, shapes


def build(src, out):
    (w, h), W, H, shapes = trace(src, Path(out).with_name("_tmp3x.png"))
    import cv2
    layers = {"onde": [], "linee": [], "gocce-e-bolle": [], "caffe": []}
    line_masks = {"navy": np.zeros((H, W), np.uint8), "azzurro": np.zeros((H, W), np.uint8)}
    stats = []
    for fill, subs in shapes[1:]:  # il primo è il fondo
        color, name = snap(fill)
        outer = subs[0]
        a = abs(area(outer))
        if a < 500:
            continue
        perim = np.hypot(*np.diff(np.vstack([outer, outer[:1]]), axis=0).T).sum()
        thick = 2 * a / perim
        if thick < 1.6 * SCALE:  # frange di antialias, non forme vere
            continue
        inner = outer[(outer[:, 0] > 2) & (outer[:, 0] < W - 2) & (outer[:, 1] > 2) & (outer[:, 1] < H - 2)]
        el = None
        if len(subs) == 1 and len(inner) > 20:
            cx, cy, r, res = fit_circle(inner)
            # il contorno deve girare tutto attorno al centro (salvo dove esce dal formato)
            th = np.linspace(0, 2 * np.pi, 90, endpoint=False)
            ang = np.arctan2(inner[:, 1] - cy, inner[:, 0] - cx) % (2 * np.pi)
            hit = np.zeros(90, bool)
            hit[(ang / (2 * np.pi) * 90).astype(int) % 90] = True
            ex, ey = cx + r * np.cos(th), cy + r * np.sin(th)
            visible = (ex > 0) & (ex < W) & (ey > 0) & (ey < H)
            full = np.all(hit | ~visible)
            if full and r > 8 and np.abs(res).max() < max(0.035 * r, 4, 0.12 * r if r < 40 * SCALE else 0) and np.abs(res).std() < 0.012 * r + 1 + (0.04 * r if r < 40 * SCALE else 0):
                el = f'<circle cx="{cx / SCALE:.1f}" cy="{cy / SCALE:.1f}" r="{r / SCALE:.1f}" fill="{color}"/>'
        circ = 4 * math.pi * a / perim ** 2
        if thick < 4 * SCALE and name != "caffe":
            fam = {"blu-notte": "navy", "azzurro-scuro": "navy", "azzurro": "azzurro", "azzurro-celeste": "azzurro"}.get(name)
            if fam:
                cv2.fillPoly(line_masks[fam], [np.round(sp).astype(np.int32) for sp in subs], 255)
            continue
        lim = 45 if circ < 0.9 else 80
        if el is None and len(subs) == 1 and a < math.pi * (lim * SCALE) ** 2 and circ > 0.8 and len(inner) == len(outer):
            c = outer.mean(0)
            el = f'<circle cx="{c[0] / SCALE:.1f}" cy="{c[1] / SCALE:.1f}" r="{math.sqrt(a / math.pi) / SCALE:.1f}" fill="{color}"/>'
        if el is None:
            d = " ".join(path_d(smooth_contour(sp, W, H), SCALE) for sp in subs if abs(area(sp)) > 300)
            el = f'<path d="{d}" fill="{color}" fill-rule="evenodd"/>'
        if name == "caffe":
            layer = "caffe"
        elif thick < 4 * SCALE:
            layer = "linee"
        elif el.startswith("<circle") and a < (90 * SCALE) ** 2 or a < (60 * SCALE) ** 2 * 3 and el.startswith("<path") and thick > 12 * SCALE:
            layer = "gocce-e-bolle"
        else:
            layer = "onde"
        layers[layer].append(el)
        stats.append((layer, name, el[:7]))
    for fam, (col, width) in {"navy": (NAVY, 3.0), "azzurro": (mix(AZZURRO, NAVY, .1), 2.4)}.items():
        for line in centerlines(line_masks[fam]):
            layers["linee"].append(
                f'<path d="{open_d(line)}" fill="none" stroke="{col}" stroke-width="{width}" '
                f'stroke-linecap="round" stroke-linejoin="round"/>'
            )
    nomi = {"onde": "Onde e forme", "gocce-e-bolle": "Gocce e bolle", "linee": "Linee", "caffe": "Pallini caffè"}
    body = "\n".join(
        f'<g id="{k}" data-name="{nomi[k]}">\n' + "\n".join(v) + "\n</g>" for k, v in layers.items() if v
    )
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><clipPath id="formato"><rect width="{w}" height="{h}"/></clipPath></defs>
<g id="sfondo" data-name="Sfondo"><rect width="{w}" height="{h}" fill="{CREMA}"/></g>
<g clip-path="url(#formato)">
{body}
</g>
</svg>
"""
    Path(out).write_text(svg)
    return stats


if __name__ == "__main__":
    st = build(sys.argv[1], sys.argv[2])
    from collections import Counter
    print(Counter((s[0], s[2]) for s in st))
