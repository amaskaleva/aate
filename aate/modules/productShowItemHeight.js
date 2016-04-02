define(['jquery'], function($){

    var resizeProductListBottom=function(){

        //$(this).css('height', 'auto');
        $(this).closest('.js-position__wrapper').css('height', 'auto');
        $(this).parent().css('height', 'auto');

        /*$(this).css('top', '0');
        $(this).css('bottom', 'auto');*/

        var h1=parseInt($(this).css('height'));
        var h2=parseInt($(this).closest('.js-position__wrapper').css('height'));

        h2=h1>h2?h1:h2;

        $(this).closest('.js-position__wrapper').css('height', h2+'px');
        $(this).parent().css('height', h2+'px');
        $(this).css('position','absolute');
        $(this).css('bottom','10px');
        $(this).css('top', 'auto');
    };

    var showFullProductListTitle=function(){
        $(this).off('click',showFullProductListTitle);

        $(this).attr('class','');

        $(this).parent().find('.js-title__short').css('height', 'auto');
        $(this).parent().find('.js-title__short').css('max-height', 'inherit');
        var elem=$(this).closest('.js-item');
        $(this).remove();

        elem.find('.js-position__bottom').each(resizeProductListBottom);
    };


        return {
                /*выравнивание по вертикали блока продукции, сожержащего цены за шт.*/
                updateItemHeight: resizeProductListBottom,

                /*многоточие в конце заголовка в вертикальном отображении списка продукции*/
                updateTitleWidth: function(){
                        var h = $(this).height();
                        var maxh=$(this).css('max-height');

                        if(maxh > h) return;

                        $('<span class="js-title__short__more b-title__short__more">...»</span>').insertBefore($(this));
                },

                setClickEventToTitle: showFullProductListTitle
            }
});