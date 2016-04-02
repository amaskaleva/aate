<?php
/**
 * The sidebar containing the home page widget area
 *
 */

?>

<div class="sidebar-header top">
    <div class="widget-area">
        <?php
        if ( is_active_sidebar( 'sidebar-header-widget-area' ) )
            dynamic_sidebar( 'sidebar-header-widget-area' );

        $in_same_cat = '8';
        $posts = get_posts( array(
            'numberposts'     => 1, // тоже самое что posts_per_page
            'offset'          => 0,
            'category'        => $in_same_cat,
            'orderby'         => 'post_date',
            'order'           => 'DESC',
            'post_type'       => 'post',
            'post_status'     => 'publish'
        ));

        if(count($posts) > 0){
            $post = $posts[0];
            $text = $post->post_content;
            $text = preg_replace('/<.+>/', '', $text);
            //$text = str_replace("</a>", '</u>', $text);

            $shortText = mb_substr($text,0,139,'UTF8');
            $readMore = "go to news";
            if(strlen($shortText) < strlen($text))
                {
                    /*$a = preg_match('/<[a-zA-Z].+>/',$shortText);
                    $b = preg_match('/<[a-zA-Z].+\>/',$shortText);
                    if(count($a) > count(preg_match('/<\.+>/',$shortText)) - count($b)){
                        $a = array_diff($a, $b);
                        $shortText.
                    }*/
                    $shortText.="... </br>";
                    $readMore = "read more >>";
                }
            ?>
            <aside class="widget widget_recent_entries">
                <ul>
					<li>
                        <?php echo $shortText; ?>
                    </li>
                    <li>
                        <?php /*echo synved_social_share_markup(null, null, array("url"=>$post->guid)); */?>
                        <?php echo social_likes($post->ID); ?>
                    </li>
                    <li>
				    <a href="<?php echo $post->guid; ?>"><?php echo $readMore;?></a>
					</li>
				</ul>
		    </aside>
            <?php
        }
        ?>
    </div><!-- .widget-area -->
</div><!-- .sidebar-header -->