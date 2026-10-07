"""Bozza v3: onde morbide + espresso, più calda (2000 x 1200 mm, orizzontale).

Parte dal riferimento del cliente: onde organiche nei blu Uniacque, tazzina vista
dall'alto, chicchi, accento marrone. Aggiunge calore: fondo crema, una corrente
d'acqua che diventa caffè avvicinandosi alla tazzina, luce morbida.
"""
import math
import random

from build import AZZURRO, CELESTE, NAVY, FONT, OUT, W, H, logo

OUT_V3 = OUT / "v3"
OUT_V3.mkdir(exist_ok=True)

CREMA_BG = "#FBF6EF"
CAFFE = "#6A3B1F"
CARAMELLO = "#C98A4B"
CELESTE_CHIARO = "#CFE9F7"

DEFS = f"""
<defs>
  <radialGradient id="warm" cx=".72" cy=".42" r=".55">
    <stop offset="0" stop-color="#F7E2C6" stop-opacity=".9"/><stop offset="1" stop-color="{CREMA_BG}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="g-azzurro" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#29B1E6"/><stop offset="1" stop-color="#0784C4"/>
  </linearGradient>
  <linearGradient id="g-navy" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#26407E"/><stop offset="1" stop-color="{NAVY}"/>
  </linearGradient>
  <linearGradient id="g-celeste" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{CELESTE}"/><stop offset="1" stop-color="#A9D8F0"/>
  </linearGradient>
  <!-- l'acqua che diventa caffè -->
  <linearGradient id="g-acqua-caffe" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{CELESTE}"/><stop offset=".45" stop-color="{AZZURRO}"/>
    <stop offset=".72" stop-color="#3C6E9C"/><stop offset=".86" stop-color="{CARAMELLO}"/><stop offset="1" stop-color="{CAFFE}"/>
  </linearGradient>
  <radialGradient id="g-espresso" cx=".46" cy=".44" r=".55">
    <stop offset="0" stop-color="#D9A266"/><stop offset=".35" stop-color="#C07E40"/>
    <stop offset=".72" stop-color="#8E4E24"/><stop offset=".92" stop-color="#5A2E15"/><stop offset="1" stop-color="#3A1C0C"/>
  </radialGradient>
  <linearGradient id="g-porcellana" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#F1ECE6"/><stop offset="1" stop-color="#D9D1C7"/>
  </linearGradient>
  <radialGradient id="g-piattino" cx=".42" cy=".38" r=".7">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset=".8" stop-color="#F2EDE7"/><stop offset="1" stop-color="#DCD3C8"/>
  </radialGradient>
  <radialGradient id="g-chicco" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#9A5A2E"/><stop offset=".6" stop-color="#5E3218"/><stop offset="1" stop-color="#341A0B"/>
  </radialGradient>
  <linearGradient id="g-goccia" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#BFE6F8"/><stop offset=".5" stop-color="{CELESTE}"/><stop offset="1" stop-color="#3FA9DD"/>
  </linearGradient>
  <filter id="ombra" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="18" dy="26" stdDeviation="22" flood-color="#3A2614" flood-opacity=".28"/>
  </filter>
  <filter id="ombra-lieve" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="6" dy="10" stdDeviation="8" flood-color="#2A1A0C" flood-opacity=".3"/>
  </filter>
  <filter id="ombra-onde" x="-10%" y="-10%" width="120%" height="120%">
    <feDropShadow dx="0" dy="-8" stdDeviation="14" flood-color="{NAVY}" flood-opacity=".18"/>
  </filter>
</defs>"""


def bean(x, y, rot, s=1.0):
    return f"""
<g transform="translate({x} {y}) rotate({rot}) scale({s})" filter="url(#ombra-lieve)">
  <ellipse rx="40" ry="54" fill="url(#g-chicco)"/>
  <path d="M2,-48 C-16,-18 18,14 -2,48" fill="none" stroke="#241106" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-16" cy="-20" rx="9" ry="20" fill="#FFFFFF" opacity=".16" transform="rotate(18 -16 -20)"/>
</g>"""


