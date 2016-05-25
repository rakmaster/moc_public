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
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<?php global $road_opt; ?>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<?php 
if(isset($road_opt['opt-favicon']) && $road_opt['opt-favicon']!="") { 
	if(is_ssl()){
		$road_opt['opt-favicon'] = str_replace('http', 'https', $road_opt['opt-favicon']);
	}
?>
	<link rel="icon" type="image/png" href="<?php echo esc_url($road_opt['opt-favicon']['url']);?>">
<?php } ?>
<?php // Loads HTML5 JavaScript file to add support for HTML5 elements in older IE versions. ?>
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->
<script type="text/javascript">
var road_brandnumber = <?php if(isset($road_opt['brandnumber'])) { echo esc_js($road_opt['brandnumber']); } else { echo '6'; } ?>,
	road_brandscroll = <?php echo esc_js($road_opt['brandscroll'])==1 ? 'true': 'false'; ?>,
	road_brandscrollnumber = <?php if(isset($road_opt['brandscrollnumber'])) { echo esc_js($road_opt['brandscrollnumber']); } else { echo '2';} ?>,
	road_brandpause = <?php if(isset($road_opt['brandpause'])) { echo esc_js($road_opt['brandpause']); } else { echo '3000'; } ?>,
	road_brandanimate = <?php if(isset($road_opt['brandanimate'])) { echo esc_js($road_opt['brandanimate']); } else { echo '700';} ?>;
var road_blogscroll = <?php echo esc_js($road_opt['blogscroll'])==1 ? 'true': 'false'; ?>,
	road_blogpause = <?php if(isset($road_opt['blogpause'])) { echo esc_js($road_opt['blogpause']); } else { echo '3000'; } ?>,
	road_bloganimate = <?php if(isset($road_opt['bloganimate'])) { echo esc_js($road_opt['bloganimate']); } else { echo '700'; } ?>;
var road_testiscroll = <?php echo esc_js($road_opt['testiscroll'])==1 ? 'true': 'false'; ?>,
	road_testipause = <?php if(isset($road_opt['testipause'])) { echo esc_js($road_opt['testipause']); } else { echo '3000'; } ?>,
	road_testianimate = <?php if(isset($road_opt['testianimate'])) { echo esc_js($road_opt['testianimate']); } else { echo '700'; } ?>;
var road_menu_number = <?php if(isset($road_opt['categories_menu_items'])) { echo esc_js((int)$road_opt['categories_menu_items']+1); } else { echo '9';} ?>;
</script>
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="yith-wcwl-popup-message" style="display:none;"><div id="yith-wcwl-message"></div></div>
<div class="wrapper <?php if($road_opt['page_layout']=='box'){echo 'box-layout';}?>">
	<div class="page-wrapper">
	<?php
	if ( $road_opt['header_layout']=='default' || !isset($road_opt['header_layout'])) {
		get_header('first');
	} else {
		get_header($road_opt['header_layout']);
	}
	?>