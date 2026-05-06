<?php
/**
 * Header
 *
 * @package BMB_Landing
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="bmb-skip-link" href="#main"><?php esc_html_e( 'Vai al contenuto', 'bmb-landing' ); ?></a>

<header class="bmb-header" data-bmb-header>
	<div class="bmb-header__inner">
		<div class="bmb-header__brand">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a class="bmb-header__title" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php bloginfo( 'name' ); ?>
				</a>
			<?php endif; ?>
		</div>

		<button class="bmb-header__toggle" aria-expanded="false" aria-controls="bmb-primary-menu" data-bmb-menu-toggle>
			<span class="screen-reader-text"><?php esc_html_e( 'Apri/chiudi menu', 'bmb-landing' ); ?></span>
			<span class="bmb-burger"><span></span><span></span><span></span></span>
		</button>

		<nav class="bmb-header__nav" id="bmb-primary-menu" aria-label="<?php esc_attr_e( 'Menu principale', 'bmb-landing' ); ?>">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'bmb-menu',
					'walker'         => new BMB_Menu_Walker(),
					'fallback_cb'    => false,
				) );
			}
			?>

			<?php
			$cta_label = get_theme_mod( 'bmb_header_cta_label', 'Contattaci' );
			$cta_url   = get_theme_mod( 'bmb_header_cta_url',   '#contatti' );
			if ( $cta_label && $cta_url ) :
				$is_anchor = strpos( $cta_url, '#' ) === 0;
			?>
				<a class="bmb-btn bmb-btn--accent bmb-header__cta"
				   href="<?php echo esc_url( $cta_url, array( 'http', 'https', 'mailto', 'tel', '#' ) ); ?>"
				   <?php echo $is_anchor ? 'data-bmb-anchor="true"' : ''; ?>>
					<?php echo esc_html( $cta_label ); ?>
				</a>
			<?php endif; ?>
		</nav>
	</div>
</header>

<main id="main" class="bmb-main">
