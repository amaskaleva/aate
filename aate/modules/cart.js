App.cart = {
    regExp: (typeof maxCodeAmount != "undefined") ? new RegExp("^(([0-9]{1,})((([,;.\/\\&]{0,1}[\\s]*)[0-9]{1,}){0," + (maxCodeAmount - 1) + "})$)"):'',

    clearAll: function () {
        if (!App.common.isACC()) return;

        var option = {
                message: ACC.text.clearBasket,
                url: $(this).attr("href")
            },
            html = $('#approveWindow').tmpl(option);
        App.common.showBackWindowHtml(html);
        return false;
    },

    toWaitingList: function () {

        if (!App.common.isACC()) return false;

        var form = $(this).closest('form'),
            btn = $(this),
            f = false,
            countInStock = 0;

        $('.js-cart__products').find('input[type=checkbox]:checked').not('.js-check--only').each(function () {
            var par = $(this).closest('.js-check__line');
            if (par.find('.js-check__entryCode').data('status') == 1) {
                countInStock++;
                f = true;
            }
        });
        var option, html;
        if (countInStock == $('.js-cart__products input[type=checkbox]:checked').not('.js-check--only').length) {
            option = {
                message: ACC.text.productInStockToWait
            };
            html = $('#okWindow').tmpl(option);
            App.common.showBackWindowHtml(html);
            return false;
        }

        if (f) {
            $(this).on('submit', App.common.noSendForm);
            option = {
                    message: ACC.text.productInStockToWait,
                    url: '#'
                };
            html = $('#approveWindow').tmpl(option);
            App.common.showBackWindowHtml(html);

            $('.js-approveWindow__buttonWrapper').find('button')
                .on('click', function () {
                    form.off('submit', App.common.noSendForm);
                });

            $('.js-approveWindow__button').html(ACC.text.continueToWaitingList)
                .on('click', function () {
                    btn.off('click', App.cart.toWaitingList);
                    form.off('submit', App.common.noSendForm);
                    $('.js-cart__products').find('input[type=checkbox]:checked')
                        .each(function () {
                            var par = $(this).closest('.js-check__line');
                            if (par.find('.js-check__entryCode').data('status') == 1)
                                $(this).prop('checked', false);
                        });

                    btn.click();
                    return false;
                });
            return false;
        }
    },

    getCatalog: function () {

    },
    getCartLink: function () {

    },
    fastAdd: function () {
        if (!$(this).hasClass('active')) {
            return false;
        }

        $(this).find('.message').each(App.common.removeChild);

        var $field = $(this).find('.js-cart--fastadd__field'),
            value = $.trim($field.val()).replace(/([^0-9]+)$/, ''),
            url = ACC.config.contextPath + '/cart/getProductListByCodeList',
            reg = App.cart.regExp;

        //check string of type: 1234,1234,1234
        if (reg.test(value)) {
            App.common.sendForm($(this), url, App.cart.fastAddSendSuccess, undefined, 'text');
            App.common.showLoading();
            return false;
        }

        if (App.common.isACC())
            App.common.setError($field.parent(), ACC.validateerror.error);

        return false;
    },

    fastAddSendSuccess: function (result, json) {
        if (json != false) {
            result = JSON.parse(result);
        }
        App.common.hideLoading();

        result.available = true;
        App.common.showBackWindowHtml($('#productTable').tmpl(result));
        App.cart.bindFastAddEventField();
        App.counterNumber.bindEvent();
        $('.js-back__window:last-child form').on("submit", App.common.showLoadingFormOnly);
        return;
    },

    fastAddCheck: function () {
        if (!App.common.isACC()) return;

        var text = '-1',
            successText = '',
            successFunction = function (result) {
                var $label,
                    $form = $('.js-cart--fastadd__form'),
                    $inputField = $('.js-cart--fastadd__field'),
                    $button = $form.find('.js-cart__button--fastadd');

                if ($inputField.siblings('label').length == 0) {
                    $label = $('<label/>').addClass('b-text--error message i-dn').attr('for', $inputField.attr('name'));
                    $inputField.parent().append($label);
                } else {
                    $label = $inputField.siblings('label').first();
                }

                if (result == "true") {
                    successText = $.trim($('.js-cart--fastadd__field').val());
                    $('.js-cart--fastadd__form').addClass('active')
                        .find('.js-cart__button--fastadd')
                            .addClass('active');
                    $inputField.removeClass('b-text--error');
                    $label.hide();
                    $form.addClass('active');
                    $button.addClass('active');
                    return;
                } else if (result == "false") {
                    $inputField.addClass('b-text--error');
                    $label.text(ACC.validateerror.quickadd_error);
                    $label.show();
                } else if (result == "partially") {
                    $inputField.addClass('b-text--error');
                    $label.text(ACC.validateerror.quickadd_error_partially);
                    $label.show();
                }
                $('.js-cart--fastadd__form').removeClass('active')
                    .find('.js-cart__button--fastadd')
                        .removeClass('active');
                $form.removeClass('active');
                $button.removeClass('active');
            };
        var checkTimer = null;

        $(this).on('keyup change', function () {
            var value = $.trim($(this).val()).replace(/([^0-9]+)$/, '');
            if (text != value) {
                text = value;

                /*if (value.indexOf(successText) >= 0 && successText.length > 0) {
                    return;
                }*/

                var reg = App.cart.regExp;
                //successText = '';

                if (reg.test(value)) {
                    if(checkTimer == null){
                        var $form = $(this).closest("form"),
                            m = function(){
                                clearTimeout(checkTimer);
                                checkTimer = null;
                                var url = ACC.config.contextPath + "/cart/checkForProduct";
                                App.common.sendForm($form, url, successFunction, undefined, 'text');
                            };
                        checkTimer = setTimeout(m, 1000);
                    }
                    return;
                }
                $('.js-cart--fastadd__form').removeClass('active')
                    .find('.js-cart__button--fastadd')
                        .removeClass('active');
            }
        })
    },

    newPromoCode: function () {
        var $elem = $('.js-cart--promo__code'),
            nm = $elem.filter(':last').find('input').attr('name'),
            nmNum = parseInt(nm.replace(/[^\d]/g, ''));

        if ($elem.filter('.active').length != $elem.length) {
            return;
        }

        nm = nm.replace(/[\d]+/g, nmNum + 1);

        var $activetDiv = $('.js-cart--promo__activate'),
            newElem = '<div class="js-cart--promo__code">' + $elem.html() + '</div>';

        $activetDiv.hide();
        $('body').append($activetDiv);

        $('.js-cart--promo__wrapper').append(newElem);

        $('.js-cart--promo__remove:last').hide();

        $('.js-cart--promo__code__field:last').val('')
            .attr('name', nm)
            .removeAttr('disabled')
            .removeClass('active')
            .parent().append($activetDiv);

        $activetDiv.show();
        App.cart.bindEventPromoField();
    },

    promoActivateSuccess: function () {
        var $promoCode = $('.js-cart--promo__code');
        $promoCode
            .addClass('active')
            .find('.js-cart--promo__code__field')
                .attr('disabled', 'disabled');

        $promoCode.find('.js-cart--promo__remove')
            .show();
        $('.js-cart--promo__activate').hide();
    },

    promoActivate: function () {
        var elem = $('.js-cart--promo__code__field:last');
        if (elem.hasClass('active'))
            return false;

        var data = {},
            url = elem.closest('form').attr('action');

        data[elem.attr('name')] = elem.val();
        App.common.sendAjaxData(data, url, App.cart.promoActivateSuccess, undefined, 'text', 'post');

        return false;
    },

    promoCodeInput: function () {
        if ($(this).val().length == 0) {
            $(this).closest('.js-cart--promo__code').removeClass('active');
            $(this).siblings('.js-cart--promo__remove').hide();
            return;
        }
        $(this).closest('.js-cart--promo__code').addClass('active');
        $(this).siblings('.js-cart--promo__remove').show();
    },

    promoCodeRemove: function () {
        if (!App.common.isACC()) return;

        $(this).closest('.js-cart--promo__code').find('.js-cart--promo__code').removeClass('active');

        if($(this).closest('.js-cart--promo__wrapper').find('.js-cart--promo__code').length > 1)
            $(this).closest('.js-cart--promo__code').remove();

        $(this).siblings('.js-cart--promo__code__field').val('');
        $(this).hide()
    },

    /*
    //don't remove
    loadFromFile: function () {
        $(this).closest('form').find('[type=file]').click();
    },

    clickLoadFromFile: function () {
        $('.js-cart__button--loadfromfile').click();
        return false;
    },*/

    buttonUpdateEnable: function () {
        $(this).closest('.js-check__line').find('.js-cart--remove, .js-favorite--remove--only').not(".notupdatable").hide();
        $(this).closest('.js-check__line').find('.js-cart--update, .js-favorite--update').show();
        return false;
    },

    /*
     //don't remove
     buttonUpdateDisable: function () {
        $(this).closest('.js-check__line').find('.js-cart--remove, .js-favorite--remove--only').show();
        $(this).closest('.js-check__line').find('.js-cart--update, .js-favorite--update').hide();
        return false;
    },*/

    fastAddRemove: function (e) {
        var table = $(this).closest('table');
        $(this).closest(".js-check__line").each(App.common.removeChild);
        if (table.find('.js-check__line').length == 0) {
            table.closest('.js-back__window').find('.js-back--close').click();
        }
        else{
/*
            if (table.find('.instock').length == 0) {
                /!*table.closest('.js-back__window').find('.js-fast__addtocart').attr("disabled", "disabled").hide();*!/
                table.closest('.js-back__window').find('.js-fast__addtocart').attr("disabled", "disabled").hide();
            }
*/
            /*
            else
                table.closest('.js-back__window').find('.js-fast__addtocart').removeAttr("disabled").show();*/
            e.stopPropagation();
        }
    },

    productCountUpdate: function(){
        var tm = null;

        $(this).on('change', function(){

            if(tm == null)
                tm = 10;
            else return false;

            var $this = $(this);
            tm = setTimeout(function(){
                var elem = $this,
                    obj = {
                        entryNumber: elem.closest(".js-check__line").find(".js-check__entryCode").data().entrynumber,
                        quantity: elem.val()
                    },
                    url = ACC.config.contextPath + "/cart/update";
                App.common.sendAjaxData(obj, url, undefined, undefined, "text", "POST", function(){});
                tm = null;
            }, 500);
        });
    },

    fileUploadAdd: function (e, data) {
        data.process().done(function () {
            data.submit();

            /*if(data.files.length > 0 && data.files[0].size > 0)
            {
                data.submit();
            }
            else
            {
                $('.js-cart__button--loadfromfile').fileupload('option','destroy');
                App.common.setGlobalError(ACC.text.errorLoading);
                $('.js-cart__button--loadfromfile').on("change", function(){
                    $(this).closest("form")[0].submit();
                });
            }*/
        })
    },

    fileUploadDone: function (e, data) {
        App.cart.fastAddSendSuccess(data.result, false);
    },

    orderListDateChange: function(){
        $(this).closest('form').submit();
    },

    bindEventPromoField: function () {
        $('.js-cart--promo__code__field').off('keyup', App.cart.promoCodeInput)
            .on('keyup', App.cart.promoCodeInput);

        $('.js-cart--promo__remove').off('click', App.cart.promoCodeRemove)
            .on('click', App.cart.promoCodeRemove);
    },

    bindFastAddEventField: function () {
        $('.js-cart__fastAdd--remove').on('click', App.cart.fastAddRemove);

    },

    bindEvent: function () {

        var $cart = $(".js-cart");

        if($cart.length){
            var m = function () {
                App.common.showLoading();
                $('.js-cart')[0].submit();
                $(this).off("click", m);
            };

            $cart.find('.js-cart--submit').on('click', m);
            $cart.find('input.js-counter__number')
                .on('change', App.cart.buttonUpdateEnable)
                .each(App.cart.productCountUpdate);

            $('.js-cart--update, .js-favorite--update').hide();

            $('.js-cart__button--clear').on('click', App.cart.clearAll);
            $('.js-cart__button--towait').on('click', App.cart.toWaitingList);
            $('.js-cart__button--getcatalog').on('click', App.cart.getCatalog);
            $('.js-cart__button--getcartlink').on('click', App.cart.getCartLink);
            $('.js-cart__button--newpromocode').on('click', App.cart.newPromoCode);
        }

        $('.js-cart--promo__activate').on('click', App.cart.promoActivate);

        //$('.js-cart__button--loadfromfile').on('change', App.cart.loadFromFile);


        if(!App.common.isIE8()){
            $('.js-cart__button--loadfromfile').closest('form')
                .on('submit', App.common.noSendForm);
            $('.js-cart__button--loadfromfile').fileupload({
                url: ACC.config.contextPath + '/cart/getProductListFromFile',
                dataType: 'json',
                add: App.cart.fileUploadAdd,
                done: App.cart.fileUploadDone,
                error: function(){
                    App.common.setGlobalError(ACC.text.errorLoading)
                }
            });
        }
        else{
            $('.js-cart__button--loadfromfile').on("change", function(){
                App.common.showLoading();
                $(this).closest("form").submit();
            });
        }

        $('.js-cart--fastadd__form').on('submit', App.cart.fastAdd);
        App.cart.fastAddCheck.call($('.js-cart--fastadd__field'));
        $('.js-cart--remove').on("click", App.common.showLoading);
        $('.js-orderlist--date').change(App.cart.orderListDateChange);
        App.cart.bindEventPromoField();
    }
};
