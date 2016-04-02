<?php
/**
 * The sidebar containing the main widget area
 *
 * @package WordPress
 * @subpackage sgwindow
 * @since SG Window 1.0.0
 */
 
$sgwindow_curr_slug = sgwindow_get_sidebar_slug();
$hook_name = 'sgwindow_empty_column_1-'.$sgwindow_curr_slug;
?>

<div class="sidebar-1">
	<div class="column small">		
		<div class="widget-area">
		<?php

			/*$index = 'column-1'.'-'.$sgwindow_curr_slug;
			print $index."<br/>";
			$index = ( is_int($index) ) ? "sidebar-$index" : sanitize_title($index);
			$sidebars_widgets = wp_get_sidebars_widgets();
			print_r($sidebars_widgets);
			print "<br/>";
			print "<br/>";
			$is_active_sidebar = ! empty( $sidebars_widgets[$index] );
			print_r($is_active_sidebar);
			print "*";*/
			if ( is_active_sidebar( 'column-1'.'-'.$sgwindow_curr_slug ) ) : ?>
				<?php dynamic_sidebar( 'column-1'.'-'.$sgwindow_curr_slug ); ?>

		<?php else : ?>

				<?php do_action( $hook_name ); ?>
		
		<?php endif; ?>
		</div><!-- .widget-area -->
	</div><!-- .column -->
</div><!-- .sidebar-1 -->