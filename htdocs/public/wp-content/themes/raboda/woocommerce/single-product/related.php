<?php
/**
 * Related Products
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $product, $woocommerce_loop, $road_opt, $road_productrows, $road_productsfound;
$related = $product->get_related( $posts_per_page );

if ( sizeof( $related ) == 0 ) return;

$args = apply_filters( 'woocommerce_related_products_args', array(
	'post_type'            => 'product',
	'ignore_sticky_posts'  => 1,
	'no_found_rows'        => 1,
	'posts_per_page'       => $posts_per_page,
	'orderby'              => $orderby,
	'post__in'             => $related,
	'post__not_in'         => array( $product->id )
) );

$products = new WP_Query( $args );

$road_productsfound = $products->post_count;

$woocommerce_loop['columns'] = 3;
$road_productrows = 3;

if ( $products->have_posts() ) :
?>
<div class="widget related_products_widget">
	<h3 class="widget-title"><span><?php echo esc_html($road_opt['related_title']); ?></span></h3>
	
	<div class="related products">

		<?php woocommerce_product_loop_start(); ?>

			<?php while ( $products->have_posts() ) : $products->the_post(); ?>

				<?php wc_get_template_part( 'content', 'product' ); ?>

			<?php endwhile; // end of the loop. ?>

		<?php woocommerce_product_loop_end(); ?>

	</div>
</div>

<?php endif;

$woocommerce_loop['columns'] = 1;
$road_productrows = 1;

wp_reset_postdata();
