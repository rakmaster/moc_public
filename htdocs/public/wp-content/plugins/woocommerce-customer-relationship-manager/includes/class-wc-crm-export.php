<?php
/**
 * Class for Export
 *
 * @author   Actuality Extensions
 * @package  WC_CRM
 * @since    1.0
 */

if ( !defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class WC_CRM_Export {

	public static function init($ids = array())
	{
		global $wpdb;
		$guest = __('Guest', 'wc_crm');
		$enrolled_plain = "'No'";
		if ( woocommerce_crm_mailchimp_enabled() ) {
			$members = woocommerce_crm_get_members();
			if( !empty($members)){
				$enrolled_plain = "IF(customers.email IN('".implode("','", $members)."'), 'Yes', 'No') ";
			}
		}
		
		$filter = '';
		if(!empty($ids)){
			$filter = " AND customers.c_id IN(".implode(', ', $ids).")";
		}else{
		    $user_roles       = get_option( 'wc_crm_user_roles', array('customer') );
		    $guest_customers  = get_option( 'wc_crm_guest_customers', 'no' );
		    if( empty( $user_roles ) || !is_array( $user_roles ) ){
		    	$user_roles = array('customer');
		    }
		    foreach ($user_roles as $value) {
		      if ( !empty($filter)) $filter .=  ' OR ';
		      $filter .= "customers.capabilities LIKE '%{$value}%'";
		    }
		    if( $guest_customers == 'yes'){
		    	$filter .= " OR customers.capabilities = ''";
		    }
		    $filter = " AND (".$filter.')';
			
		}


		$query = "SELECT 
				CONCAT(customers.first_name, ' ', customers.last_name) as 'Customer name',
				IF(u1.meta_value is not NULL , u1.meta_value, p1.meta_value) as 'Billing Company',
				IF(u2.meta_value is not NULL, u2.meta_value, p2.meta_value) as 'Billing Address 1',
				IF(u3.meta_value is not NULL, u3.meta_value, p3.meta_value) as 'Billing Address 2',
				customers.city as 'Billing City',
				IF(u4.meta_value is not NULL, u4.meta_value, p4.meta_value) as 'Billing Postcode',
				customers.country as 'Billing Country',
				customers.state as 'Billing State/County',
				IF(u5.meta_value is not NULL, u5.meta_value, p5.meta_value) as 'Billing Email',
				customers.state as 'Billing Phone',
				IF(u6.meta_value is not NULL, u6.meta_value, p6.meta_value) as 'Shipping Company',
				IF(u7.meta_value is not NULL, u7.meta_value, p7.meta_value) as 'Shipping Address 1',
				IF(u8.meta_value is not NULL, u8.meta_value, p8.meta_value) as 'Shipping Address 2',
				IF(u9.meta_value is not NULL, u9.meta_value, p9.meta_value) as 'Shipping City',
				IF(u10.meta_value is not NULL, u10.meta_value, p10.meta_value) as 'Shipping Postcode',
				IF(u11	.meta_value is not NULL, u11.meta_value, p11.meta_value) as 'Shipping Country',
				IF(u12.meta_value is not NULL, u12.meta_value, p12.meta_value) as 'Shipping State/County',
				IF(users.user_login is not NULL, users.user_login, '{$guest}') as 'Username',
				IF( customers.last_purchase ='0000-00-00 00:00:00', '', customers.last_purchase) as 'Last purchase date',
				customers.num_orders as 'Number of orders',
				format(customers.order_value, 2) as 'Total value',
				{$enrolled_plain} as 'Subscribed'
				FROM {$wpdb->prefix}wc_crm_customer_list as customers
				LEFT JOIN {$wpdb->users} as users ON ( customers.user_id = users.ID )
				LEFT JOIN {$wpdb->usermeta} as u1 ON ( customers.user_id = u1.user_id AND u1.meta_key = 'billing_company' )
				LEFT JOIN {$wpdb->usermeta} as u2 ON ( customers.user_id = u2.user_id AND u2.meta_key = 'billing_address_1' )
				LEFT JOIN {$wpdb->usermeta} as u3 ON ( customers.user_id = u3.user_id AND u3.meta_key = 'billing_address_2' )
				LEFT JOIN {$wpdb->usermeta} as u4 ON ( customers.user_id = u4.user_id AND u4.meta_key = 'billing_postcode' )
				LEFT JOIN {$wpdb->usermeta} as u5 ON ( customers.user_id = u5.user_id AND u5.meta_key = 'billing_email' )
				LEFT JOIN {$wpdb->usermeta} as u6 ON ( customers.user_id = u6.user_id AND u6.meta_key = 'shipping_company' )
				LEFT JOIN {$wpdb->usermeta} as u7 ON ( customers.user_id = u7.user_id AND u7.meta_key = 'shipping_address_1' )
				LEFT JOIN {$wpdb->usermeta} as u8 ON ( customers.user_id = u8.user_id AND u8.meta_key = 'shipping_address_2' )
				LEFT JOIN {$wpdb->usermeta} as u9 ON ( customers.user_id = u9.user_id AND u9.meta_key = 'shipping_city' )
				LEFT JOIN {$wpdb->usermeta} as u10 ON ( customers.user_id = u10.user_id AND u10.meta_key = 'shipping_postcode' )
				LEFT JOIN {$wpdb->usermeta} as u11 ON ( customers.user_id = u11.user_id AND u11.meta_key = 'shipping_country' )
				LEFT JOIN {$wpdb->usermeta} as u12 ON ( customers.user_id = u12.user_id AND u12.meta_key = 'shipping_state' )
				
				LEFT JOIN {$wpdb->postmeta} as p1 ON ( customers.order_id = p1.post_id AND p1.meta_key = '_billing_company' )
				LEFT JOIN {$wpdb->postmeta} as p2 ON ( customers.order_id = p2.post_id AND p2.meta_key = '_billing_address_1' )
				LEFT JOIN {$wpdb->postmeta} as p3 ON ( customers.order_id = p3.post_id AND p3.meta_key = '_billing_address_2' )
				LEFT JOIN {$wpdb->postmeta} as p4 ON ( customers.order_id = p4.post_id AND p4.meta_key = '_billing_postcode' )
				LEFT JOIN {$wpdb->postmeta} as p5 ON ( customers.order_id = p5.post_id AND p5.meta_key = '_billing_email' )
				LEFT JOIN {$wpdb->postmeta} as p6 ON ( customers.order_id = p6.post_id AND p6.meta_key = '_shipping_company' )
				LEFT JOIN {$wpdb->postmeta} as p7 ON ( customers.order_id = p7.post_id AND p7.meta_key = '_shipping_address_1' )
				LEFT JOIN {$wpdb->postmeta} as p8 ON ( customers.order_id = p8.post_id AND p8.meta_key = '_shipping_address_2' )
				LEFT JOIN {$wpdb->postmeta} as p9 ON ( customers.order_id = p9.post_id AND p9.meta_key = '_shipping_city' )
				LEFT JOIN {$wpdb->postmeta} as p10 ON ( customers.order_id = p10.post_id AND p10.meta_key = '_shipping_postcode' )
				LEFT JOIN {$wpdb->postmeta} as p11 ON ( customers.order_id = p11.post_id AND p11.meta_key = '_shipping_country' )
				LEFT JOIN {$wpdb->postmeta} as p12 ON ( customers.order_id = p12.post_id AND p12.meta_key = '_shipping_state' )
				WHERE 1=1
				{$filter}
				";
				#echo '<textarea name="" id="" cols="30" rows="10">'.$query.'</textarea>';
		$result = $wpdb->query( "SET OPTION SQL_BIG_SELECTS = 1" );
		$result = $wpdb->get_results( $query, ARRAY_A );

		
		if($result){
			self::download_send_headers("customers_export_" . date("Y-m-d") . ".csv");
			echo self::array2csv($result);
			die();
		}
	}

	public static function download_send_headers($filename) {
	    // disable caching
	    $now = gmdate("D, d M Y H:i:s");
	    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
	    header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
	    header("Last-Modified: {$now} GMT");

	    // force download  
	    header("Content-Type: application/force-download");
	    header("Content-Type: application/octet-stream");
	    header("Content-Type: application/download");

	    // disposition / encoding on response body
	    header("Content-Disposition: attachment;filename={$filename}");
	    header("Content-Transfer-Encoding: binary");
	}

	public static function array2csv(array &$array)
	{
	   if (count($array) == 0) {
	     return null;
	   }
	   ob_start();
	   $df = fopen("php://output", 'w');
	   fputcsv($df, array_keys(reset($array)));
	   foreach ($array as $row) {
	      fputcsv($df, $row);
	   }
	   fclose($df);
	   return ob_get_clean();
	}
}