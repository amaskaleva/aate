<?php
/**
 * The sidebar containing the home page widget area
 *
 */

?>

<div class="sidebar-custom-footer">
    <div class="widget-area">
        <?php if ( is_active_sidebar( 'sidebar-custom-footer' ) ) : ?>

            <?php dynamic_sidebar( 'sidebar-custom-footer' ); ?>

        <?php else : ?>
        <?php endif; ?>
    </div><!-- .widget-area -->
</div><!-- .sidebar-header -->