/* Theme JS */

(function($) {
	"use strict";
	
	jQuery(document).ready(function(){
		
		//default menu
		//Horizontal dropdown menu
		jQuery('.nav-container ul.nav-menu').superfish({
			delay: 100,
			speed: 'fast'
		});
		
		//Mobile Menu
		var mobileMenuWrapper = jQuery('.mobile-menu-container');
		mobileMenuWrapper.find('.menu-item-has-children').each(function(){
			var linkItem = jQuery(this).find('a').first();
			linkItem.after('<i class="fa fa-plus"></i>');
		});
		//calculate the init height of menu
		var totalMenuLevelFirst = jQuery('.mobile-menu-container .nav-menu > li').length;
		var mobileMenuH = totalMenuLevelFirst*40 + 10; //40 is height of one item, 10 is padding-top + padding-bottom;
		
		jQuery('.mbmenu-toggler').on('click', function(){
			if(mobileMenuWrapper.hasClass('open')) {
				mobileMenuWrapper.removeClass('open');
				mobileMenuWrapper.animate({'height': 0}, 'fast');
			} else {
				mobileMenuWrapper.addClass('open');
				mobileMenuWrapper.animate({'height': mobileMenuH}, 'fast');
			}
		});
			//set the height of all li.menu-item-has-children items
		jQuery('.mobile-menu-container li.menu-item-has-children').each(function(){
			jQuery(this).css({'height': 40, 'overflow': 'hidden'});
		});
			//process the parent items
		jQuery('.mobile-menu-container li.menu-item-has-children').each(function(){
			var parentLi = jQuery(this);
			var dropdownUl = parentLi.find('ul.sub-menu').first();
			
			parentLi.find('.fa').first().on('click', function(){
				//set height is auto for all parents dropdown
				parentLi.parents('li.menu-item-has-children').css('height', 'auto');
				//set height is auto for menu wrapper
				mobileMenuWrapper.css({'height': 'auto'});
				
				var dropdownUlheight = dropdownUl.outerHeight() + 40;
				
				if(parentLi.hasClass('opensubmenu')) {
					parentLi.removeClass('opensubmenu');
					parentLi.animate({'height': 40}, 'fast', function(){
						//calculate new height of menu wrapper
						mobileMenuH = mobileMenuWrapper.outerHeight();
					});
					parentLi.find('.fa').first().removeClass('fa-minus');
					parentLi.find('.fa').first().addClass('fa-plus');
				} else {
					parentLi.addClass('opensubmenu');
					parentLi.animate({'height': dropdownUlheight}, 'fast', function(){
						//calculate new height of menu wrapper
						mobileMenuH = mobileMenuWrapper.outerHeight();
					});
					parentLi.find('.fa').first().addClass('fa-minus');
					parentLi.find('.fa').first().removeClass('fa-plus');
				}
				
			});
		});
		
		//Mini Cart
		if(jQuery(window).width() > 1024){
			jQuery('.widget_shopping_cart').on('mouseover', function(){
				var mCartHeight = jQuery('.mini_cart_inner').outerHeight();
				var cCartHeight = jQuery('.mini_cart_content').outerHeight();
				
				if(cCartHeight < mCartHeight) {
					jQuery('.mini_cart_content').stop(true, false).animate({'height': mCartHeight});
				}
			});
			jQuery('.widget_shopping_cart').on('mouseleave', function(){
				jQuery('.mini_cart_content').animate({'height':'0'});
			});
		}
			//For tablet & mobile
		jQuery('.widget_shopping_cart').on('click', function(event){
			if(jQuery(window).width() < 1025){
				var closed = false;
				var mCartHeight = jQuery('.mini_cart_inner').outerHeight();
				var mCartToggler = jQuery('.cart-toggler');
				if(jQuery('.mini_cart_content').height() == 0 ) {
					closed = true;
				}
				if (mCartToggler.is(event.target) || mCartToggler.has(event.target).length != 0 || mCartToggler.is(event.target) ) {
					event.preventDefault();
					if(closed) {
						jQuery('.mini_cart_content').animate({'height': mCartHeight});
						closed = false;
					} else {
						jQuery('.mini_cart_content').animate({'height':'0'}, function(){
							closed = true;
						});
					}
				}
			}
		});
		
		//add to cart callback
		jQuery('body').append('<div class="atc-notice-wrapper"><div class="atc-notice"></div><div class="close"><i class="fa fa-times-circle"></i></div></div>');
		
		jQuery('.atc-notice-wrapper .close').on('click', function(){
			jQuery('.atc-notice-wrapper').fadeOut();
			jQuery('.atc-notice').html('');
		});
		jQuery('body').on( 'adding_to_cart', function(event, button, data) {
			var ajaxPId = button.attr('data-product_id');
			var ajaxPQty = button.attr('data-quantity');
			
			//get product info by ajax
			jQuery.post(
				ajaxurl, 
				{
					'action': 'get_productinfo',
					'data':   {'pid': ajaxPId,'quantity': ajaxPQty}
				},
				function(response){
					jQuery('.atc-notice').html(response);
				}
			);
		});
		jQuery('body').on( 'added_to_cart', function(event, fragments, cart_hash) {
			//show product info after added
			jQuery('.atc-notice-wrapper').fadeIn();
		});
		
		//Brand logos carousel
		jQuery('.home-brands .wpb_wrapper > h3').each(function(){
			var pwidgetTitle = jQuery(this).html();
			jQuery(this).html('<span>'+pwidgetTitle+'</span>');
		});
		jQuery('.brands-carousel').slick({
			infinite: true,
			slidesToShow: road_brandnumber,
			slidesToScroll: road_brandscrollnumber,
			speed: road_brandanimate,
			easing: 'linear',
			autoplay: road_brandscroll,
			autoplaySpeed: road_brandpause,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 768,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		//Product Tabs - layout 1
		window.setTimeout(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.home-tabs.layout1 .wpb_content_element').length;
			jQuery('.home-tabs.layout1').prepend('<div class="container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.home-tabs.layout1 .home-tabs-title');
			jQuery('.home-tabs.layout1 .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'wpb_content_element-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#wpb_content_element-'+tabCount+' .shop-products', 4);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="wpb_content_element-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.home-tabs.layout1 .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.home-tabs.layout1 .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.home-tabs.layout1 .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.home-tabs.layout1 .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 4);
					});
				});
			});
			
		}, 1000 );
		
		//Product Tabs - layout 2
		window.setTimeout(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.home-tabs.layout2 .wpb_content_element').length;
			jQuery('.home-tabs.layout2').prepend('<div class="container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.home-tabs.layout2 .home-tabs-title');
			jQuery('.home-tabs.layout2 .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'wpb_content_element2-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#wpb_content_element2-'+tabCount+' .shop-products', 4);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="wpb_content_element2-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.home-tabs.layout2 .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.home-tabs.layout2 .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.home-tabs.layout2 .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.home-tabs.layout2 .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 4);
					});
				});
			});
			
		}, 1000 );
		
		//Product Tabs 3
		window.setTimeout(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.home-tabs.layout3 .wpb_content_element').length;
			jQuery('.home-tabs.layout3').prepend('<div class="container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.home-tabs.layout3 .home-tabs-title');
			jQuery('.home-tabs.layout3 .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'wpb_content_element3-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#wpb_content_element3-'+tabCount+' .shop-products', 4);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="wpb_content_element3-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.home-tabs.layout3 .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.home-tabs.layout3 .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.home-tabs.layout3 .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.home-tabs.layout3 .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 4);
					});
				});
			});
			
		}, 1000 );
		
		//Product Tabs 4
		window.setTimeout(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.home-tabs.layout4 .wpb_content_element').length;
			jQuery('.home-tabs.layout4').prepend('<div class="tab-title-container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.home-tabs.layout4 .home-tabs-title');
			jQuery('.home-tabs.layout4 .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'wpb_content_element4-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#wpb_content_element4-'+tabCount+' .shop-products', 3);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="wpb_content_element4-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.home-tabs.layout4 .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.home-tabs.layout4 .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.home-tabs.layout4 .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.home-tabs.layout4 .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 3);
					});
				});
			});
			
		}, 1000 );
		
		//Product Tabs 5
		window.setTimeout(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.home-tabs.layout5 .wpb_content_element').length;
			jQuery('.home-tabs.layout5').prepend('<div class="tab-title-container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.home-tabs.layout5 .home-tabs-title');
			jQuery('.home-tabs.layout5 .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'wpb_content_element5-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#wpb_content_element5-'+tabCount+' .shop-products', 3);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="wpb_content_element5-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.home-tabs.layout5 .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.home-tabs.layout5 .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.home-tabs.layout5 .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.home-tabs.layout5 .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 3);
					});
				});
			});
			
		}, 1000 );
		
		//Carousel Tabs - home 4
		jQuery('.tabs-title .wpb_wrapper > h3').each(function(){
			var pwidgetTitle = jQuery(this).html();
			jQuery(this).html('<span>'+pwidgetTitle+'</span>');
		});
		jQuery('.carousel-tabs.first').each(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.carousel-tabs.first .wpb_content_element').length;
			jQuery('.carousel-tabs.first .vc_column_container > .wpb_wrapper').append('<div class="tab-title-container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.carousel-tabs.first .home-tabs-title');
			
			jQuery('.carousel-tabs.first .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'carousel-tab1-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'first';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//first tab carousel
					roadtabCarousel('#carousel-tab1-'+tabCount+' .shop-products', 3);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="carousel-tab1-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.carousel-tabs.first .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.carousel-tabs.first .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.carousel-tabs.first .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.carousel-tabs.first .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 3);
					});
				});
			});
		});
		jQuery('.carousel-tabs.second').each(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.carousel-tabs.second .wpb_content_element').length;
			jQuery('.carousel-tabs.second .vc_column_container > .wpb_wrapper').append('<div class="tab-title-container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.carousel-tabs.second .home-tabs-title');
			
			jQuery('.carousel-tabs.second .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'carousel-tab2-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'second';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//second tab carousel
					roadtabCarousel('#carousel-tab2-'+tabCount+' .shop-products', 3);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="carousel-tab2-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.carousel-tabs.second .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.carousel-tabs.second .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.carousel-tabs.second .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.carousel-tabs.second .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 3);
					});
				});
			});
		});
		jQuery('.carousel-tabs.third').each(function(){
			var tabCount = 1;
			var tabTotal = jQuery('.carousel-tabs.third .wpb_content_element').length;
			jQuery('.carousel-tabs.third .vc_column_container > .wpb_wrapper').append('<div class="tab-title-container"><ul class="home-tabs-title"></ul></div>');
			var tabTitle = jQuery('.carousel-tabs.third .home-tabs-title');
			
			jQuery('.carousel-tabs.third .wpb_content_element').each(function(){
				var tabClass = '';
				var tabLinkClass = '';
				var tabWidget = jQuery(this);
				var widgetTitle = tabWidget.find('h3').html();
				tabWidget.attr('id', 'carousel-tab3-'+tabCount);
				
				if(tabCount==1) {
					tabClass = 'third';
					tabLinkClass = 'active';
					
					tabWidget.addClass('active');
					
					//third tab carousel
					roadtabCarousel('#carousel-tab3-'+tabCount+' .shop-products', 3);
				} else {
					jQuery(this).addClass('hide');
				}
				if(tabCount == tabTotal) {
					tabClass = 'last';
				}
				
				tabTitle.append('<li class="'+tabClass+'"><a class="tab-link '+tabLinkClass+'" href="#" rel="carousel-tab3-'+tabCount+'">'+widgetTitle+'</a></li>');
				
				tabCount++;
				
				//tab click
				jQuery('.carousel-tabs.third .tab-link').each(function(){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						var tabRel = jQuery(this).attr('rel');
						
						jQuery('.carousel-tabs.third .tab-link').removeClass('active');
						jQuery(this).addClass('active');
						
						jQuery('.carousel-tabs.third .wpb_content_element').addClass('hide');
						jQuery('#'+tabRel).removeClass('hide');
						
						jQuery('.carousel-tabs.third .wpb_content_element').removeClass('active');
						jQuery('#'+tabRel).addClass('active');
						
						//make carousel
						roadtabCarousel('#'+tabRel+' .shop-products', 3);
					});
				});
			});
		});

		//Products carousel
		jQuery('.products-carousel .wpb_wrapper > h3').each(function(){
			var pwidgetTitle = jQuery(this).html();
			jQuery(this).html('<span>'+pwidgetTitle+'</span>');
		});
		jQuery('.products-carousel .shop-products').slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			speed: 1000,
			easing: 'linear',
			//autoplay: true,
			autoplaySpeed: 3000,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		//Product carousel 2 - home 4
		jQuery('.products-carousel2 .wpb_wrapper > h3').each(function(){
			var pwidgetTitle = jQuery(this).html();
			jQuery(this).html('<span>'+pwidgetTitle+'</span>');
		});
		jQuery('.products-carousel2 .shop-products').slick({
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 1000,
			easing: 'linear',
			//autoplay: true,
			autoplaySpeed: 3000,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		jQuery('.posts-carousel').slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			speed: road_bloganimate,
			easing: 'linear',
			autoplay: road_blogscroll,
			autoplaySpeed: road_blogpause,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		jQuery('.testimonials-list').slick({
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: road_testianimate,
			easing: 'linear',
			autoplay: road_testiscroll,
			autoplaySpeed: road_testipause
		});
		
		//Cross-sells Products carousel
		jQuery('.cross-carousel .shop-products').slick({
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 1000,
			easing: 'linear',
			//autoplay: true,
			autoplaySpeed: 3000,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		//Image zoom
		jQuery('.zoom_in_marker').on('click', function(){
			jQuery.fancybox({
				href: jQuery('.woocommerce-main-image').attr('href'),
				openEffect: 'elastic',
				closeEffect: 'elastic'
			});
		});
		
		//Upsells Products carousel
		jQuery('.upsells .shop-products').slick({
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 1000,
			easing: 'linear',
			//autoplay: true,
			autoplaySpeed: 3000,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		//Related Products carousel
		jQuery('.related .shop-products').slick({
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 1000,
			easing: 'linear',
			//autoplay: true,
			autoplaySpeed: 3000,
			responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 960,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				  }
				}
			]
		});
		
		//Category view mode
		jQuery('.view-mode').each(function(){
			jQuery(this).find('.grid').on('click', function(event){
				event.preventDefault();
				
				jQuery('.view-mode').find('.grid').addClass('active');
				jQuery('.view-mode').find('.list').removeClass('active');
				
				jQuery('.shop-products').removeClass('list-view');
				jQuery('.shop-products').addClass('grid-view');
				
				jQuery('.list-col4').removeClass('col-xs-12 col-sm-4');
				jQuery('.list-col8').removeClass('col-xs-12 col-sm-8');
			});
			jQuery(this).find('.list').on('click', function(event){
				event.preventDefault();
			
				jQuery('.view-mode').find('.list').addClass('active');
				jQuery('.view-mode').find('.grid').removeClass('active');
				
				jQuery('.shop-products').addClass('list-view');
				jQuery('.shop-products').removeClass('grid-view');
				
				jQuery('.list-col4').addClass('col-xs-12 col-sm-4');
				jQuery('.list-col8').addClass('col-xs-12 col-sm-8');
			});
		});
		
		//Tooltip
		jQuery('.yith-wcwl-add-to-wishlist a').each(function(){
			roadtip(jQuery(this), 'html');
		});
		jQuery('.compare-button a').each(function(){
			roadtip(jQuery(this), 'html');
		});
		jQuery('.add_to_cart_inline a').each(function(){
			roadtip(jQuery(this), 'html');
		});
		jQuery('.detail-link.quickview .fa').each(function(){
			roadtip(jQuery(this), 'html');
		});
		jQuery('.sharefriend a').each(function(){
			roadtip(jQuery(this), 'html');
		});
		jQuery('.social-icons a').each(function(){
			roadtip(jQuery(this), 'title');
		});
		
		//Quickview
		jQuery('.product-wrapper').each(function(){
			
			jQuery(this).on('mouseover click', function(){
				jQuery(this).addClass('hover');
			});
			jQuery(this).on('mouseleave', function(){
				jQuery(this).removeClass('hover');
			});
		});
			//Add quick view box
		jQuery('body').append('<div class="quickview-wrapper"><div class="quick-modal"><span class="closeqv"><i class="fa fa-times"></i></span><div id="quickview-content"></div><div class="clearfix"></div></div></div>');
			//show quick view
		jQuery('.quickview').each(function(){
			var quickviewLink = jQuery(this);
			var productID = quickviewLink.attr('data-quick-id');
			quickviewLink.on('click', function(event){
				event.preventDefault();
				
				jQuery('#quickview-content').html(''); /*clear content*/
				
				jQuery('body').addClass('quickview');
				window.setTimeout(function(){
					jQuery('.quickview-wrapper').addClass('open');
					jQuery('.quick-modal').addClass('loading');
					
					jQuery.post(
						ajaxurl, 
						{
							'action': 'product_quickview',
							'data':   productID
						}, 
						function(response){
							jQuery('#quickview-content').html(response);
							
							jQuery('.quick-modal').removeClass('loading');
							/*variable product form*/
							jQuery( '.variations_form' ).wc_variation_form();
							jQuery( '.variations_form .variations select' ).change();
							
							/*thumbnails carousel*/
							jQuery('.quick-thumbnails')
							jQuery('.quick-thumbnails').slick({
								slidesToScroll: 1,
								slidesToShow: 4
							});
							/*thumbnail click*/
							jQuery('.quick-thumbnails a').each(function(){
								var quickThumb = jQuery(this);
								var quickImgSrc = quickThumb.attr('href');
								
								quickThumb.on('click', function(event){
									event.preventDefault();
									
									jQuery('.main-image').find('img').attr('src', quickImgSrc);
								});
							});
							/*review link click*/
							
							jQuery('.woocommerce-review-link').on('click', function(event){
								event.preventDefault();
								var reviewLink = jQuery('.see-all').attr('href');
								
								window.location.href = reviewLink + '#reviews';
							});
						}
					);
				}, 300);
			});
		});
		jQuery('.closeqv').on('click', function(event){
			jQuery('.quickview-wrapper').removeClass('open');
			
			window.setTimeout(function(){
				jQuery('body').removeClass('quickview');
			}, 500);
		});
		
		//push recent posts & recent comments into tabs
		var roadWidgets = 1;
		jQuery('.widget_road_widgets').each(function(){
			var roadTitle = jQuery(this).find('.widget-title').html();
			var roadWidgetId = jQuery(this).attr('id');
			if(roadWidgets == 1){
				jQuery(this).addClass('active');
				jQuery(this).before('<aside class="widget blog-tabs"><ul class="roadtabs"><li class="tab active" rel="'+roadWidgetId+'">'+roadTitle+'</li></ul>');
			} else {
				var tabUl = jQuery('.roadtabs').html();
				jQuery('.roadtabs').html(tabUl + '<li class="tab" rel="'+roadWidgetId+'">' + roadTitle + '</li>');
			}
			roadWidgets++;
		});
		jQuery('.roadtabs li').each(function(){
			var tabWidth = 100/(roadWidgets-1);
			
			jQuery(this).css('width', tabWidth + '%');
			
			jQuery(this).on('click', function(){
				var tabRel = jQuery(this).attr('rel');
				
				jQuery('.roadtabs .tab').removeClass('active');
				jQuery(this).addClass('active');
				
				jQuery('.widget_road_widgets').removeClass('active');
				jQuery('#'+tabRel).addClass('active');
			});
		});
		
		//Fancy box
		jQuery(".fancybox").fancybox({
			openEffect: 'elastic',
			closeEffect: 'fade',
			beforeShow: function () {
				if (this.title) {
					// New line
					this.title += '<div class="fancybox-social">';
					
					// Add tweet button
					this.title += '<a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-url="' + this.href + '">Tweet</a> ';
					
					// Add FaceBook like button
					this.title += '<iframe src="//www.facebook.com/plugins/like.php?href=' + this.href + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:110px; height:23px;" allowTransparency="true"></iframe></div>';
				}
			},
			afterShow: function() {
				// Render tweet button
				twttr.widgets.load();
			},
			helpers:  {
				title : {
					type : 'inside'
				},
				overlay : {
					showEarly : false
				}
			}
		});
		
		//Fancy box for single project
		jQuery(".prfancybox").fancybox({
			openEffect: 'fade',
			closeEffect: 'elastic',
			nextEffect: 'fade',
			prevEffect: 'fade',
			beforeShow: function () {
				if (this.title) {
					// New line
					this.title += '<div class="fancybox-social">';
					
					// Add tweet button
					this.title += '<a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-url="' + this.href + '">Tweet</a> ';
					
					// Add FaceBook like button
					this.title += '<iframe src="//www.facebook.com/plugins/like.php?href=' + this.href + '&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:110px; height:23px;" allowTransparency="true"></iframe></div>';
				}
			},
			afterShow: function() {
				// Render tweet button
				twttr.widgets.load();
			},
			helpers:  {
				title : {
					type : 'inside'
				},
				overlay : {
					showEarly : false
				},
				buttons	: {},
				thumbs	: {
					width	: 100,
					height	: 100
				}
			}
		});
  
		//Go to top
		jQuery('#back-top').on('click', function(){
			jQuery("html, body").animate({ scrollTop: 0 }, "slow");
		});
	});
	
	jQuery(document).mouseup(function (e) {
		var container = jQuery('.header-search .product-categories');

		if (!container.is(e.target) && container.has(e.target).length === 0 && !jQuery('.cate-toggler').is(e.target) ) { /* if the target of the click isn't the container nor a descendant of the container */
			if(jQuery('.header-search .product-categories').hasClass('open')) {
				jQuery('.header-search .product-categories').removeClass('open');
			}
		}
		
		container = jQuery('.atc-notice-wrapper');
		if (!container.is(e.target) && container.has(e.target).length === 0 ) {
			jQuery('.atc-notice-wrapper').fadeOut();
		}
	});
	
	// Scroll
	var currentP = 0;
	jQuery(window).scroll(function(){
		var headerH = jQuery('.header-container').height();
		var navH = jQuery('.nav-container').height();
		headerH+=navH;
		var scrollP = jQuery(window).scrollTop();
		if(jQuery(window).width() > 1024){
			if(scrollP != currentP){
				//Back to top
				if(scrollP >= headerH){
					jQuery('#back-top').addClass('show');
					jQuery('.nav-container').addClass('ontop');
				} else {
					jQuery('#back-top').removeClass('show');
					jQuery('.nav-container').removeClass('ontop');
				}
				currentP = jQuery(window).scrollTop();
			}
		}
	});
	
})(jQuery);

