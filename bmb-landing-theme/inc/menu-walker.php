<?php
/**
 * Custom menu walker che supporta ancore interne (#section-id) e link esterni.
 *
 * @package BMB_Landing
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class BMB_Menu_Walker extends Walker_Nav_Menu {

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$classes   = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'bmb-menu-item';

		$class_names = join( ' ', apply_filters( 'nav_menu_css_classes', array_filter( $classes ), $item, $args ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		$output .= '<li' . $class_names . '>';

		$href = ! empty( $item->url ) ? $item->url : '#';
		// Mantiene l'ancora se l'URL inizia con # (anchor link manuale)
		$attrs  = ' href="' . esc_url( $href, array( 'http', 'https', 'mailto', 'tel', '#' ) ) . '"';
		$attrs .= ! empty( $item->target ) ? ' target="' . esc_attr( $item->target ) . '"' : '';
		$attrs .= ! empty( $item->xfn )    ? ' rel="' . esc_attr( $item->xfn ) . '"'       : '';
		$attrs .= ' class="bmb-menu-link"';

		// Se l'URL è una pura ancora marca lo smooth-scroll
		if ( strpos( $href, '#' ) === 0 ) {
			$attrs .= ' data-bmb-anchor="true"';
		}

		$item_output  = $args->before;
		$item_output .= '<a' . $attrs . '>';
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}
