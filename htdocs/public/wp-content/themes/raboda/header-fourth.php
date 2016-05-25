<?php
/**
 * The Header template for our theme
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Road_Themes
 * @since Road Themes 1.0
 */
?>
<?php global $road_opt; 
if(is_ssl()){
	$road_opt['logo_main']['url'] = str_replace('http', 'https', $road_opt['logo_main']['url']);
}
?>
		<div class="header-container layout4">
			
			<div class="top-bar">
				<div class="container">
					<div class="topbar-content">

						<?php if( isset($road_opt['top_menu']) ) {
							$menu_object = wp_get_nav_menu_object( $road_opt['top_menu'] );
							$menu_args = array(
								'menu_class'      => 'nav_menu',
								'menu'         => $road_opt['top_menu'],
							); ?>
							<div class="top-menu widget">
								<?php wp_nav_menu( $menu_args ); ?>
							</div>
						<?php } ?>
						
						<?php if ( class_exists( 'WC_Widget_Cart' ) ) {
							the_widget('Custom_WC_Widget_Cart'); 
						} ?>

						<?php if( class_exists('WC_Widget_Product_Search') ) { ?>
							<div class="header-search">
								<?php the_widget('WC_Widget_Product_Search', array('title' => 'Search')); ?>
							</div>
						<?php } ?>
						
						<div class="top-message"><?php echo esc_html($road_opt['welcome_message']); ?></div>
					</div>
				</div>
			</div>
			
			<?php //endif; ?>
			<div class="header">
				<div class="container">
					<div class="header-inner">
						<div class="row">
							<div class="col-xs-12 col-md-3">
								<?php if( isset($road_opt['logo_main']['url']) ){ ?>
									<div class="logo"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><img src="<?php echo esc_url($road_opt['logo_main']['url']); ?>" alt="" /></a></div>
								<?php
								} else { ?>
									<h1 class="logo"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
									<?php
								} ?>
							</div>
							<div class="col-xs-12 col-md-9">
								<div class="nav-container">
									<div class="visible-large">
										<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container_class' => 'primary-menu-container', 'menu_class' => 'nav-menu' ) ); ?>
									</div>
									<div class="visible-small mobile-menu">
										<div class="mbmenu-toggler"><?php echo esc_html($road_opt['mobile_menu_label']);?><span class="mbmenu-icon"></span></div>
										<?php wp_nav_menu( array( 'theme_location' => 'mobilemenu', 'container_class' => 'mobile-menu-container', 'menu_class' => 'nav-menu' ) ); ?>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div><!-- .header -->
			<div class="clearfix"></div>
		</div>