def drop(x, y, s=1.0, op=1.0):
    return f"""
<g transform="translate({x} {y}) scale({s})" opacity="{op}">
  <path d="M0,-120 C30,-70 78,-20 78,32 C78,78 43,110 0,110 C-43,110 -78,78 -78,32 C-78,-20 -30,-70 0,-120 Z" fill="url(#g-goccia)"/>
  <path d="M-38,20 C-40,-5 -26,-35 -12,-55" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity=".55"/>
</g>"""


def espresso(cx, cy):
    rnd = random.Random(7)
    spots = []
    for _ in range(180):  # tessitura della crema
        a = rnd.uniform(0, 2 * math.pi)
        r = 158 * math.sqrt(rnd.random())
        c = rnd.choice(["#E3B57F", "#B0703A", "#7C4220", "#D69A5C"])
        spots.append(
            f'<circle cx="{cx + r * math.cos(a):.1f}" cy="{cy + r * math.sin(a):.1f}" '
            f'r="{rnd.uniform(1.5, 7):.1f}" fill="{c}" opacity="{rnd.uniform(.1, .3):.2f}"/>'
        )
    for _ in range(40):  # bollicine sul bordo
        a = rnd.uniform(0, 2 * math.pi)
        r = rnd.uniform(140, 166)
        spots.append(
            f'<circle cx="{cx + r * math.cos(a):.1f}" cy="{cy + r * math.sin(a):.1f}" '
            f'r="{rnd.uniform(1.5, 4.5):.1f}" fill="#F3D9B5" opacity=".55"/>'
        )
    return f"""
<g filter="url(#ombra)">
  <circle cx="{cx}" cy="{cy}" r="300" fill="url(#g-piattino)"/>
</g>
<circle cx="{cx}" cy="{cy}" r="250" fill="none" stroke="#D8CFC4" stroke-width="3" opacity=".7"/>
<g filter="url(#ombra)">
  <rect x="{cx + 190}" y="{cy - 38}" width="140" height="76" rx="38" fill="url(#g-porcellana)"/>
  <circle cx="{cx}" cy="{cy}" r="212" fill="url(#g-porcellana)"/>
</g>
<circle cx="{cx}" cy="{cy}" r="176" fill="#E9E2D9"/>
<circle cx="{cx}" cy="{cy}" r="170" fill="url(#g-espresso)"/>
<clipPath id="tazza"><circle cx="{cx}" cy="{cy}" r="170"/></clipPath>
<g clip-path="url(#tazza)">
  {"".join(spots)}
  <ellipse cx="{cx - 70}" cy="{cy - 80}" rx="70" ry="26" fill="#FFFFFF" opacity=".12" transform="rotate(-30 {cx - 70} {cy - 80})"/>
</g>
<circle cx="{cx}" cy="{cy}" r="212" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".9"/>
<path d="M{cx - 190},{cy - 95} A212,212 0 0 1 {cx - 60},{cy - 203}" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".9"/>"""


