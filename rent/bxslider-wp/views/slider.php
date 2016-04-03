<?php if(!defined('ABSPATH')) die('Direct access denied.'); ?>

<?php /*echo $data_attributes; ?>>
    <?php foreach($slides  as $slide): ?>
        <?php if($slide['type'] == 'image'): ?>
            <?php if ($slide['enable_link']=='true'): ?><a target="<?php /*echo esc_attr($slide['link_target']); ?>" href="<?php /*echo esc_url( $slide['link'] ); ?>"><?php /*endif; ?>
            <img src="<?php /*echo esc_url( $slide['image_url'] ); ?>" title="<?php /*echo esc_attr( $slide['caption'] ); ?>" />
            <?php if ($slide['enable_link']=='true'): ?></a><?php /*endif; ?>
        </li>
        <?php else: ?>
        <li><?php echo $slide['custom']; ?></li>
        <?php endif; ?>
    <?php endforeach; */?>


<div class="b-gallery <?php echo empty($options['slide_selector']) ? "js-gallery" : $options['slide_selector']; ?> ">
    <?php foreach($slides  as $slide): ?>
    <div class="js-gallery__item b-gallery__item">
        <?php if(!empty($slide['title'])){ ?>
            <div class="title"><?php echo $slide['title'] ?></div>
        <?php } ?>

        <div class="content">
            <img src="<?php echo esc_url( $slide['image_url'] ); ?>" title="<?php echo esc_attr( $slide['text'] ); ?>" />
            <?php
            $textclass=$slide['texttype'] == 'up' ? 'top' : 'bottom';
            if(!empty($slide['text'])){ ?>

                <div class="text <?php echo $textclass;?>"><?php echo $slide['text'] ?></div>
            <?php } ?>
        </div>
        <?php
        $sclass=$slide['subtitletype'] == 'number' ? 'number' : '';
        $subtitle = $slide['subtitle'];
        if($sclass == 'number' && !empty($subtitle)){
            $subtitle = preg_replace('/([0-9]+)/','<span class="number">${1}</span>',$subtitle);
        }
        if(!empty($slide['subtitle'])){ ?>
            <div class="subtitle <?php echo $sclass;?>"><?php echo $subtitle ?></div>
        <?php } ?>
    </div>
    <?php endforeach; ?>
</div>
