App.sets= {
    className: "js-sets__product__popup",
    showSetProductWindow: function(e){
        $('.' + App.sets.className + '--window').hide();
        if($(e.target).hasClass(App.sets.className + '--close'))
        {
            e.stopPropagation();
            return;
        }

        var showWindow = $(this).find('.' + App.sets.className + '--window');
        showWindow.show();
    },
    closeSetProductWindow: function(e){
        $(this).closest('.' + App.sets.className + '--window').hide();
    },
    bindEvent: function(){
        $('.' + App.sets.className + '--show').on('click', App.sets.showSetProductWindow);
        $('.' + App.sets.className + '--close').on('click', App.sets.closeSetProductWindow);
        App.common.hideWindowByClick(".js-sets__product--popup");
    }
};