<?php
/**
 * The Template for displaying all single posts
 *
 * @package WordPress
 * @subpackage Road_Themes
 * @since Road Themes 1.0
 */

global $road_opt;

get_header();
?>
<div class="main-container page-wrapper">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<?php road_breadcrumb(); ?>
			</div>
			
			<?php if($road_opt['sidebarblog_pos']=='left') :?>
				<?php get_sidebar(); ?>
			<?php endif; ?>
			
			<div class="col-xs-12 <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>col-md-9<?php endif; ?>">
				<div class="page-content blog-page single">
					<?php while ( have_posts() ) : the_post(); ?>

						<?php get_template_part( 'content', get_post_format() ); ?>

						<?php comments_template( '', true ); ?>
						
						<nav class="nav-single">
							<!--<h3 class="assistive-text"><?php _e( 'Post navigation', 'roadthemes' ); ?></h3>-->
							<span class="nav-previous"><?php previous_post_link( '%link', '<span class="meta-nav">' . _x( '&larr;', 'Previous post link', 'roadthemes' ) . '</span> %title' ); ?></span>
							<span class="nav-next"><?php next_post_link( '%link', '%title <span class="meta-nav">' . _x( '&rarr;', 'Next post link', 'roadthemes' ) . '</span>' ); ?></span>
						</nav><!-- .nav-single -->
						
					<?php endwhile; // end of the loop. ?>
				</div>
			</div>
			<?php if( $road_opt['sidebarblog_pos']=='right' || !isset($road_opt['sidebarblog_pos']) ) :?>
				<?php get_sidebar(); ?>
			<?php endif; ?>
		</div>
	</div>
</div>

<?php get_footer(); ?>