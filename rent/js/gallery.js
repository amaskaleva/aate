customImageGallery = {

    simpleGalleryInit: function(){
        jQuery('.js-gallery').each(customImageGallery.makeSimpleGallery);
    },

    // Initialize simple gallery
    makeSimpleGallery: function(){
        var back =    '<div class="js-gallery__back b-gallery__button b-gallery__button--back disable"><div></div></div>',
            next =    '<div class="js-gallery__next b-gallery__button b-gallery__button--next"><div></div></div>',
            body =    '<div class="js-gallery__content b-gallery__content b-gallery__button--content"></div>',
            bodyPar = '<div class="js-gallery__content--wrapper b-gallery__contentWrapper b-gallery__button--contentWrapper"></div>',
            gallery = jQuery(this),
            items = gallery.find('.js-gallery__item');


        if(items.length == 0 || (items.length < 5 && !gallery.hasClass('forcedisplay')))
            return;

        items.width(items.first().width());

        gallery
            .append(back)
            .append(next)
            .append(bodyPar)
            .append(body)
            .addClass('b-gallery--simple')
            .css('display','block');

        body = gallery.find('.js-gallery__content');
        next = gallery.find('.js-gallery__back');
        back = gallery.find('.js-gallery__next');

        bodyPar=gallery.find('.js-gallery__content--wrapper');
        bodyPar.append(body);


        var h = 0;

        gallery.find('.js-gallery__item').css({
            float: 'left'
        });
        gallery.find('.js-gallery__item').each(function(){
            body.append(jQuery(this));
        });

        gallery.find('.js-gallery__item').slice(0,5).each(function(){
            var currentHeight = jQuery(this).outerHeight()+parseInt(jQuery(this).css('marginTop'))+parseInt(jQuery(this).css('marginBottom'))+parseInt(jQuery(this).css('paddingTop')) + 2;
            h = currentHeight < h ? h : currentHeight;
        });

        h++;
        gallery.css('height',h + 'px');
        body.addClass('i-text-nowrap');

        customImageGallery.simpleGalleryInitCalculate(gallery);
    },
    simpleGalleryInitCalculate: function(gallery){
        var next = gallery.find('.js-gallery__back'),
            back = gallery.find('.js-gallery__next'),
            body =    gallery.find(".js-gallery__content"),
            bodyPar = gallery.find(".js-gallery__content--wrapper");

        var x = [];

        x[0] = 0;

        gallery.find('.js-gallery__item').css({
            float: 'left'
        });

        gallery.find('.js-gallery__item').each(function(){
            x.push(x[x.length-1] + jQuery(this).outerWidth() + parseInt(jQuery(this).css('margin-right')));
        });

        x[x.length - 1] = x[x.length - 1] + parseInt(gallery.find('.js-gallery__item:last-child').css('margin-right'));
        body.css('width', x[x.length - 1] + 1 + 'px');

        var curX = 0,
            maxWidth = bodyPar.outerWidth();

        if(bodyPar.parent().width() == 0 && /%/.test(bodyPar.css("width"))){
            maxWidth = 0;
        }

        // Click on previous image
        next.off('click');
        back.off('click');

       next.on('click', function(){

            if(curX-1 < 0){
                curX = x.length;
                body.stop().dequeue().animate({left: -x[x.length-1] + maxWidth},400);
                return;
            }

            curX--;
            var left = -x[curX];

            if(left > 0)
                return;

            body.stop().dequeue().animate({left: left},400);
        });

        back.on('click', function(){
            var left = parseInt(body.css('left'));

            if(curX >= x.length-1 || parseInt(x[x.length-1]) + left + 1 <= maxWidth  || left < -x[curX] || x[x.length-1] - x[curX] < maxWidth + 5){
                curX = 0;
                body.stop().dequeue().animate({left: 0},400)
                return;
            }

            if(maxWidth == 0){
                maxWidth = bodyPar.outerWidth();
            }

            curX++;
            left = -x[curX];

            if(x[x.length-1] + left < maxWidth)
                left = -(x[x.length-1]-maxWidth);

            body.stop().dequeue().animate({left: left},400);
        })
    }
};

jQuery(document).ready(function(){
    customImageGallery.simpleGalleryInit();
});