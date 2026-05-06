# BMB Landing - Tema WordPress

Tema landing-page completamente gestibile via Gutenberg, con blocchi custom in React.

## Installazione

1. Comprimi la cartella `bmb-landing-theme` in un file `.zip` (oppure usa `bmb-landing-theme.zip` se già fornito).
2. In WordPress: **Aspetto → Temi → Aggiungi nuovo → Carica tema** → seleziona lo zip → **Installa ora** → **Attiva**.
3. Vai su **Impostazioni → Lettura** → seleziona "Una pagina statica" e imposta una pagina come Home.
4. Modifica la Home con l'editor Gutenberg.

## Per ricreare il design del Figma in 1 click: usa i **Pattern**

In Gutenberg apri l'inserter e clicca sul tab **Pattern** → categoria **BMB Landing**.
Trovi 8 sezioni pixel-perfect pronte da inserire (e poi modificabili): `Hero full-bleed`,
`Sezione Macchine (cards)`, `Split immagine + accent`, `Card Case Study`, `About full-bleed`,
`Banner accent (siamo nel mondo)`, `Banda Fiera/Evento`, `Footer`. Esiste anche
**Landing completa** che inserisce tutte le sezioni in una pagina sola.

## Blocchi disponibili (categoria "BMB Landing")
   - **BMB Sezione** (contenitore con ID di ancoraggio + animazioni + sfondo)
   - **BMB Titolo** (H1-H6, dimensioni S/M/L/XL/XXL/XXXL, peso 300-800, MAIUSCOLO, link esterno o ancora interna)
   - **BMB Paragrafo** (grassetto/corsivo/link, dimensioni, MAIUSCOLO, larghezza adattata al testo o massima)
   - **BMB Punto Elenco** (puntato/numerato, marker dot/dash/check/freccia)
   - **BMB Media** (immagine o video YouTube/Vimeo/upload, ratio, link esterno o ancora)
   - **BMB CTA** (bottone con varianti, dimensioni, link esterno o ancora interna)

## Menu

**Aspetto → Menu**: crea un menu e assegnalo alle posizioni *Menu Principale* o *Menu Footer*.
Per ancoraggi interni inserisci una voce di tipo "Link personalizzato" con URL come `#contatti` (deve combaciare con l'`anchorId` della sezione di destinazione). Il tema fa scrolling fluido in automatico.

## Brand

**Aspetto → Personalizza → BMB - Brand**: imposta i colori primario e accent (vengono iniettati come variabili CSS `--bmb-primary` e `--bmb-accent`).
**BMB - Header**: etichetta + URL/ancora della CTA in alto a destra.
**BMB - Footer**: testo del footer.

## Animazioni

Ogni blocco ha un pannello "Animazioni" con animazione di **entrata** e **uscita** (fade, fade-up/down/left/right, zoom, slide). Le animazioni usano `IntersectionObserver` e rispettano `prefers-reduced-motion`.

## Note

- Il tema rispetta le linee guida WordPress: `theme.json` con palette, scala tipografica fluida e supporto Full Site editing parziale.
- I blocchi sono registrati via `register_block_type()` con `block.json` (API v3): nessun build webpack necessario.
- Responsive da mobile (320px) a desktop. Il menu mobile si apre come overlay full-screen.
- SVG abilitati per gli admin (utile per loghi Figma esportati).
