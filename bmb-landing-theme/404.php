<?php
/**
 * 404
 *
 * @package BMB_Landing
 */
get_header(); ?>

<section class="bmb-section bmb-404">
	<div class="bmb-section__inner">
		<h1>404</h1>
		<p><?php esc_html_e( 'Pagina non trovata.', 'bmb-landing' ); ?></p>
		<a class="bmb-btn bmb-btn--accent" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( 'Torna alla home', 'bmb-landing' ); ?>
		</a>
	</div>
</section>

<?php get_footer();
