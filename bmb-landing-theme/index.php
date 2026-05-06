<?php
/**
 * Default index.
 *
 * @package BMB_Landing
 */
get_header(); ?>

<div class="bmb-page">
	<?php
	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'bmb-article' ); ?>>
				<header class="bmb-article__header">
					<h1><?php the_title(); ?></h1>
				</header>
				<div class="bmb-article__content">
					<?php the_content(); ?>
				</div>
			</article>
			<?php
		endwhile;
	endif;
	?>
</div>

<?php get_footer();
