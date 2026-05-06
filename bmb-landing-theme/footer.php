<?php
/**
 * Footer
 *
 * @package BMB_Landing
 */
?>
</main>

<footer class="bmb-footer">
	<div class="bmb-footer__inner">
		<div class="bmb-footer__text">
			<?php echo wp_kses_post( get_theme_mod( 'bmb_footer_text', '© ' . date( 'Y' ) . ' BMB.' ) ); ?>
		</div>

		<?php if ( has_nav_menu( 'footer' ) ) : ?>
			<nav class="bmb-footer__nav" aria-label="<?php esc_attr_e( 'Menu footer', 'bmb-landing' ); ?>">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'footer',
					'container'      => false,
					'menu_class'     => 'bmb-footer-menu',
					'walker'         => new BMB_Menu_Walker(),
					'depth'          => 1,
					'fallback_cb'    => false,
				) );
				?>
			</nav>
		<?php endif; ?>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
