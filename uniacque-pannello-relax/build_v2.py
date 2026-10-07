"""Bozza A evoluta: cerchi d'onda stratificati (2000 x 1200 mm, orizzontale).

Due tazzine viste dall'alto, ognuna con la sua onda: i cerchi si allargano oltre il
bordo e si incontrano a metà pannello (due persone, due caffè, una chiacchierata).
Due varianti: "notte" (fondo blu) e "giorno" (fondo chiaro).
"""
import math

from build import BIANCO, AZZURRO, CELESTE, NAVY, FONT, OUT, W, H, logo

OUT_V2 = OUT / "v2"
OUT_V2.mkdir(exist_ok=True)


def ripples(cx, cy, r0, rmax, color, base_op, seed):
    """Cerchi d'onda: passo che cresce verso l'esterno, intensità a pacchetti che si spegne."""
    out, r, n = [], r0, 0
    while r < rmax:
        decay = math.exp(-(r - r0) / (rmax * 0.42))
        packet = 0.55 + 0.45 * math.cos(n * 0.9 + seed)
        op = base_op * decay * packet + 0.03
        sw = 1.5 + 9 * decay * (0.6 + 0.4 * math.sin(n * 1.7 + seed))
        out.append(
            f'<circle cx="{cx}" cy="{cy}" r="{r:.1f}" fill="none" stroke="{color}" '
            f'stroke-width="{sw:.2f}" opacity="{op:.3f}"/>'
        )
        r += 14 + n * 1.6
        n += 1
    return "\n".join(out)


def cup(id_, cx, cy, R, angle, t):
    """Tazzina vista dall'alto: piattino, ombra, bordo con luce, acqua con onde."""
    hx = cx + math.cos(math.radians(angle)) * (R + 70)
    hy = cy + math.sin(math.radians(angle)) * (R + 70)
    return f"""
<g>
  <circle cx="{cx}" cy="{cy}" r="{R * 1.45:.0f}" fill="url(#saucer-{t})" opacity=".9"/>
  <circle cx="{cx}" cy="{cy}" r="{R * 1.45:.0f}" fill="none" stroke="url(#rim-{t})" stroke-width="5" opacity=".6"/>
  <circle cx="{cx}" cy="{cy}" r="{R * 1.25:.0f}" fill="none" stroke="url(#rim-{t})" stroke-width="2" opacity=".35"/>
  <g filter="url(#shadow-{t})">
    <rect x="{hx - 95:.0f}" y="{hy - 42:.0f}" width="190" height="84" rx="42"
      transform="rotate({angle} {hx:.0f} {hy:.0f})" fill="url(#handle-{t})"/>
    <circle cx="{cx}" cy="{cy}" r="{R + 30}" fill="url(#cupbody-{t})"/>
  </g>
  <circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#water-{t})"/>
  <clipPath id="in-{id_}"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>
  <g clip-path="url(#in-{id_})">
    {ripples(cx, cy, 10, R * 1.1, BIANCO, 0.9, 0.3)}
    <circle cx="{cx - R * .35:.0f}" cy="{cy - R * .45:.0f}" r="{R * .55:.0f}" fill="url(#glint)" opacity=".5"/>
  </g>
  <circle cx="{cx}" cy="{cy}" r="{R + 30}" fill="none" stroke="url(#rim-{t})" stroke-width="4"/>
  <circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#0B1A3A" stroke-width="3" opacity=".35"/>
  <circle cx="{cx}" cy="{cy}" r="9" fill="{BIANCO}"/>
  <circle cx="{cx}" cy="{cy}" r="26" fill="url(#glint)"/>
</g>"""


def defs(t):
    dark = t == "notte"
    return f"""
<defs>
  <radialGradient id="bg-{t}" cx="0.68" cy="0.42" r="0.85">
    {'<stop offset="0" stop-color="#0E7FC0"/><stop offset=".38" stop-color="#14508E"/><stop offset=".75" stop-color="#1D2A53"/><stop offset="1" stop-color="#141D3B"/>'
     if dark else
     '<stop offset="0" stop-color="#D8EFFA"/><stop offset=".45" stop-color="#EEF8FD"/><stop offset="1" stop-color="#FFFFFF"/>'}
  </radialGradient>
  <radialGradient id="water-{t}" cx=".4" cy=".35" r=".75">
    <stop offset="0" stop-color="#3DB8EA"/><stop offset=".55" stop-color="{AZZURRO}"/><stop offset="1" stop-color="#0A6FAE"/>
  </radialGradient>
  <linearGradient id="cupbody-{t}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E4EEF6"/><stop offset="1" stop-color="#B9CCDD"/>
  </linearGradient>
  <linearGradient id="handle-{t}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#F4F8FB"/><stop offset="1" stop-color="#AFC3D6"/>
  </linearGradient>
  <radialGradient id="saucer-{t}" cx=".45" cy=".4" r=".6">
    {'<stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".85" stop-color="#FFFFFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".12"/>'
     if dark else
     '<stop offset="0" stop-color="#1D2A53" stop-opacity=".05"/><stop offset=".85" stop-color="#1D2A53" stop-opacity=".03"/><stop offset="1" stop-color="#1D2A53" stop-opacity=".08"/>'}
  </radialGradient>
  <linearGradient id="rim-{t}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="{'#FFFFFF' if dark else NAVY}" stop-opacity=".15"/>
  </linearGradient>
  <radialGradient id="glint">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <filter id="shadow-{t}" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="22" dy="30" stdDeviation="26" flood-color="#06102A" flood-opacity="{.55 if dark else .22}"/>
  </filter>
  <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".7" stop-color="#fff" stop-opacity="1"/>
  </linearGradient>
  <mask id="m-fade"><rect width="{W}" height="{H}" fill="url(#fade)"/></mask>
</defs>"""


def panel(t):
    dark = t == "notte"
    ring = BIANCO if dark else AZZURRO
    ring2 = CELESTE if dark else "#2F7FC1"
    c1 = (1390, 520, 250, 32)    # tazzina principale
    c2 = (1930, 1080, 170, 200)  # seconda tazzina, tagliata fuori formato
    head, accent = (BIANCO, CELESTE) if dark else (NAVY, AZZURRO)
    lines = [("Un caffè", head), ("è quasi", head), ("tutto acqua.", head),
             ("Il resto è", accent), ("compagnia.", accent)]
    txt = "\n".join(
        f'<text x="140" y="{260 + i * 140 + (40 if i >= 3 else 0)}" fill="{c}" font-family="{FONT}" '
        f'font-size="125" font-weight="700" letter-spacing="-1">{s}</text>'
        for i, (s, c) in enumerate(lines)
    )
    body = f"""{defs(t)}
<rect width="{W}" height="{H}" fill="url(#bg-{t})"/>
<g mask="url(#m-fade)">
  {ripples(c1[0], c1[1], c1[2] + 140, 1500, ring, .55 if dark else .5, 0.0)}
  {ripples(c2[0], c2[1], c2[2] + 120, 1300, ring2, .45 if dark else .28, 1.3)}
</g>
{cup("a", *c1, t)}
{cup("b", *c2, t)}
{txt}
{logo(140, 1065, 380, white=dark)}
"""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">\n'
        f"{body}\n</svg>\n"
    )


if __name__ == "__main__":
    for t in ("notte", "giorno"):
        (OUT_V2 / f"uniacque-relax-A2-onde-{t}.svg").write_text(panel(t))
        print("ok", t)
