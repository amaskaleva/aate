<?php
/**
 * The sidebar containing the front page widget areas.
 * If there are no active widgets, the sidebar will be hidden completely.
 *
 * @package Tatva
 * @since Tatva 1.0
 */

if ( is_active_sidebar( 'sidebar-footer-additional') ) {
    dynamic_sidebar( 'sidebar-footer-additional');
?>