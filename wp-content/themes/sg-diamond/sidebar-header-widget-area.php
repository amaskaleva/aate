<?php
/**
 * The sidebar containing the home page widget area
 *
 */

?>

<div class="sidebar-header top">
    <div class="widget-area">
        <?php if ( is_active_sidebar( 'sidebar-header-widget-area' ) ) : ?>

            <?php dynamic_sidebar( 'sidebar-header-widget-area' ); ?>

        <?php else : ?>
        <?php endif; ?>
    </div><!-- .widget-area -->
</div><!-- .sidebar-header -->