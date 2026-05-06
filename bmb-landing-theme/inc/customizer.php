<?php
/**
 * Customizer: brand colors, header CTA, footer.
 *
 * @package BMB_Landing
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function bmb_customize_register( $wp_customize ) {

	$wp_customize->add_section( 'bmb_brand', array(
		'title'    => __( 'BMB - Brand', 'bmb-landing' ),
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'bmb_primary_color',  array( 'default' => '#0E294B', 'sanitize_callback' => 'sanitize_hex_color' ) );
	$wp_customize->add_setting( 'bmb_accent_color',   array( 'default' => '#0A75EB', 'sanitize_callback' => 'sanitize_hex_color' ) );

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'bmb_primary_color', array(
		'label'   => __( 'Colore Primario', 'bmb-landing' ),
		'section' => 'bmb_brand',
	) ) );
	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'bmb_accent_color', array(
		'label'   => __( 'Colore Accento (CTA)', 'bmb-landing' ),
		'section' => 'bmb_brand',
	) ) );

	$wp_customize->add_section( 'bmb_header', array(
		'title'    => __( 'BMB - Header', 'bmb-landing' ),
		'priority' => 31,
	) );
	$wp_customize->add_setting( 'bmb_header_cta_label', array( 'default' => 'Contattaci', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_setting( 'bmb_header_cta_url',   array( 'default' => '#contatti',  'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( 'bmb_header_cta_label', array( 'label' => __( 'CTA Label', 'bmb-landing' ),  'section' => 'bmb_header', 'type' => 'text' ) );
	$wp_customize->add_control( 'bmb_header_cta_url',   array( 'label' => __( 'CTA URL o #ancora', 'bmb-landing' ), 'section' => 'bmb_header', 'type' => 'text' ) );

	$wp_customize->add_section( 'bmb_footer', array(
		'title'    => __( 'BMB - Footer', 'bmb-landing' ),
		'priority' => 32,
	) );
	$wp_customize->add_setting( 'bmb_footer_text', array( 'default' => '© ' . date( 'Y' ) . ' BMB. Tutti i diritti riservati.', 'sanitize_callback' => 'wp_kses_post' ) );
	$wp_customize->add_control( 'bmb_footer_text', array( 'label' => __( 'Testo Footer', 'bmb-landing' ), 'section' => 'bmb_footer', 'type' => 'textarea' ) );
}
add_action( 'customize_register', 'bmb_customize_register' );

/**
 * Inietta le variabili CSS dal customizer.
 */
function bmb_customizer_css() {
	$primary = get_theme_mod( 'bmb_primary_color', '#0E294B' );
	$accent  = get_theme_mod( 'bmb_accent_color',  '#0A75EB' );
	?>
	<style id="bmb-customizer-vars">
		:root{
			--bmb-primary: <?php echo esc_attr( $primary ); ?>;
			--bmb-accent:  <?php echo esc_attr( $accent ); ?>;
		}
	</style>
	<?php
}
add_action( 'wp_head', 'bmb_customizer_css', 99 );
