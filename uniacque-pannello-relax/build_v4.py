"""Bozza v4: pattern (2000 x 1200 mm, orizzontale).

Tessere quadrate da 100 mm con due archi ciascuna (tessere di Truchet): gli archi si
uniscono da una tessera all'altra e formano correnti d'acqua continue, ognuna di un
colore Uniacque. Nei nodi della griglia, dove gli archi lasciano spazio, ci sono
pallini, chicchi e tazzine viste dall'alto.

Volutamente niente pattern di gocce, per non richiamare la campagna dei 20 anni.

Esce: pannello pieno, pannello con riquadro testo, tessera ripetibile senza giunte.
"""
import math
import random

from build import AZZURRO, CELESTE, NAVY, FONT, OUT, W, H, logo

OUT_V4 = OUT / "v4"
OUT_V4.mkdir(exist_ok=True)

CREMA = "#F8F5F0"
CAFFE = "#6A3B1F"
CARAMELLO = "#C98A4B"
CELESTE_60 = "#AFD8EE"
CELL = 100
BAND = 0.34  # larghezza corrente, in frazione della tessera
COLORS = [(NAVY, .3), (AZZURRO, .28), (CELESTE, .27), (CELESTE_60, .15)]


def pick(rnd, options):
    x, acc = rnd.random() * sum(w for _, w in options), 0
    for c, w in options:
        acc += w
        if x <= acc:
            return c
    return options[-1][0]


def truchet(cols, rows, seed, torus=False):
    """Restituisce gli archi [(cx, cy, a0, colore)] e i nodi liberi della griglia."""
    rnd = random.Random(seed)
    kind = [[rnd.random() < .5 for _ in range(cols)] for _ in range(rows)]
    parent = {}

    def find(a):
        parent.setdefault(a, a)
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    def mid(c, r, side):  # punto medio di un lato, identificato in modo univoco
        if side == "t":
            key = ("h", c, r)
        elif side == "b":
            key = ("h", c, r + 1)
        elif side == "l":
            key = ("v", c, r)
        else:
            key = ("v", c + 1, r)
        if torus:
            key = (key[0], key[1] % cols, key[2] % rows)
        return key

    arcs = []
    for r in range(rows):
        for c in range(cols):
            x, y = c * CELL, r * CELL
            if kind[r][c]:  # archi attorno agli angoli alto-sinistra e basso-destra
                pairs = [((x, y), 0, ("t", "l")), ((x + CELL, y + CELL), 180, ("b", "r"))]
            else:           # archi attorno agli angoli alto-destra e basso-sinistra
                pairs = [((x + CELL, y), 90, ("t", "r")), ((x, y + CELL), 270, ("b", "l"))]
            for (cx, cy), a0, (s1, s2) in pairs:
                m1, m2 = mid(c, r, s1), mid(c, r, s2)
                parent[find(m1)] = find(m2)
                arcs.append((cx, cy, a0, m1))
    colors = {}
    out = []
    for cx, cy, a0, m in arcs:
        root = find(m)
        if root not in colors:
            colors[root] = pick(rnd, COLORS)
        out.append((cx, cy, a0, colors[root]))
    if torus:  # nodi sul bordo duplicati sul lato opposto, così la tessera combacia
        nodes = []
        for r in range(rows):
            for c in range(cols):
                copies = [(c * CELL + dx, r * CELL + dy) for dx in ((0, cols * CELL) if c == 0 else (0,))
                          for dy in ((0, rows * CELL) if r == 0 else (0,))]
                nodes.append(copies)
    else:
        nodes = [[(c * CELL, r * CELL)] for r in range(rows + 1) for c in range(cols + 1)]
    return out, nodes, rnd


def arc_path(cx, cy, a0, color):
    """Quarto d'anello centrato nell'angolo (cx, cy), da a0 a a0+90 gradi (verso l'interno della tessera)."""
    r_in, r_out = CELL * (.5 - BAND / 2), CELL * (.5 + BAND / 2)
    # l'angolo a0 indica l'orientamento: 0 = tessera in basso a destra dell'angolo
    start = {0: 0, 90: 90, 180: 180, 270: 270}[a0]
    a1, a2 = math.radians(start), math.radians(start + 90)
    p = lambda rr, a: (cx + rr * math.cos(a), cy + rr * math.sin(a))
    o1, o2, i2, i1 = p(r_out, a1), p(r_out, a2), p(r_in, a2), p(r_in, a1)
    band = (
        f'<path d="M{o1[0]:.1f},{o1[1]:.1f} A{r_out:.1f},{r_out:.1f} 0 0 1 {o2[0]:.1f},{o2[1]:.1f} '
        f'L{i2[0]:.1f},{i2[1]:.1f} A{r_in:.1f},{r_in:.1f} 0 0 0 {i1[0]:.1f},{i1[1]:.1f} Z" fill="{color}"/>'
    )
    # filo di luce lungo la corrente
    m1, m2 = p(CELL * .5, a1), p(CELL * .5, a2)
    light = "#FFFFFF" if color in (NAVY, AZZURRO) else NAVY
    op = .35 if color in (NAVY, AZZURRO) else .18
    line = (
        f'<path d="M{m1[0]:.1f},{m1[1]:.1f} A{CELL * .5:.1f},{CELL * .5:.1f} 0 0 1 {m2[0]:.1f},{m2[1]:.1f}" '
        f'fill="none" stroke="{light}" stroke-width="2.5" opacity="{op}"/>'
    )
    return band, line


