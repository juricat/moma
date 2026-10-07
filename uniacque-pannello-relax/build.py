"""Genera le 3 bozze del pannello zona relax Uniacque (2000 x 1200 mm, orizzontale).

Unità SVG = millimetri. Font: Century Gothic (istituzionale); in anteprima, se non
installato, ripiega su URW Gothic (disegno quasi identico).
"""
import base64
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / "bozze"
OUT.mkdir(exist_ok=True)

W, H = 2000, 1200
NAVY, AZZURRO, CELESTE, BIANCO = "#1D2A53", "#009EDA", "#79BEE2", "#FFFFFF"
FONT = "'Century Gothic', 'URW Gothic', 'Avant Garde', sans-serif"
LOGO_RATIO = 891 / 213


def data_uri(name):
    b = base64.b64encode((ROOT / "assets" / name).read_bytes()).decode()
    return f"data:image/png;base64,{b}"


def logo(x, y, w, white=False):
    name = "logo-uniacque-bianco.png" if white else "logo-uniacque-colori.png"
    return f'<image href="{data_uri(name)}" x="{x}" y="{y}" width="{w}" height="{w / LOGO_RATIO:.1f}"/>'


def text(lines, x, y, size, lead, weight=700, anchor="start"):
    """lines: lista di (testo, colore)."""
    out = []
    for i, (t, c) in enumerate(lines):
        out.append(
            f'<text x="{x}" y="{y + i * lead}" fill="{c}" font-family="{FONT}" '
            f'font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" '
            f'letter-spacing="-1">{t}</text>'
        )
    return "\n".join(out)


def svg(body, bg):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" '
        f'viewBox="0 0 {W} {H}">\n<rect width="{W}" height="{H}" fill="{bg}"/>\n{body}\n</svg>\n'
    )


# --- A · CERCHI ------------------------------------------------------------
# Tazzina vista dall'alto: dentro c'è acqua, una goccia appena caduta e i cerchi
# che si allargano. Fondo bianco, molto respiro, testo protagonista.
def concept_a():
    cx, cy = 1440, 560
    rings = "".join(
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{BIANCO}" '
        f'stroke-width="{sw}" opacity="{op}"/>'
        for r, sw, op in [(40, 10, 1), (95, 8, .85), (155, 6, .6), (215, 4, .35)]
    )
    body = f"""
<circle cx="{cx}" cy="{cy}" r="430" fill="#EAF6FC"/>
<rect x="{cx + 300}" y="{cy - 55}" width="210" height="110" rx="55" fill="{NAVY}"/>
<circle cx="{cx}" cy="{cy}" r="330" fill="{NAVY}"/>
<circle cx="{cx}" cy="{cy}" r="290" fill="{AZZURRO}"/>
{rings}
<circle cx="{cx}" cy="{cy}" r="14" fill="{BIANCO}"/>
{text([("Un caffè", NAVY), ("è quasi", NAVY), ("tutto acqua.", NAVY)], 140, 330, 125, 140)}
{text([("Il resto è", AZZURRO), ("compagnia.", AZZURRO)], 140, 790, 125, 140)}
<rect x="140" y="1050" width="1720" height="3" fill="{NAVY}" opacity=".15"/>
{logo(1460, 1075, 400)}
"""
    return svg(body, BIANCO)


# --- B · LIVELLO -------------------------------------------------------------
# Una linea d'acqua attraversa tutto il pannello e passa anche dentro la tazzina:
# stesso livello dentro e fuori. Grafica piatta, solo geometria.
def concept_b():
    lvl = 700
    cx = 1420
    top, bot = 470, 940
    half_top, half_bot = 250, 190
    # profilo tazzina (trapezio con fondo arrotondato)
    cup = (
        f"M{cx - half_top},{top} L{cx + half_top},{top} "
        f"L{cx + half_bot},{bot - 60} Q{cx + half_bot - 10},{bot} {cx + half_bot - 70},{bot} "
        f"L{cx - half_bot + 70},{bot} Q{cx - half_bot + 10},{bot} {cx - half_bot},{bot - 60} Z"
    )
    steam = "".join(
        f'<path d="M{x},420 c-40,-50 40,-90 0,-140 c-40,-50 40,-90 0,-140" fill="none" '
        f'stroke="{CELESTE}" stroke-width="14" stroke-linecap="round"/>'
        for x in (cx - 90, cx, cx + 90)
    )
    body = f"""
<rect x="0" y="{lvl}" width="{W}" height="{H - lvl}" fill="{AZZURRO}"/>
<rect x="{cx - 380}" y="{bot + 34}" width="760" height="26" rx="13" fill="{NAVY}"/>
<path d="M{cx + 225},{top + 80} a120,120 0 1,1 -30,230" fill="none" stroke="{NAVY}" stroke-width="34" stroke-linecap="round"/>
<clipPath id="cup"><path d="{cup}"/></clipPath>
<path d="{cup}" fill="{BIANCO}"/>
<rect x="0" y="{lvl}" width="{W}" height="{H}" fill="{AZZURRO}" clip-path="url(#cup)"/>
<path d="{cup}" fill="none" stroke="{NAVY}" stroke-width="34" stroke-linejoin="round"/>
{steam}
{text([("Qui l’acqua", NAVY), ("si prende", NAVY), ("una pausa.", NAVY)], 140, 230, 125, 140)}
{text([("Anche tu.", BIANCO)], 140, 880, 125, 140)}
{logo(140, 1060, 400, white=True)}
"""
    return svg(body, BIANCO)


# --- C · MARCHIO -------------------------------------------------------------
# Fondo blu notte. Le curve del pittogramma Uniacque, ingrandite e fuori formato,
# diventano una tazzina che "accoglie" la goccia. Da validare con il cliente:
# usa forme ispirate al marchio, non il marchio stesso.
def concept_c():
    body = f"""
<g transform="translate(90,0)">
<path d="M1150,250 C1070,640 1260,980 1680,1020" fill="none" stroke="#34477F" stroke-width="190"/>
<path d="M1790,150 C1950,430 1890,780 1560,870" fill="none" stroke="{AZZURRO}" stroke-width="130"/>
<path d="M1520,330 C1600,430 1630,510 1600,580 C1570,650 1470,650 1440,580 C1410,510 1440,430 1520,330 Z" fill="{CELESTE}"/>
</g>
{text([("Ogni buon", BIANCO), ("caffè comincia", BIANCO), ("da un’acqua", AZZURRO), ("buona.", AZZURRO)], 140, 300, 125, 145)}
{logo(140, 1035, 420, white=True)}
"""
    return svg(body, NAVY)


CONCEPTS = {
    "A-cerchi": concept_a,
    "B-livello": concept_b,
    "C-marchio": concept_c,
}

if __name__ == "__main__":
    for name, fn in CONCEPTS.items():
        (OUT / f"uniacque-relax-{name}.svg").write_text(fn())
        print("ok", name)
