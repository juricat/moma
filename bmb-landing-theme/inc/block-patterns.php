<?php
/**
 * Block Patterns - composizioni Gutenberg pre-built che ricalcano le sezioni
 * del Figma BMB. L'utente le inserisce dal pannello "Pattern" e poi modifica
 * il contenuto.
 *
 * @package BMB_Landing
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Categoria pattern dedicata BMB.
 */
function bmb_register_pattern_category() {
	register_block_pattern_category( 'bmb', array(
		'label'       => __( 'BMB Landing', 'bmb-landing' ),
		'description' => __( 'Sezioni pronte tratte dal design BMB.', 'bmb-landing' ),
	) );
}
add_action( 'init', 'bmb_register_pattern_category' );

/**
 * Registra tutti i pattern.
 */
function bmb_register_patterns() {

	/* ============================================================
	 *  HERO full-bleed con immagine + H1 + 2 CTA
	 * ============================================================ */
	register_block_pattern( 'bmb/hero-fullbleed', array(
		'title'         => __( 'BMB - Hero full-bleed', 'bmb-landing' ),
		'description'   => __( 'Hero pixel-perfect: immagine full-bleed, overlay scuro, H1 centrato e 2 CTA.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'hero', 'header', 'banner' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:cover {"url":"https://images.unsplash.com/photo-1565043666747-69f6646db940?w=2000","dimRatio":60,"overlayColor":"primary","minHeight":640,"isDark":true,"align":"full","className":"bmb-pattern-hero"} -->
<div class="wp-block-cover alignfull is-dark bmb-pattern-hero" style="min-height:640px"><span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-60 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=2000" data-object-fit="cover"/><div class="wp-block-cover__inner-container">
<!-- wp:bmb/heading {"text":"Stampiamo soluzioni.<br>Modelliamo successi.<br>Dal 1967.","level":1,"size":"xxxl","weight":"700","align":"center","animationIn":"fade-up"} /-->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:bmb/cta {"label":"▶ GUARDA IL VIDEO","linkType":"external","linkUrl":"#video","variant":"white","size":"m","align":"center","icon":"none"} /-->

<!-- wp:bmb/cta {"label":"SCOPRI L\'AZIENDA","linkType":"anchor","linkUrl":"azienda","variant":"primary","size":"m","align":"center","icon":"none"} /-->
</div>
<!-- /wp:buttons -->
</div></div>
<!-- /wp:cover -->',
	) );

	/* ============================================================
	 *  SEZIONE MACCHINE - pixel-perfect Figma node 1006:2825
	 *  Layout 2 colonne: chip + H2 + paragrafo + chip tipologia + CTA
	 *  catalogo nav-blu a sx; carosello card che bleed a dx con dots.
	 * ============================================================ */
	register_block_pattern( 'bmb/section-machines', array(
		'title'         => __( 'BMB - Sezione Macchine (carosello)', 'bmb-landing' ),
		'description'   => __( 'Sezione macchine pixel-perfect: testo + chip a sinistra, carosello card che bleed a destra con dot pagination, CTA catalogo navy con quadrato bianco.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'macchine', 'macchinari', 'carousel', 'rail' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:html -->
<section class="bmb-machines-section" id="macchine" data-bmb-anim-in="fade-up" data-bmb-anim-out="none">
  <div class="bmb-machines-section__inner">

    <div class="bmb-machines-section__left">
      <span class="bmb-eyebrow-pill">Macchinari</span>
      <h2 class="bmb-machines__title">Per ogni prodotto, una macchina adatta</h2>
      <p class="bmb-machines__lead">Dal 2000 ad oggi, grazie a un\'evoluzione costante, la gamma <strong>Full electric</strong> può raggiungere le 1300 tonnellate, offrendo una soluzione performante, sostenibile e compatta per le esigenze più spinte del settore, garantendo precisione, velocità e bassi consumi energetici.</p>
      <p class="bmb-machines__subtitle">la nostra gamma è divisa in:</p>
      <div class="bmb-typology-chips">
        <a href="#tipologia-1" class="bmb-typology-chip"><span class="material-symbols-sharp bmb-typology-chip__icon">category</span>Tipologia</a>
        <a href="#tipologia-2" class="bmb-typology-chip"><span class="material-symbols-sharp bmb-typology-chip__icon">category</span>Tipologia</a>
        <a href="#tipologia-3" class="bmb-typology-chip"><span class="material-symbols-sharp bmb-typology-chip__icon">category</span>Tipologia</a>
        <a href="#tipologia-4" class="bmb-typology-chip"><span class="material-symbols-sharp bmb-typology-chip__icon">category</span>Tipologia</a>
      </div>
      <a href="#catalogo" class="bmb-catalog-cta">
        <span class="bmb-catalog-cta__label">sfoglia il nostro catalogo macchine.</span>
        <span class="bmb-catalog-cta__arrow" aria-hidden="true">↗</span>
      </a>
    </div>

    <div class="bmb-machines-section__right">
      <div class="bmb-cards-rail" data-bmb-rail role="region" aria-label="Carosello macchine">
        <article class="bmb-card-machine">
          <div class="bmb-card-machine__media"><img src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=900&auto=format&fit=crop" alt="Nome Macchina" loading="lazy"/></div>
          <span class="bmb-card-machine__chip"><span class="material-symbols-sharp">category</span>Tipologia</span>
          <div class="bmb-card-machine__footer">
            <h3 class="bmb-card-machine__name">Nome Macchina</h3>
            <a href="#dettaglio-1" class="bmb-card-machine__cta" aria-label="Vai al dettaglio macchina">↗</a>
          </div>
        </article>
        <article class="bmb-card-machine">
          <div class="bmb-card-machine__media"><img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&auto=format&fit=crop" alt="Nome Macchina" loading="lazy"/></div>
          <span class="bmb-card-machine__chip"><span class="material-symbols-sharp">category</span>Tipologia</span>
          <div class="bmb-card-machine__footer">
            <h3 class="bmb-card-machine__name">Nome Macchina</h3>
            <a href="#dettaglio-2" class="bmb-card-machine__cta" aria-label="Vai al dettaglio macchina">↗</a>
          </div>
        </article>
        <article class="bmb-card-machine">
          <div class="bmb-card-machine__media"><img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&auto=format&fit=crop" alt="Nome Macchina" loading="lazy"/></div>
          <span class="bmb-card-machine__chip"><span class="material-symbols-sharp">category</span>Tipologia</span>
          <div class="bmb-card-machine__footer">
            <h3 class="bmb-card-machine__name">Nome Macchina</h3>
            <a href="#dettaglio-3" class="bmb-card-machine__cta" aria-label="Vai al dettaglio macchina">↗</a>
          </div>
        </article>
        <article class="bmb-card-machine">
          <div class="bmb-card-machine__media"><img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900&auto=format&fit=crop" alt="Nome Macchina" loading="lazy"/></div>
          <span class="bmb-card-machine__chip"><span class="material-symbols-sharp">category</span>Tipologia</span>
          <div class="bmb-card-machine__footer">
            <h3 class="bmb-card-machine__name">Nome Macchina</h3>
            <a href="#dettaglio-4" class="bmb-card-machine__cta" aria-label="Vai al dettaglio macchina">↗</a>
          </div>
        </article>
      </div>
      <div class="bmb-cards-rail__dots" role="tablist" aria-label="Pagina carosello">
        <button type="button" class="bmb-cards-rail__dot bmb-cards-rail__dot--active" data-bmb-rail-dot="0" aria-label="Vai alla card 1"></button>
        <button type="button" class="bmb-cards-rail__dot" data-bmb-rail-dot="1" aria-label="Vai alla card 2"></button>
        <button type="button" class="bmb-cards-rail__dot" data-bmb-rail-dot="2" aria-label="Vai alla card 3"></button>
        <button type="button" class="bmb-cards-rail__dot" data-bmb-rail-dot="3" aria-label="Vai alla card 4"></button>
      </div>
    </div>

  </div>
</section>
<!-- /wp:html -->',
	) );

	/* ============================================================
	 *  SPLIT BLU 50/50 - immagine + accent block
	 * ============================================================ */
	register_block_pattern( 'bmb/split-accent', array(
		'title'         => __( 'BMB - Split immagine + accent', 'bmb-landing' ),
		'description'   => __( 'Due colonne 50/50: immagine a sinistra, blocco blu accent con H2 + paragrafo + CTA a destra.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'split', 'consulenza', 'industries' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:columns {"align":"full","className":"bmb-split is-style-bmb-split","style":{"spacing":{"blockGap":{"top":"0","left":"0"}}}} -->
<div class="wp-block-columns alignfull bmb-split is-style-bmb-split">
<!-- wp:column {"width":"55%","className":"bmb-split__media"} -->
<div class="wp-block-column bmb-split__media" style="flex-basis:55%">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"0"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600" alt="" style="border-radius:0"/></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"45%","style":{"color":{"background":"#0E294B","text":"#ffffff"},"spacing":{"padding":{"top":"clamp(2rem,4vw,4rem)","right":"clamp(2rem,4vw,4rem)","bottom":"clamp(2rem,4vw,4rem)","left":"clamp(2rem,4vw,4rem)"}}},"className":"bmb-split__panel"} -->
<div class="wp-block-column bmb-split__panel has-text-color has-background" style="color:#fff;background-color:#0E294B;padding:clamp(2rem,4vw,4rem);flex-basis:45%">
<!-- wp:bmb/heading {"text":"Consulenza","level":2,"size":"xxl","weight":"600","animationIn":"fade-up"} /-->

<!-- wp:bmb/paragraph {"text":"Il nostro ufficio tecnico è composto da un team di ingegneri e specialisti altamente qualificati nei settori della meccanica, del software e della progettazione elettrica.","size":"l"} /-->

<!-- wp:bmb/cta {"label":"Scopri i pacchetti che offriamo","linkType":"anchor","linkUrl":"pacchetti","variant":"white","size":"m","icon":"arrow"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->',
	) );

	/* ============================================================
	 *  CASE STUDY CARD - card grigia 50/50 con immagine + H + P + CTA
	 * ============================================================ */
	register_block_pattern( 'bmb/case-study', array(
		'title'         => __( 'BMB - Card Case Study', 'bmb-landing' ),
		'description'   => __( 'Card su sfondo grigio chiaro con immagine 50/50 + tag + H + paragrafo + CTA.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'case', 'storia', 'card' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"xl","contentWidth":"wide","animationIn":"fade-up"} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-xl" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:columns {"verticalAlignment":"center","style":{"color":{"background":"#F1F5F9"},"spacing":{"padding":{"top":"clamp(1.5rem,3vw,2.5rem)","right":"clamp(1.5rem,3vw,2.5rem)","bottom":"clamp(1.5rem,3vw,2.5rem)","left":"clamp(1.5rem,3vw,2.5rem)"}},"border":{"radius":"14px"}},"className":"bmb-card-split"} -->
<div class="wp-block-columns are-vertically-aligned-center bmb-card-split has-background" style="border-radius:14px;background-color:#F1F5F9;padding:clamp(1.5rem,3vw,2.5rem)">
<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200","imageAlt":"Case study","ratio":"4-3","size":"full","rounded":"m"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/paragraph {"text":"<strong>tag editoriale</strong>","size":"s","uppercase":true,"maxWidth":"content","style":{"color":{"text":"#0A75EB","background":"#E3F0FF"},"spacing":{"padding":{"top":"4px","right":"10px","bottom":"4px","left":"10px"}},"border":{"radius":"4px"}}} /-->

<!-- wp:bmb/heading {"text":"Titolo case study Case lorem ipsum dolores amet","level":2,"size":"xl","weight":"600"} /-->

<!-- wp:bmb/paragraph {"text":"Lorem ipsum dolor sit amet consectetur. Massa tellus mus nisl lacus orci. In donec scelerisque consequat tempor odio bibendum. Purus in pharetra.","size":"m"} /-->

<!-- wp:bmb/cta {"label":"SCOPRI IL CASE","linkType":"anchor","linkUrl":"case","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:bmb/cta {"label":"leggi altre storie di successo","linkType":"anchor","linkUrl":"stories","variant":"primary","size":"m","fullWidth":true,"icon":"arrow"} /-->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  ABOUT FULL-BLEED - immagine cover + H2 centrato + 2 CTA
	 * ============================================================ */
	register_block_pattern( 'bmb/about-fullbleed', array(
		'title'         => __( 'BMB - About full-bleed', 'bmb-landing' ),
		'description'   => __( 'Sezione full-bleed con immagine, overlay scuro e claim centrato.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'about', 'azienda' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:cover {"url":"https://images.unsplash.com/photo-1565043666747-69f6646db940?w=2000","dimRatio":50,"overlayColor":"primary","minHeight":520,"isDark":true,"align":"full","className":"bmb-pattern-about"} -->
<div class="wp-block-cover alignfull is-dark bmb-pattern-about" style="min-height:520px"><span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-50 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=2000" data-object-fit="cover"/><div class="wp-block-cover__inner-container">
<!-- wp:bmb/paragraph {"text":"About BMB","size":"s","uppercase":true,"align":"center","maxWidth":"content"} /-->

<!-- wp:bmb/heading {"text":"testo che richiama l\'azienda","level":2,"size":"xxl","weight":"600","align":"center","animationIn":"zoom-in"} /-->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:bmb/cta {"label":"▶ GUARDA IL VIDEO","linkType":"external","linkUrl":"#video","variant":"white","size":"m","align":"center","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"SCOPRI L\'AZIENDA","linkType":"anchor","linkUrl":"azienda","variant":"primary","size":"m","align":"center","icon":"none"} /-->
</div>
<!-- /wp:buttons -->
</div></div>
<!-- /wp:cover -->',
	) );

	/* ============================================================
	 *  CTA STRIP ACCENT (siamo in tutto il mondo)
	 * ============================================================ */
	register_block_pattern( 'bmb/cta-world', array(
		'title'         => __( 'BMB - Banner accent (siamo nel mondo)', 'bmb-landing' ),
		'description'   => __( 'Banda accent 50/50 con immagine + claim + CTA freccia.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'banner', 'cta', 'mondo' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:bmb/section {"anchorId":"contatti","verticalPad":"l","contentWidth":"wide","style":{"color":{"background":"#0E294B","text":"#ffffff"}}} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-l has-text-color has-background" id="contatti" style="color:#fff;background-color:#0E294B" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:columns {"verticalAlignment":"center"} -->
<div class="wp-block-columns are-vertically-aligned-center">
<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200","imageAlt":"","ratio":"1-1","size":"full","rounded":"m"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/heading {"text":"siamo in tutto il mondo","level":2,"size":"xxl","weight":"600"} /-->
<!-- wp:bmb/paragraph {"text":"cerca il consulente che fa per te","size":"l"} /-->
<!-- wp:bmb/cta {"label":"↗","linkType":"anchor","linkUrl":"mappa","variant":"white","size":"m","icon":"none"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  FIERA STRIP - banda compatta MECSPE
	 * ============================================================ */
	register_block_pattern( 'bmb/fiera-strip', array(
		'title'         => __( 'BMB - Banda Fiera/Evento', 'bmb-landing' ),
		'description'   => __( 'Banda compatta con badge fiera + data + CTA.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'fiera', 'evento', 'mecspe' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"m","contentWidth":"wide"} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-m" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:group {"style":{"color":{"background":"#F1F5F9"},"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}},"border":{"radius":"10px"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group has-background" style="border-radius:10px;background-color:#F1F5F9;padding:24px">
<!-- wp:bmb/heading {"text":"MECSPE","level":3,"size":"m","weight":"700","uppercase":true,"style":{"color":{"background":"#0E294B","text":"#ffffff"},"spacing":{"padding":{"top":"12px","right":"20px","bottom":"12px","left":"20px"}},"border":{"radius":"8px"}}} /-->

<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"4px"}}} -->
<div class="wp-block-group">
<!-- wp:bmb/paragraph {"text":"<strong>CI TROVI IN FIERA MECSPE</strong>","size":"s","uppercase":true} /-->
<!-- wp:bmb/paragraph {"text":"dalle <strong>00:00</strong> alle <strong>00:00</strong> il <strong>00/00/2025</strong>","size":"m"} /-->
</div>
<!-- /wp:group -->

<!-- wp:bmb/cta {"label":"↗","linkType":"anchor","linkUrl":"fiera","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:group -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  FOOTER COMPLETO
	 * ============================================================ */
	register_block_pattern( 'bmb/footer-block', array(
		'title'         => __( 'BMB - Footer (4 colonne + contatti)', 'bmb-landing' ),
		'description'   => __( 'Footer su sfondo navy: logo + 3 colonne menu + 3 colonne contatti.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'footer' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"l","contentWidth":"wide","style":{"color":{"background":"#0E294B","text":"#ffffff"}}} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-l has-text-color has-background" style="color:#fff;background-color:#0E294B" data-bmb-anim-in="none" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column {"width":"180px"} -->
<div class="wp-block-column" style="flex-basis:180px">
<!-- wp:bmb/heading {"text":"BMB","level":3,"size":"xl","weight":"800","uppercase":true,"style":{"color":{"background":"#ffffff","text":"#0E294B"},"spacing":{"padding":{"top":"20px","right":"20px","bottom":"20px","left":"20px"}},"border":{"radius":"8px"}}} /-->
<!-- wp:bmb/paragraph {"text":"LE NOSTRE BUSINESS UNIT","size":"s","uppercase":true} /-->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/heading {"text":"MENU","level":4,"size":"s","weight":"600","uppercase":true} /-->
<!-- wp:bmb/list {"items":"<li>AZIENDA</li><li>MACCHINE</li><li>INDUSTRIES</li><li>FILOSOFIA PROGETTUALE</li><li>PORTFOLIO</li><li>LAVORA CON NOI</li>","marker":"none","size":"s"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/heading {"text":"MACCHINE","level":4,"size":"s","weight":"600","uppercase":true} /-->
<!-- wp:bmb/list {"items":"<li>eXOn HYBRID</li><li>eXOn HP</li><li>eXOn FULL ELECTRIC</li><li>eXOn HL</li><li>IO</li>","marker":"none","size":"s"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/heading {"text":"INDUSTRY","level":4,"size":"s","weight":"600","uppercase":true} /-->
<!-- wp:bmb/list {"items":"<li>AUTOMOTIVE</li><li>PACKAGING</li><li>PREFORMS</li><li>TAPPI</li><li>APPLICAZIONI SPECIALI</li><li>GRANDI PROGETTI</li>","marker":"none","size":"s"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:separator {"backgroundColor":"white","style":{"color":{"background":"rgba(255,255,255,.15)"}}} -->
<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-background" style="background-color:rgba(255,255,255,.15)"/>
<!-- /wp:separator -->

<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/paragraph {"text":"<strong>SEDE CENTRALE</strong>","size":"s"} /-->
<!-- wp:bmb/cta {"label":"+39 035.22.99.99","linkType":"external","linkUrl":"tel:+39035229999","variant":"white","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/paragraph {"text":"<strong>SERVIZIO CLIENTI</strong>","size":"s"} /-->
<!-- wp:bmb/cta {"label":"+39 035.22.99.99","linkType":"external","linkUrl":"tel:+39035229999","variant":"white","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:bmb/paragraph {"text":"<strong>TROVA IL TUO REFERENTE BMB</strong>","size":"s"} /-->
<!-- wp:bmb/cta {"label":"VAI A CONTATTI","linkType":"anchor","linkUrl":"contatti","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  CARD PRODOTTO (verticale - design system Figma)
	 * ============================================================ */
	register_block_pattern( 'bmb/card-prodotto', array(
		'title'         => __( 'BMB - Card Prodotto', 'bmb-landing' ),
		'description'   => __( 'Card prodotto verticale: immagine + tag + nome macchina + tasto freccia ↗ in cerchio.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'card', 'prodotto', 'macchina' ),
		'viewportWidth' => 320,
		'content'       => '<!-- wp:group {"className":"bmb-card-prodotto","style":{"color":{"background":"#ffffff"},"spacing":{"padding":{"top":"16px","right":"16px","bottom":"16px","left":"16px"}},"border":{"radius":"10px","width":"1px","color":"#E2E8F0"}}} -->
<div class="wp-block-group bmb-card-prodotto has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:10px;background-color:#fff;padding:16px">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"","imageAlt":"Macchina","ratio":"4-3","size":"full","rounded":"m"} /-->
<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group">
<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:bmb/paragraph {"text":"<span class=\"bmb-tag\">Tipologia</span>","size":"s","maxWidth":"content"} /-->
<!-- wp:bmb/heading {"text":"Nome Macchina","level":3,"size":"m","weight":"500"} /-->
</div>
<!-- /wp:group -->

<!-- wp:bmb/cta {"label":"↗","linkType":"anchor","linkUrl":"dettaglio","variant":"accent","size":"s","icon":"none","className":"bmb-circle-cta"} /-->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->',
	) );

	/* ============================================================
	 *  CARD ARTICOLO (orizzontale large)
	 * ============================================================ */
	register_block_pattern( 'bmb/card-articolo', array(
		'title'         => __( 'BMB - Card Ultimo Articolo', 'bmb-landing' ),
		'description'   => __( 'Card orizzontale 50/50: immagine + tag pill + H2 + paragrafo + CTA SCOPRI IL CASE.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'articolo', 'case', 'card' ),
		'viewportWidth' => 1440,
		'content'       => '<!-- wp:columns {"verticalAlignment":"center","style":{"color":{"background":"#FFFFFF"},"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}},"border":{"radius":"10px","width":"1px","color":"#E2E8F0"}},"className":"bmb-card-articolo"} -->
<div class="wp-block-columns are-vertically-aligned-center bmb-card-articolo has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:10px;background-color:#fff;padding:24px">
<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"","imageAlt":"Case","ratio":"4-3","size":"full","rounded":"m"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/paragraph {"text":"<span class=\"bmb-tag\">tag industry</span>","size":"s","maxWidth":"content"} /-->
<!-- wp:bmb/heading {"text":"Titolo case study Case study lorem ipsum dolores amet","level":2,"size":"xl","weight":"700"} /-->
<!-- wp:bmb/paragraph {"text":"Lorem ipsum dolor sit amet consectetur. Massa tellus mus nisl lacus orci. In donec scelerisque consequat tempor odio bibendum.","size":"m"} /-->
<!-- wp:bmb/cta {"label":"SCOPRI IL CASE","linkType":"anchor","linkUrl":"case","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->',
	) );

	/* ============================================================
	 *  CONTAINER GRUPPO INIEZIONE (descrizione tecnica + immagine)
	 * ============================================================ */
	register_block_pattern( 'bmb/container-tech', array(
		'title'         => __( 'BMB - Container Descrizione Tecnica', 'bmb-landing' ),
		'description'   => __( 'Layout 50/50 testo + immagine con CTA in basso, ideale per descrivere componenti tecnici.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'container', 'tecnico', 'descrizione' ),
		'viewportWidth' => 1240,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"l","contentWidth":"wide","animationIn":"fade-up"} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-l" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:columns {"verticalAlignment":"center","className":"bmb-container-tech"} -->
<div class="wp-block-columns are-vertically-aligned-center bmb-container-tech">
<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/heading {"text":"Gruppo di iniezione","level":2,"size":"xl","weight":"700"} /-->
<!-- wp:bmb/paragraph {"text":"Il sistema è azionato da due motori sincroni raffreddati a liquido, ciascuno con funzione dedicata: uno per il movimento assiale di iniezione, l\'altro per la rotazione della vite durante la plastificazione.","size":"m"} /-->
<!-- wp:bmb/paragraph {"text":"L\'integrazione diretta del motore Torque sull\'asse del pistone, senza riduttori o cinghie, diminuisce drasticamente gli interventi di manutenzione ordinaria e migliora la risposta dinamica del sistema.","size":"m"} /-->
<!-- wp:bmb/paragraph {"text":"Le prestazioni si adattano a diverse composizioni e garantiscono versatilità operativa su un\'ampia gamma di prodotti.","size":"m"} /-->
<!-- wp:bmb/cta {"label":"CHIAMA","linkType":"external","linkUrl":"tel:+39000000000","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"","imageAlt":"Gruppo iniezione","ratio":"4-3","size":"full","rounded":"m"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  CONTAINER + CHIPS TECNOLOGIE
	 * ============================================================ */
	register_block_pattern( 'bmb/container-chips', array(
		'title'         => __( 'BMB - Container con Tecnologie usate', 'bmb-landing' ),
		'description'   => __( 'Layout 50/50 immagine + descrizione con elenco chip "tecnologie usate" sotto.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'container', 'tecnologie', 'chip' ),
		'viewportWidth' => 1240,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"l","contentWidth":"wide","style":{"color":{"background":"#F1F5F9"}},"animationIn":"fade-up"} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-l has-background" style="background-color:#F1F5F9" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--wide">

<!-- wp:columns {"verticalAlignment":"center"} -->
<div class="wp-block-columns are-vertically-aligned-center">
<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/media {"mediaType":"image","imageUrl":"","imageAlt":"Applicazione","ratio":"4-3","size":"full","rounded":"m"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center">
<!-- wp:bmb/heading {"text":"Contenitore per alimenti a parete sottile","level":3,"size":"l","weight":"600"} /-->
<!-- wp:bmb/paragraph {"text":"La produzione di contenitori a parete sottile presso BMB avviene attraverso un processo altamente specializzato, utilizzando macchinari all\'avanguardia. Ogni fase, dalla progettazione alla realizzazione, è meticolosamente ottimizzata per garantire efficienza e qualità, assicurando che i prodotti finali siano leggeri ma resistenti.","size":"m"} /-->
<!-- wp:bmb/paragraph {"text":"<strong>tecnologie usate</strong>","size":"s","uppercase":true,"maxWidth":"content"} /-->
<!-- wp:buttons {"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-buttons">
<!-- wp:bmb/cta {"label":"imi","linkType":"anchor","linkUrl":"imi","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"stampaggio multicolore","linkType":"anchor","linkUrl":"multicolore","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"stampaggio multicomponente","linkType":"anchor","linkUrl":"multicomp","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"over injection","linkType":"anchor","linkUrl":"over","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"camera bianca","linkType":"anchor","linkUrl":"camera","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"stack mould","linkType":"anchor","linkUrl":"stack","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"insert loading","linkType":"anchor","linkUrl":"insert","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"stampaggio tecnico","linkType":"anchor","linkUrl":"tecnico","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"injection compression","linkType":"anchor","linkUrl":"injection","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"microstampaggio","linkType":"anchor","linkUrl":"micro","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"stampaggio materiale riciclato","linkType":"anchor","linkUrl":"riciclato","variant":"accent","size":"s","icon":"none"} /-->
<!-- wp:bmb/cta {"label":"pet-preforms","linkType":"anchor","linkUrl":"pet","variant":"accent","size":"s","icon":"none"} /-->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  FAQ - accordion (details/summary)
	 * ============================================================ */
	register_block_pattern( 'bmb/faq', array(
		'title'         => __( 'BMB - FAQ accordion', 'bmb-landing' ),
		'description'   => __( 'Lista FAQ con domande espandibili, sfondo blu chiaro per la domanda attiva.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'faq', 'accordion', 'domande' ),
		'viewportWidth' => 900,
		'content'       => '<!-- wp:bmb/section {"verticalPad":"l","contentWidth":"standard","animationIn":"fade-up"} -->
<section class="wp-block-bmb-section bmb-section bmb-section--vp-l" data-bmb-anim-in="fade-up" data-bmb-anim-out="none" data-bmb-anim-delay="0"><div class="bmb-section__inner bmb-section__inner--standard">

<!-- wp:html -->
<details class="bmb-faq" open>
<summary class="bmb-faq__q">Domanda tipo per la sezione faq?<span class="bmb-faq__toggle" aria-hidden="true">⊕</span></summary>
<div class="bmb-faq__a">La risposta a una domanda tecnica per la sezione FAQ dovrebbe fornire informazioni dettagliate e chiare. È importante spiegare il concetto in modo che anche chi non ha familiarità con il tema possa comprendere. Ad esempio, se la domanda riguarda la configurazione di un software, si potrebbe descrivere passo dopo passo come procedere, includendo eventuali suggerimenti utili e avvertenze per evitare errori comuni. In questo modo, gli utenti possono trovare facilmente le informazioni di cui hanno bisogno e sentirsi supportati nel loro utilizzo del prodotto.</div>
</details>

<details class="bmb-faq">
<summary class="bmb-faq__q">Domanda tipo per la sezione faq?<span class="bmb-faq__toggle" aria-hidden="true">⊕</span></summary>
<div class="bmb-faq__a">Risposta…</div>
</details>

<details class="bmb-faq">
<summary class="bmb-faq__q">Domanda tipo per la sezione faq?<span class="bmb-faq__toggle" aria-hidden="true">⊕</span></summary>
<div class="bmb-faq__a">Risposta…</div>
</details>
<!-- /wp:html -->

</div></section>
<!-- /wp:bmb/section -->',
	) );

	/* ============================================================
	 *  PAGINA COMPLETA - tutto in uno
	 * ============================================================ */
	register_block_pattern( 'bmb/full-landing', array(
		'title'         => __( 'BMB - Landing completa (tutte le sezioni)', 'bmb-landing' ),
		'description'   => __( 'Pagina landing pronta: hero + macchine + 2 split + case study + about + team + contatti + fiera + footer. Punto di partenza ideale.', 'bmb-landing' ),
		'categories'    => array( 'bmb' ),
		'keywords'      => array( 'landing', 'completa', 'starter' ),
		'viewportWidth' => 1440,
		'blockTypes'    => array( 'core/post-content' ),
		'content'       => '<!-- wp:pattern {"slug":"bmb/hero-fullbleed"} /-->
<!-- wp:pattern {"slug":"bmb/section-machines"} /-->
<!-- wp:pattern {"slug":"bmb/split-accent"} /-->
<!-- wp:pattern {"slug":"bmb/case-study"} /-->
<!-- wp:pattern {"slug":"bmb/about-fullbleed"} /-->
<!-- wp:pattern {"slug":"bmb/cta-world"} /-->
<!-- wp:pattern {"slug":"bmb/fiera-strip"} /-->',
	) );
}
add_action( 'init', 'bmb_register_patterns' );