def panel():
    cx, cy = 1490, 470
    waves = f"""
<!-- macchie a sinistra, tagliate fuori formato -->
<circle cx="-40" cy="230" r="300" fill="url(#g-azzurro)"/>
<circle cx="190" cy="430" r="150" fill="{CELESTE_CHIARO}" opacity=".9"/>
<circle cx="60" cy="560" r="230" fill="url(#g-navy)"/>
<circle cx="230" cy="470" r="70" fill="{CELESTE}" opacity=".85"/>

<!-- grande onda dietro la tazzina -->
<path d="M1060,300 C1120,120 1360,40 1560,80 C1800,130 1960,40 2000,10 L2000,660 C1880,760 1700,820 1520,770 C1300,710 1180,560 1060,300 Z" fill="url(#g-navy)"/>
<path d="M1700,0 L2000,0 L2000,420 C1900,330 1780,300 1740,200 C1710,120 1720,50 1700,0 Z" fill="url(#g-azzurro)" opacity=".95"/>
<path d="M1120,330 C1220,560 1380,690 1600,700 C1780,708 1900,640 2000,580 L2000,700 C1880,800 1700,850 1520,820 C1320,790 1180,640 1120,330 Z" fill="{CELESTE}" opacity=".9"/>

<!-- onde in basso, a strati -->
<g transform="translate(0 70)">
<g filter="url(#ombra-onde)">
<path d="M0,860 C260,760 470,800 700,880 C930,960 1120,900 1300,800 C1480,700 1700,700 2000,780 L2000,1200 L0,1200 Z" fill="{CELESTE_CHIARO}"/>
</g>
<g filter="url(#ombra-onde)">
<path d="M0,960 C240,880 460,900 690,960 C960,1030 1160,960 1360,880 C1560,800 1760,820 2000,900 L2000,1200 L0,1200 Z" fill="url(#g-celeste)"/>
</g>
<g filter="url(#ombra-onde)">
<path d="M0,1060 C300,990 520,1010 760,1060 C1000,1110 1200,1060 1420,990 C1640,920 1820,960 2000,1010 L2000,1200 L0,1200 Z" fill="url(#g-azzurro)"/>
</g>
<path d="M0,1140 C340,1100 560,1120 800,1150 C1040,1180 1240,1140 1480,1090 C1700,1045 1860,1070 2000,1100 L2000,1200 L0,1200 Z" fill="url(#g-navy)"/>
<rect y="1190" width="2000" height="80" fill="url(#g-navy)"/>
</g>

<!-- la corrente che diventa caffè: parte dall'acqua in basso e arriva alla tazzina -->
<path d="M620,1030 C900,990 1110,930 1230,790 C1280,730 1310,690 1345,650 C1340,720 1300,790 1250,840 C1110,975 900,1020 620,1030 Z" fill="url(#g-acqua-caffe)" opacity=".95"/>

<!-- linee sottili che scorrono -->
<path d="M980,1010 C1150,950 1220,860 1260,780" fill="none" stroke="{NAVY}" stroke-width="4" opacity=".55"/>

<path d="M1600,1200 C1650,1000 1820,900 2000,880" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".6"/>
<circle cx="1830" cy="160" r="230" fill="none" stroke="{NAVY}" stroke-width="3" opacity=".35"/>
"""
    accents = (
        drop(1250, 150, 0.85)
        + drop(1890, 820, 0.42, .95)
        + bean(1150, 380, -25, 1.1)
        + bean(1760, 690, 35, 1.0)
        + bean(1270, 690, 70, 0.8)
        + f'<circle cx="1110" cy="560" r="80" fill="{CELESTE}" opacity=".85"/>'
        + f'<circle cx="1205" cy="520" r="12" fill="{CAFFE}"/>'
        + f'<circle cx="1820" cy="330" r="16" fill="{CAFFE}"/>'
        + f'<circle cx="980" cy="980" r="14" fill="{CAFFE}"/>'
        + f'<circle cx="1690" cy="790" r="14" fill="#FFFFFF" opacity=".9"/>'
        + f'<circle cx="1050" cy="640" r="9" fill="{AZZURRO}"/>'
    )
    lines = [("Qui", NAVY), ("le buone idee", NAVY), ("scorrono", NAVY), ("anche con", NAVY), ("un caffè.", CAFFE)]
    txt = "\n".join(
        f'<text x="380" y="{340 + i * 112}" fill="{c}" font-family="{FONT}" font-size="100" '
        f'font-weight="700" letter-spacing="-1.5">{s}</text>'
        for i, (s, c) in enumerate(lines)
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
{DEFS}
<rect width="{W}" height="{H}" fill="{CREMA_BG}"/>
<rect width="{W}" height="{H}" fill="url(#warm)"/>
{waves}
{espresso(cx, cy)}
{accents}
{logo(380, 130, 380)}
{txt}
</svg>
"""


if __name__ == "__main__":
    (OUT_V3 / "uniacque-relax-v3-onde-caffe.svg").write_text(panel())
    print("ok")
