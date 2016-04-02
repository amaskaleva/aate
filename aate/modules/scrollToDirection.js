// scroll to some directions
App.scrollToDirection = {
    scrollToTopEvent: function(){
        if($(window).scrollTop() > $('#scrollToTop').height())
        {
            if($(document).height() - $(window).scrollTop() < $(window).height()) {
                //$('.js-footer--features').removeClass("fixed");
                $('.js-content--features').removeClass("fixed");
                //$('.js-page__arrow').hide();
            }
            else
            {
                $('.js-footer--features').addClass("fixed");
                $('.js-content--features').addClass("fixed");
                $('.js-page__arrow').show();
            }
        }
        else {
            //$('.js-footer--features').removeClass("fixed");
            {
                //$('.js-content--features').removeClass("fixed");
                $('.js-page__arrow').hide();
            }
        }
    },
    scrollToTarget: function(target,offset){
        offset = typeof offset !== 'undefined' ? offset : 0;
        var $target = $(target);
        if ($target.length<1) return false;
        $('html, body').animate({ scrollTop: $target.offset().top+offset}, 1000);
    },

    bindEvent: function(){
        if($(window).scrollTop() == 0)
            $('#scrollToTop').hide();

        $('#scrollToTop').on('click', function(e){
            $('html, body').animate({scrollTop: 0});
            e.stopPropagation();
            return false;
        });

        $(window).on('scroll', App.scrollToDirection.scrollToTopEvent);
    }
};