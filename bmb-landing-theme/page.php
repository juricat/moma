<?php
/**
 * Page template (landing-style).
 *
 * @package BMB_Landing
 */
get_header(); ?>

<div class="bmb-landing-wrap">
	<?php
	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
	endif;
	?>
</div>

<?php get_footer();
