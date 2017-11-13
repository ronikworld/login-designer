/**
 * Scripts within the customizer controls window.
 *
 * Contextually shows the color hue control and informs the preview
 * when users open or close the front page sections section.
 */

( function( $ ) {

	// Extends our custom "upgrade" section.
	wp.customize.sectionConstructor['upgrade'] = wp.customize.Section.extend( {

		// No events for this type of section.
		attachEvents: function () {},

		// Always make the section active.
		isContextuallyActive: function () {
			return true;
		}
	} );

	wp.customize.bind( 'ready', function() {

		// We need to modify the Customizer's close link, if the user manually uploaded the plugin.
		$( '#customize-header-actions .customize-controls-close[href*="update.php?action=upload-plugin"]' ).each( function() {

			var old_url = $(this).attr( 'href' );
			var new_url = old_url.substring( 0, old_url.indexOf( 'update.php?action=upload-plugin' ) );

			$(this).attr( 'href', new_url );

		});

		// Detect when the Login Designer panel is expanded (or closed) so we can preview the login form easily.
		wp.customize.panel( 'login_designer', function( section ) {
			section.expanded.bind( function( isExpanding ) {

				// Value of isExpanding will = true if you're entering the section, false if you're leaving it.
				if ( isExpanding ) {

					// Only send the previewer to the login designer page, if we're not already on it.
					var current_url = wp.customize.previewer.previewUrl();
					var current_url = current_url.includes( login_designer_controls.login_designer_page );

					if ( ! current_url ) {
						wp.customize.previewer.send( 'login-designer-url-switcher', { expanded: isExpanding } );
					}

				} else {
					// Head back to the home page, if we leave the Login Designer panel.
					wp.customize.previewer.send( 'login-designer-back-to-home', { home_url: wp.customize.settings.url.home } );
					url = wp.customize.settings.url.home;
				}
			} );
		} );

		// Detect when the styles section is expanded (or closed) so we can show the Reset button accordingly.
		wp.customize.section( 'login_designer__section--styles', function( section ) {
			section.expanded.bind( function( isExpanding ) {
				// Value of isExpanding will = true if you're entering the section, false if you're leaving it.
				if ( isExpanding ) {
					$( '#customize-header-actions' ).addClass( 'style-editor-open' );
				} else {
					$( '#customize-header-actions' ).removeClass( 'style-editor-open' );
				}
			} );
		} );

		// Detect when the templates section is expanded (or closed) so we can hide the templates shortcut when it's open.
		wp.customize.section( 'login_designer__section--templates', function( section ) {
			section.expanded.bind( function( isExpanding ) {

				// Value of isExpanding will = true if you're entering the section, false if you're leaving it.
				if ( isExpanding ) {
					wp.customize.previewer.send( 'login-designer-template-switcher', { expanded: isExpanding } );
				} else {
					wp.customize.previewer.send( 'login-designer-template-switcher', { expanded: false } );
				}
			} );
		} );

		// Detect when the templates section is expanded (or closed) so we can hide the templates shortcut when it's open.
		wp.customize.section( 'login_designer__section--settings', function( section ) {
			section.expanded.bind( function( isExpanding ) {

				// Value of isExpanding will = true if you're entering the section, false if you're leaving it.
				if ( isExpanding ) {
					wp.customize.previewer.send( 'login-designer-settings', { expanded: isExpanding } );
				} else {
					wp.customize.previewer.send( 'login-designer-settings', { expanded: false } );
				}
			} );
		} );

		/**
		 * Function to hide/show Customizer options, based on another control.
		 *
		 * Parent option, Affected Control, Value which affects the control.
		 */
		function customizer_image_option_display( parent_setting, affected_control ) {
			wp.customize( parent_setting, function( setting ) {
				wp.customize.control( affected_control, function( control ) {
					var visibility = function() {
						if ( setting.get() && 'none' !== setting.get() ) {
							control.container.slideDown( 100 );
						} else {
							control.container.slideUp( 100 );
						}
					};

					visibility();
					setting.bind( visibility );
				});
			});
		}

		/**
		 * Function to hide/show Customizer options, based on another control.
		 *
		 * Parent option, Affected Control, Value which affects the control.
		 */
		function customizer_no_image_option_display( parent_setting, affected_control ) {
			wp.customize( parent_setting, function( setting ) {
				wp.customize.control( affected_control, function( control ) {
					var visibility = function() {
						if ( setting.get() ) {
							control.container.slideUp( 180 );
						}  else {
							control.container.slideDown( 180 );
						}
					};

					visibility();
					setting.bind( visibility );
				});
			});
		}

		/**
		 * Function to hide/show Customizer options, based on a range control value.
		 *
		 * Parent option, Affected Control, Value which affects the control.
		 */
		function customizer_range_option_display( parent_setting, affected_control, value ) {
			wp.customize( parent_setting, function( setting ) {
				wp.customize.control( affected_control, function( control ) {
					var visibility = function() {
						if ( value < setting.get() ) {
							control.container.slideDown( 180 );
						} else {
							control.container.slideUp( 180 );
						}
					};

					visibility();
					setting.bind( visibility );
				});
			});
		}

		/**
		 * Function to hide/show Customizer options, based on a checkbox value.
		 *
		 * Parent option, Affected Control, Value which affects the control.
		 */
		function customizer_checkbox_option_display( parent_setting, affected_control, value ) {
			wp.customize( parent_setting, function( setting ) {
				wp.customize.control( affected_control, function( control ) {
					var visibility = function() {
						if ( value === setting.get() ) {
							control.container.slideDown( 180 );
						} else {
							control.container.slideUp( 180 );
						}
					};

					visibility();
					setting.bind( visibility );
				});
			});
		}

		// Only show the border color style option, if the border is greater than zero.
		customizer_range_option_display( 'login_designer[field_border]', 'login_designer[field_border_color]', '0' );
		customizer_range_option_display( 'login_designer[button_border]', 'login_designer[button_border_color]', '0' );
		customizer_range_option_display( 'login_designer[checkbox_border]', 'login_designer[checkbox_border_color]', '0' );

		// Only show the shadow opacity style option, if the shadow is greater than zero.
		customizer_range_option_display( 'login_designer[form_shadow]', 'login_designer[form_shadow_opacity]', '0' );

		// Only show the shadow opacity and inset style options, if the shadow is greater than zero.
		customizer_range_option_display( 'login_designer[field_shadow]', 'login_designer[field_shadow_opacity]', '0' );
		customizer_range_option_display( 'login_designer[field_shadow]', 'login_designer[field_shadow_inset]', '0' );

		// Only show the background optios, if there is a background image uploaded.
		customizer_image_option_display( 'login_designer[bg_image]', 'login_designer[bg_repeat]' );
		customizer_image_option_display( 'login_designer[bg_image]', 'login_designer[bg_size]' );
		customizer_image_option_display( 'login_designer[bg_image]', 'login_designer[bg_attach]' );
		customizer_image_option_display( 'login_designer[bg_image]', 'login_designer[bg_position]' );

		// Only show the gallery if there is a gallery background image selected and it's not set to "none".
		customizer_image_option_display( 'login_designer[bg_image_gallery]', 'login_designer[bg_repeat]' );
		customizer_image_option_display( 'login_designer[bg_image_gallery]', 'login_designer[bg_size]' );
		customizer_image_option_display( 'login_designer[bg_image_gallery]', 'login_designer[bg_attach]' );
		customizer_image_option_display( 'login_designer[bg_image_gallery]', 'login_designer[bg_position]' );

		// Only show the gallery if there is no custom background image uploaded.
		customizer_no_image_option_display( 'login_designer[bg_image]', 'login_designer[bg_image_gallery]' );

		// Only show the login logo bits, if the login logo is not hidden.
		customizer_checkbox_option_display( 'login_designer[disable_logo]', 'login_designer[logo]', false );
		customizer_checkbox_option_display( 'login_designer[disable_logo]', 'login_designer[logo_margin_bottom]', false );
		customizer_checkbox_option_display( 'login_designer[disable_logo]', 'login_designer[logo_title]', false );
		customizer_checkbox_option_display( 'login_designer[disable_logo]', 'login_designer_settings[logo_url]', false );


























		// wp.customize( 'login_designer[template]', function( setting ) {

		// 	// Hide the form width option if "2" is selected.
		// 	wp.customize.control( 'login_designer[form_width]', function( control ) {
		// 		if ( '01' === setting.get() ) {
		// 			wp.customize.control( 'login_designer[form_width]' ).deactivate( { duration: 0 } );
		// 		} else {
		// 			wp.customize.control( 'login_designer[form_width]' ).activate( { duration: 0 } );
		// 		}
		// 	});

		// 	// Hide the form background color option if "2" or "3" is selected.
		// 	wp.customize.control( 'login_designer[form_bg]', function( control ) {
		// 		if ( '02' === setting.get() || '03' === setting.get()  ) {
		// 			wp.customize.control( 'login_designer[form_width]' ).deactivate( { duration: 0 } );
		// 		} else {
		// 			wp.customize.control( 'login_designer[form_width]' ).activate( { duration: 0 } );
		// 		}
		// 	});
		// });

		function template_reset_to_defaults() {

			// console.log( 'Defaults Reset' );

			// $( '#customize-control-login_designer-bg_image .remove-button' ).click();
			// $( '#customize-control-login_designer-logo .remove-button' ).click();

			for ( var key in login_designer_controls.template_defaults ) {

				var control 	= key;
				var value	= login_designer_controls.template_defaults[key];

				wp.customize( 'login_designer[' + control + ']' ).set( value );

			}
		}

		function template_set_defaults( template_defaults ) {

			// Now apply the template's custom style.
			for ( var key in template_defaults ) {

				var control 	= key;
				var value	= template_defaults[key];

				wp.customize( 'login_designer[' + control + ']' ).set( value );

			}
		}

		// Modify the background color based on the gallery image selected.
		wp.customize( 'login_designer[template]', function( value ) {

			value.bind( function( to ) {

				template_reset_to_defaults();

				if ( to === 'default' ) {
					template_set_defaults( login_designer_controls.template_defaults );
				} else if ( to === '01' ) {
					template_set_defaults( login_designer_controls.template_defaults_01 );
				} else if ( to === '02' ) {
					template_set_defaults( login_designer_controls.template_defaults_02 );
				} else if ( to === '03' ) {
					template_set_defaults( login_designer_controls.template_defaults_03 );
				} else if ( to === '04' ) {
					template_set_defaults( login_designer_controls.template_defaults_04 );
				} else if ( to === '05' ) {
					template_set_defaults( login_designer_controls.template_defaults_05 );
				} else if ( to === '06' ) {
					template_set_defaults( login_designer_controls.template_defaults_06 );
				} else if ( to === '07' ) {
					template_set_defaults( login_designer_controls.template_defaults_07 );
				} else if ( to === '08' ) {
					template_set_defaults( login_designer_controls.template_defaults_08 );
				} else if ( to === '09' ) {
					template_set_defaults( login_designer_controls.template_defaults_09 );
				} else if ( to === '10' ) {
					template_set_defaults( login_designer_controls.template_defaults_10 );
				}
			} );
		} );

		// Modify the background color based on the gallery image selected.
		// @todo — Test this and push it live.

		// wp.customize( 'login_designer[bg_image_gallery]', function( value ) {

		// 	value.bind( function( to ) {

		// 		var keys = [];
		// 		var values = [];

		// 		if ( login_designer_controls.extension_colors ) {
		// 			keys = Object.keys( login_designer_controls.extension_colors );
		// 			values = Object.values( login_designer_controls.extension_colors );
		// 		}

		// 		// console.log( 'keys:' + keys );

		// 		if ( keys.includes( to ) ) {

		// 			// If we have a custom background color, let's put it back to default.
		// 			wp.customize( 'login_designer[bg_color]' ).set( color );

		// 			// console.log( 'keys:');

		// 		}

		// 		if ( to === 'bg_01' ) {
		// 			color = '#e3ebee';
		// 		} else if ( to === 'bg_02' ) {
		// 			color = '#d0f1ec';
		// 		} else if ( to === 'bg_03' ) {
		// 			color = '#cccfd4';
		// 		} else if ( to === 'bg_04' ) {
		// 			color = '#d5aabb';
		// 		} else if ( to === 'bg_05' ) {
		// 			color = '#141611';
		// 		} else if ( to === 'bg_06' ) {
		// 			color = '#151515';
		// 		} else if ( to === 'bg_07' ) {
		// 			color = '#d0e4ec';
		// 		} else if ( to === 'bg_08' ) {
		// 			color = '#4b2d3f';
		// 		} else if ( to === 'bg_09' ) {
		// 			color = '#ed4844';
		// 		} else if ( to === 'bg_10' ) {
		// 			color = '#e3ebee';
		// 		} else if ( to === login_designer_controls.seasonal_option_01 ) {
		// 			color = login_designer_controls.seasonal_bg_color_01;
		// 		} else if ( to === login_designer_controls.seasonal_option_02 ) {
		// 			color = login_designer_controls.seasonal_bg_color_02;
		// 		} else if ( to === login_designer_controls.seasonal_option_03 ) {
		// 			color = login_designer_controls.seasonal_bg_color_03;
		// 		} else if ( to === login_designer_controls.seasonal_option_04 ) {
		// 			color = login_designer_controls.seasonal_bg_color_04;
		// 		} else if ( to === login_designer_controls.seasonal_option_05 ) {
		// 			color = login_designer_controls.seasonal_bg_color_05;
		// 		} else {
		// 			color = '#f1f1f1';
		// 		}

		// 		// If we have a custom background color, let's put it back to default.
		// 		wp.customize( 'login_designer[bg_color]' ).set( color );

		// 		// console.log( login_designer_controls.extension_bg_colors );

		// 		// console.log( to );
		// 	} );
		// } );

		// Modify the background color based on the gallery image selected.
		// wp.customize( 'login_designer[disable_logo]', function( value ) {

		// 	value.bind( function( to ) {

		// 		if ( to === true ) {
		// 			wp.customize( 'login_designer[logo_margin_bottom]' ).set( 25 );
		// 		}
		// 	} );
		// } );
	} );
} )( jQuery );
