App.giftcard = {
    buttonAddClass: "b-btn--red",
    buttonDelClass: "b-btn--close",
    errorClass: "b-text--error",
    wrapper: undefined,
    idx: 0,
    bindGiftCardEvent: function(){

        this.idx = $('.js-giftcard__row').length;

        if($('.js-giftcard__checkbox:checked').length == 0)
        {
            $('.js-giftcard__item').hide();
        }

        $('.js-giftcard__checkbox').on("change", function(){
            if($(this).filter(":checked").length)
            {
                $('.js-giftcard__item').show();
            }
            else {
                $('.js-giftcard__item').hide();
            }
        });

        this.wrapper = $(".js-giftcard__block");
        this.wrapper
            .on("click", ".js-giftcard__add", this.addNewCard)
            .on("click", ".js-giftcard__remove", this.removeCard)
            .on("change", "input[type=text]", function(){
                App.giftcard.validCard.apply($(this).closest(".js-giftcard__row"))
            });
    },

    removeCardFromTable: function(item){
        item.closest(".js-giftcard__row").remove();
        if($(".js-giftcard__row").length == 0)
        {
            App.giftcard.idx = 0;
            $(".js-giftcard__table").remove();
            var html = $("#checkoutGiftCardFormTemplate").tmpl({index: App.giftcard.idx});
            $(".js-giftcard__form")
                .html(html)
                .show();
            return false;
        }
        App.giftcard.updateCardIndex();
    },
    returnCardFromTable: function(item){
        item.closest(".js-giftcard__row").find(".disabled").removeAttr("disabled");
        item.show();
    },
    removeCard: function(){
        if($(this).hasClass("link")){
            var $this = $(this);
            $this.hide();
            $this.closest(".js-giftcard__row").find("input[type=text]").addClass("disabled").attr("disabled", "disabled");

            $.get($(this).attr("href"), {}, function(data){
                if(data != undefined)
                {
                    App.giftcard.removeCardFromTable($this);
                    return;
                }
                App.giftcard.returnCardFromTable($this);
            }).error(function(){
                App.giftcard.returnCardFromTable($this);
            })
        }
        else
            App.giftcard.removeCardFromTable($(this));
        return false;
    },
    validCard: function(){
        $(".gift").remove();
        var number = $(this).find(".js-giftcard__number"),
            code = $(this).find(".js-giftcard__code"),
            errorList = [];

        $(this)
            .removeClass("valid")
            .removeClass("error");

        var itemCount = 0,
            emptyItems = 0;

        if(number.length) {
            itemCount++;
            number
                .removeClass("valid")
                .removeClass("error");

            if (!/^([0-9]{13}$)/.test(number.val())) {
                if ($.trim(number.val()).length == 0)
                {
                    emptyItems++;
                    errorList.push(ACC.validateerror.giftcardnumberrequired);
                }
                else if ($.trim(number.val()).length < 13)
                {
                    errorList.push(ACC.validateerror.giftcardnumberlength);
                }
                else
                    errorList.push(ACC.validateerror.giftcardnumberfail);
                number.addClass(App.giftcard.errorClass);
            }
            else {
                var items = $(".js-giftcard__number").not(number).not(function(){
                        return $(this).val() != number.val();
                    });

                if (items.length > 0) {
                    errorList.push(ACC.validateerror.giftcardduplicate);
                    number.addClass(App.giftcard.errorClass);
                }
                else
                    number.removeClass(App.giftcard.errorClass);
            }
        }
        if(code.length) {
            code
                .removeClass("valid")
                .removeClass("error");

            itemCount++;
            if (!/^([0-9a-zA-Z]{1,6}$)/.test(code.val())) {
                if ($.trim(code.val()).length == 0)
                {
                    emptyItems++;
                    errorList.push(ACC.validateerror.giftcardcoderequired);
                }
                else
                    errorList.push(ACC.validateerror.giftcardcodefail);
                code.addClass(App.giftcard.errorClass);
            }
            else
                code.removeClass(App.giftcard.errorClass);
        }
        if(errorList.length == 0)
        {
            $(this).addClass("valid");
            if($(this).find(".error").length > 0)
            {
                var html = $("#checkoutGiftCardTableIntegers").tmpl($(this).data("giftcard") || {count1: "", count2: ""});
                $(html).insertAfter($(this).find(".error"))
                $(this).find(".error").remove();
            }
            return;
        }
        $(this).addClass("error");

        if(errorList.length == itemCount)
        {
            if(itemCount == emptyItems)
                errorList=[ACC.validateerror.giftcardempty];
            else
                errorList=[ACC.validateerror.giftcardfail];
        }

        if($(this).find(".js-giftcard__error.error").length > 0)
            $(this).find(".js-giftcard__error").empty().append($("<span/>").addClass(App.giftcard.errorClass).html(errorList.join("<br/>")));
        else {
            var html = $("#checkoutGiftCardTableError").tmpl({error: errorList.join("<br/>")});
            $(html).insertAfter($(this).find(".js-giftcard__error:last"));
            $(this).find(".js-giftcard__error").not(".error").remove();
        }
    },
    cardValidation: function(){

        $(".js-giftcard__row:visible").each(App.giftcard.validCard);

        return $(".js-giftcard__row.error:visible").length == 0;
    },
    updateCardIndex: function(){
        var idx = 0;
        $(".js-giftcard__row").each(function(){
            var number  = $(this).find(".js-giftcard__number"),
                code  = $(this).find(".js-giftcard__code");
            if(number.length)
                number.attr("name", number.attr("name").replace(/(\d+)/, idx));
            if(code.length)
                code.attr("name", code.attr("name").replace(/(\d+)/, idx));
            idx++;
        });
        App.giftcard.idx = idx;
    },
    addNewCard: function(){
        //var added = true;
        if($(".js-giftcard__row").length==0){
            var html = $("#checkoutGiftCardTableTemplate").tmpl({
                index: App.giftcard.idx,
                number: $(".js-giftcard__form .js-giftcard__number").val(),
                code: $(".js-giftcard__form .js-giftcard__code").val()
            });
            $(".js-giftcard__item.table").prepend($(html));
            $(".js-giftcard__form")
                .empty()
                .hide();
            App.giftcard.updateCardIndex();
            App.giftcard.idx++;
            //added = false;
        }

        var isValid = App.giftcard.cardValidation();
        if(!isValid)
            return false;

        if($(".js-giftcard__row").length>0/* && added*/)
        {
            var html = $("#checkoutGiftCardRowTemplate").tmpl({index: App.giftcard.idx});
            $(html).insertAfter($(".js-giftcard__row:last"));
            App.giftcard.updateCardIndex();
            App.giftcard.idx++;
            return false;
        }
    },
    createTable: function(params){

    },
    appendToTable: function(params){

    },
    bindEvent: function(){
        this.bindGiftCardEvent();
    }
};