def accent(x, y, rnd):
    """Cosa mettere in un nodo della griglia (spazio libero: raggio 33 mm)."""
    t = rnd.random()
    if t < .07:  # tazzina vista dall'alto
        return (
            f'<circle cx="{x}" cy="{y}" r="27" fill="#FFFFFF"/>'
            f'<circle cx="{x}" cy="{y}" r="27" fill="none" stroke="#D9D1C7" stroke-width="1.5"/>'
            f'<circle cx="{x}" cy="{y}" r="19" fill="{CAFFE}"/>'
            f'<circle cx="{x - 4}" cy="{y - 4}" r="11" fill="{CARAMELLO}" opacity=".55"/>'
        )
    if t < .15:  # chicco
        rot = rnd.choice([-35, 20, 60, -70])
        return (
            f'<g transform="translate({x} {y}) rotate({rot})"><ellipse rx="14" ry="19" fill="{CAFFE}"/>'
            f'<path d="M1,-17 C-6,-6 6,6 -1,17" fill="none" stroke="#3A1E0E" stroke-width="3" stroke-linecap="round"/></g>'
        )
    if t < .27:
        return f'<circle cx="{x}" cy="{y}" r="9" fill="{CAFFE}"/>'
    if t < .42:
        return f'<circle cx="{x}" cy="{y}" r="{rnd.choice([8, 12, 16])}" fill="{rnd.choice([CELESTE, AZZURRO, CELESTE_60])}"/>'
    return ""


def pattern_body(cols, rows, seed, torus=False):
    arcs, nodes, rnd = truchet(cols, rows, seed, torus)
    bands, lines = zip(*(arc_path(*a) for a in arcs))
    acc = ""
    for copies in nodes:
        state = rnd.getstate()
        for x, y in copies:
            rnd.setstate(state)
            acc += accent(x, y, rnd)
    return (
        f'<g id="correnti" data-name="Correnti">{"".join(bands)}</g>\n'
        f'<g id="fili" data-name="Fili di luce">{"".join(lines)}</g>\n'
        f'<g id="accenti" data-name="Pallini, chicchi, tazzine">{acc}</g>'
    )


def svg(w, h, body, unit="mm"):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}{unit}" height="{h}{unit}" viewBox="0 0 {w} {h}">\n'
        f'<rect width="{w}" height="{h}" fill="{CREMA}"/>\n{body}\n</svg>\n'
    )


def panel(with_text):
    body = pattern_body(W // CELL, H // CELL, seed=11)
    if with_text:
        # riquadro allineato alla griglia: 9 x 8 tessere
        x0, y0, x1, y1 = 1 * CELL, 2 * CELL, 10 * CELL, 10 * CELL
        lines = [("Qui", NAVY), ("le buone idee", NAVY), ("scorrono", NAVY), ("anche con", NAVY), ("un caffè.", CAFFE)]
        txt = "\n".join(
            f'<text x="{x0 + 70}" y="{y0 + 290 + i * 104}" fill="{c}" font-family="{FONT}" font-size="92" '
            f'font-weight="700" letter-spacing="-1.5">{s}</text>'
            for i, (s, c) in enumerate(lines)
        )
        body += f"""
<defs><filter id="ombra" x="-10%" y="-10%" width="120%" height="120%">
  <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#1D2A53" flood-opacity=".18"/></filter></defs>
<g id="testo" data-name="Riquadro testo">
<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="50" fill="{CREMA}" filter="url(#ombra)"/>
{logo(x0 + 70, y0 + 60, 340)}
{txt}
</g>"""
    return svg(W, H, body)


if __name__ == "__main__":
    (OUT_V4 / "uniacque-relax-v4-pattern.svg").write_text(panel(False))
    (OUT_V4 / "uniacque-relax-v4-pattern-testo.svg").write_text(panel(True))
    # tessera ripetibile senza giunte: 8 x 8 tessere, 800 x 800 mm
    (OUT_V4 / "tessera-ripetibile-800mm.svg").write_text(svg(800, 800, pattern_body(8, 8, seed=46, torus=True)))
    print("ok")
