<?php
class StyledTextWidget extends WP_Widget {
    function StyledTextWidget()
    {
        // widget actual processes
        $widget_ops = array(
            'classname' => 'styledtext',
            'description' => __('A widget that displays styled text block ', 'styledtext')
        );
        $control_ops = array(
            'width' => 300,
            'height' => 350,
            'id_base' => 'styledtext-widget' );

        $this->WP_Widget( 'styledtext-widget', __('Styled Text Widget', 'styledtext'), $widget_ops, $control_ops );
    }

    function form($instance)
    {
        // display the options form on admin backend
        $defaults = array(
            'icon' => '',
            'title' => '',
            'content' => '',
            'class' => '',
            'displayMobile' => true
        );

        $instance = wp_parse_args( (array) $instance, $defaults ); ?>

        <p>
            <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', ''); ?></label>
            <input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" style="width:100%;" />
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'icon' ); ?>"><?php _e('Icon:', ''); ?></label>
            <input id="<?php echo $this->get_field_id( 'icon' ); ?>" name="<?php echo $this->get_field_name( 'icon' ); ?>" value="<?php echo $instance['icon']; ?>" style="width:100%;" />
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'content' ); ?>"><?php _e('Content:', 'example'); ?></label>
            <textarea id="<?php echo $this->get_field_id( 'content' ); ?>" name="<?php echo $this->get_field_name( 'content' ); ?>" style="width:100%;"><?php echo $instance['content']; ?></textarea>
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'class' ); ?>"><?php _e('Class:', ''); ?></label>
            <input id="<?php echo $this->get_field_id( 'class' ); ?>" name="<?php echo $this->get_field_name( 'class' ); ?>" value="<?php echo $instance['class']; ?>" style="width:100%;" />
        </p>

        <p>
            <input class="checkbox" type="checkbox" <?php checked( $instance['displayMobile'], true ); ?> id="<?php echo $this->get_field_id( 'displayMobile' ); ?>" name="<?php echo $this->get_field_name( 'displayMobile' ); ?>" />
            <label for="<?php echo $this->get_field_id( 'show_info' ); ?>"><?php _e('Do Not Display Mobile?', false); ?></label>
        </p>
        <?php

    }

    function update($new_instance, $old_instance)
    {
        // processes widget options to be saved
        $instance = $old_instance;

        //Strip tags from title and name to remove HTML
        $instance['icon'] = strip_tags( $new_instance['icon'] );
        $instance['title'] = strip_tags( $new_instance['title'] );
        $instance['content'] = strip_tags( $new_instance['content'] );
        $instance['class'] = strip_tags( $new_instance['class'] );
        $instance['displayMobile'] = $new_instance['displayMobile'];

        return $instance;
    }

    function widget($args, $instance) {
        // display the content of the widget
        $title = apply_filters('widget_title', $instance['title'] );
        $icon = $instance['icon'];
        $content = $instance['content'];
        $class = $instance['class'];
        $displayMobile = isset( $instance['displayMobile'] ) ? $instance['displayMobile'] : false;

        echo $before_widget;

        if ( $displayMobile == true){
            echo "<div class='b-dtd $class'>";
        }
        else
            echo "<div class='$class'>";


        if ( $icon )
            echo "<i class='$icon'></i>";

        ?>
        <div class="infoblock">
            <?php if($title) echo '<span class="title">'.$title.'</span>' ?>
            <?php if($content) echo '<span class="subtitle">'.$content.'</span>' ?>
        </div>
        </div>
        <?php

        //if ( $show_info )
        //    printf( $name );

        echo $after_widget;
    }
}

function register_StyledTextWidget() {
    register_widget( 'StyledTextWidget' );
}
add_action( 'widgets_init', 'register_StyledTextWidget' );
?>