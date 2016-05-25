<?php
/**
 * The template for displaying 404 pages (Not Found)
 *
 * @package WordPress
 * @subpackage Road_Themes
 * @since Road Themes 1.0
 */

get_header('error');
?>
	<div class="page-404">
		<div class="search-form">
			<h3><?php _e( 'PAGE NOT FOUND', 'roadthemes' ); ?></h3>
			<label><?php _e('Search our website', 'roadthemes');?></label>
			<?php get_search_form(); ?>
		</div>
	</div>
</div>
<?php get_footer('error'); ?>