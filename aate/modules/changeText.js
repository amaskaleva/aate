//sitemap/categorylist
App.changeText = {
    makeTitleShort: function(){
        $('.js-title--short').each(function(){

            $(this).removeClass('js-title--short');

            var par = $(this).closest('.i-ov-dt');
            if(par.length == 0) return;


            var wp = parseInt($(this).parent().width());

            par.removeClass('i-ov-dt');

            var w = parseInt($(this).parent().outerWidth());

            if (w > wp)
            {
                $('<span class="b-help__info__wrapper"><span class="i-ov-dt"></span></span>').insertAfter($(this));
                $(this).siblings('.b-help__info__wrapper').prepend('<div class="b-help__info--top b-blockWrapper--empty">'+$(this).text()+'</div>');
                $(this).siblings('.b-help__info__wrapper').find('.i-ov-dt:last').append($(this));
            }
            else par.addClass('i-ov-dt');
        })
    },
    bindEvent: function(){
        this.makeTitleShort()
    }
};

