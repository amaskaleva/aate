<?php if(!defined('ABSPATH')) die('Direct access denied.'); ?>

<input type="hidden" name="<?php echo $nonce_name; ?>" value="<?php echo $nonce; ?>" />

<div class="bxslider-field">
	<label for="bxslider_options_adaptive_height"><?php _e('Adaptive Height:', 'bxslider'); ?> </label>
	<input type="hidden" name="bxslider[options][adaptive_height]" value="false" />
	<input id="bxslider_options_adaptive_height" type="checkbox" name="bxslider[options][adaptive_height]" value="true" <?php echo ($options['adaptive_height']=='true') ? 'checked="checked"' : ''; ?> />
	<label for="bxslider_options_adaptive_height" class="note"><?php _e('Dynamically adjust slider height based on each slide\'s height.', 'bxslider'); ?></label>
	<div class="clear"></div>
</div>
<div class="bxslider-field">
	<label for="bxslider_options_adaptive_height_speed"><?php _e('Adaptive Height Speed:', 'bxslider'); ?> </label>
	<input id="bxslider_options_adaptive_height_speed" type="number" name="bxslider[options][adaptive_height_speed]" value="<?php echo $options['adaptive_height_speed']; ?>" />
	<span class="note"><?php _e('Slide height transition duration (in ms). Note: only used if Adaptive Height is checked.', 'bxslider'); ?></span>
	<div class="clear"></div>
</div>
<div class="bxslider-field">
	<label for="bxslider_options_use_css"><?php _e('Use CSS:', 'bxslider'); ?> </label>
	<input type="hidden" name="bxslider[options][use_css]" value="false" />
	<input id="bxslider_options_use_css" type="checkbox" name="bxslider[options][use_css]" value="true" <?php echo ($options['use_css']=='true') ? 'checked="checked"' : ''; ?> />
	<label for="bxslider_options_use_css" class="note"><?php _e('If checked, CSS transitions will be used for horizontal and vertical slide animations (this uses native hardware acceleration). If unchecked, jQuery animate() will be used.', 'bxslider'); ?></label>
	<div class="clear"></div>
</div>
<div class="bxslider-field last">
	<label for="bxslider_options_slide_selector"><?php _e('Slide Selector:', 'bxslider'); ?> </label>
	<input id="bxslider_options_slide_selector" type="text" name="bxslider[options][slide_selector]" value="<?php echo $options['slide_selector']; ?>" />
	<span class="note"><?php _e('Element to use as slides (ex. \'div.slide\'). Note: by default, bxSlider will use all immediate children of the slider element.', 'bxslider'); ?></span>
	<div class="clear"></div>
</div>