"use strict";

function RoadgetParameterByName(name, string) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(string);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Product tabs carousel
function roadtabCarousel(element, itemnumber) {
	jQuery(element).unslick();
	jQuery(element).slick({
		infinite: false,
		slidesToShow: itemnumber,
		slidesToScroll: 1,
		speed: 700,
		easing: 'linear',
		//autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
			  breakpoint: 1200,
			  settings: {
				slidesToShow: itemnumber,
				slidesToScroll: 1
			  }
			},
			{
			  breakpoint: 960,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			  }
			},
			{
			  breakpoint: 760,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			  }
			},
			{
			  breakpoint: 600,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		]
	});
}
//remove item from mini cart by ajax
function roadMiniCartRemove(url, itemid) {
	jQuery('.mini_cart_content').addClass('loading');
	jQuery('.cart-form').addClass('loading');
	
	jQuery.get( url, function(data,status){
		if(status=='success'){
			//update mini cart info
			jQuery.post(
				ajaxurl,
				{
					'action': 'get_cartinfo'
				}, 
				function(response){
					var cartinfo = response.split("|");
					var itemAmount = cartinfo[0];
					var cartTotal = cartinfo[1];
					var orderTotal = cartinfo[2];
					
					jQuery('.cart-quantity').html(itemAmount);
					jQuery('.cart-total .amount').html(cartTotal);
					jQuery('.total .amount').html(cartTotal);
					
					jQuery('.cart-subtotal .amount').html(cartTotal);
					jQuery('.order-total .amount').html(orderTotal);
				}
			);
			//remove item line from mini cart & cart page
			jQuery('#mcitem-' + itemid).animate({'height': '0', 'margin-bottom': '0', 'padding-bottom': '0', 'padding-top': '0'});
			setTimeout(function(){
				jQuery('#mcitem-' + itemid).remove();
				jQuery('#lcitem-' + itemid).remove();
				//set new height
				var mCartHeight = jQuery('.mini_cart_inner').outerHeight();
				jQuery('.mini_cart_content').animate({'height': mCartHeight});
			}, 1000);
			
			jQuery('.mini_cart_content').removeClass('loading');
			jQuery('.cart-form').removeClass('loading');
		}
	});
}
function roadtip(element, content) {
	if(content=='html'){
		var tipText = element.html();
	} else {
		var tipText = element.attr('title');
	}
	element.on('mouseover', function(){
		if(jQuery('.roadtip').length == 0) {
			element.before('<span class="roadtip">'+tipText+'</span>');
			
			var tipWidth = jQuery('.roadtip').outerWidth();
			var tipPush = -(tipWidth/2 - element.outerWidth()/2);
			jQuery('.roadtip').css('margin-left', tipPush);
		}
	});
	element.on('mouseleave', function(){
		jQuery('.roadtip').remove();
	});
}