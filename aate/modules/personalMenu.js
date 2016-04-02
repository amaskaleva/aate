App.personalMenu = {
    bindEvent: function (e) {
        $('.js-personalMenu__header').mouseenter(function (e) {
            var $this = $(e.target);
            $('.js-personalMenu').show();
        });

        $('.js-personalMenu__header').mouseleave(function (e) {
            var $this = $(e.target);
            $('.js-personalMenu__header .js-personalMenu').hide();
        });
    }
};