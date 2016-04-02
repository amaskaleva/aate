App.b2b = {
    showCommentPopup: function(){
        if($('.js-order--approve__button--popup').length > 0) {
            $('.js-order--approve__button--cancel').off("click").removeClass("approverDecisionButton").on("click", function (e) {
                $('.js-order--approve__button--popup').show();
                e.stopPropagation();
                return false;
            });

            $('.js-order--approve__button--popup__cancel').on("click", function () {
                $('.js-order--approve__button--popup').hide();
            });
            $(".js-order--approve__button--submit").click(function(){
                App.common.showLoading();
            });
            App.common.hideWindowByClick(".js-order--approve__button--popup");
        }
    },
    filterFormSubmit: function(){
        $('#filterB2BCustomersForm').find(".js-filterList").on("change", function(){
            $('#filterB2BCustomersForm').submit();
        })
    },
    bindEvent: function(){
        this.showCommentPopup();
        this.filterFormSubmit();
    }
};

