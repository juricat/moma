<?php
/**
 * BMB Landing - functions.php
 *
 * @package BMB_Landing
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'BMB_THEME_VERSION', '1.0.0' );
define( 'BMB_THEME_DIR', get_template_directory() );
define( 'BMB_THEME_URI', get_template_directory_uri() );

/**
 * Theme setup
 */
function bmb_setup() {
	load_theme_textdomain( 'bmb-landing', BMB_THEME_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-logo', array(
		'height'      => 60,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	add_editor_style( 'assets/css/editor.css' );

	register_nav_menus( array(
		'primary' => __( 'Menu Principale', 'bmb-landing' ),
		'footer'  => __( 'Menu Footer', 'bmb-landing' ),
	) );
}
add_action( 'after_setup_theme', 'bmb_setup' );

/**
 * Front-end assets
 */
function bmb_enqueue_assets() {
	wp_enqueue_style(
		'bmb-style',
		get_stylesheet_uri(),
		array(),
		BMB_THEME_VERSION
	);
	wp_enqueue_style(
		'bmb-main',
		BMB_THEME_URI . '/assets/css/main.css',
		array( 'bmb-style' ),
		BMB_THEME_VERSION
	);
	wp_enqueue_style(
		'bmb-patterns',
		BMB_THEME_URI . '/assets/css/patterns.css',
		array( 'bmb-main' ),
		BMB_THEME_VERSION
	);
	wp_enqueue_style(
		'bmb-fonts',
		'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap',
		array(),
		null
	);
	// Material Symbols Sharp - design system BMB (weight 200, optical 40, no fill)
	wp_enqueue_style(
		'bmb-icons',
		'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@40,200,0,0&display=swap',
		array(),
		null
	);

	wp_enqueue_script(
		'bmb-animations',
		BMB_THEME_URI . '/assets/js/animations.js',
		array(),
		BMB_THEME_VERSION,
		true
	);
	wp_enqueue_script(
		'bmb-nav',
		BMB_THEME_URI . '/assets/js/navigation.js',
		array(),
		BMB_THEME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'bmb_enqueue_assets' );

/**
 * Editor assets (Gutenberg blocks UI)
 */
function bmb_enqueue_editor_assets() {
	wp_enqueue_script(
		'bmb-editor-shared',
		BMB_THEME_URI . '/assets/js/editor-shared.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		BMB_THEME_VERSION,
		true
	);
	wp_enqueue_style(
		'bmb-fonts-editor',
		'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'bmb-editor',
		BMB_THEME_URI . '/assets/css/editor.css',
		array(),
		BMB_THEME_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'bmb_enqueue_editor_assets' );

/**
 * Register custom block category
 */
function bmb_block_category( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'bmb',
				'title' => __( 'BMB Landing', 'bmb-landing' ),
				'icon'  => 'star-filled',
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'bmb_block_category', 10, 1 );

/**
 * Register all custom blocks via block.json
 */
function bmb_register_blocks() {
	$blocks = array( 'section', 'heading', 'paragraph', 'media', 'cta', 'list', 'machines' );
	foreach ( $blocks as $block ) {
		register_block_type( BMB_THEME_DIR . '/blocks/' . $block );
	}
}
add_action( 'init', 'bmb_register_blocks' );

require_once BMB_THEME_DIR . '/inc/menu-walker.php';
require_once BMB_THEME_DIR . '/inc/customizer.php';
require_once BMB_THEME_DIR . '/inc/block-patterns.php';

/**
 * Allow SVG uploads (utile per loghi/icone Figma)
 */
function bmb_allow_svg( $mimes ) {
	if ( current_user_can( 'manage_options' ) ) {
		$mimes['svg']  = 'image/svg+xml';
		$mimes['svgz'] = 'image/svg+xml';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'bmb_allow_svg' );

/**
 * Body classes
 */
function bmb_body_classes( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'bmb-landing';
	}
	return $classes;
}
add_filter( 'body_class', 'bmb_body_classes' );
