//manage SMS-notification;
App.smsnotification = {
    addPhoneNumber: function(form) {
        if(!App.common.isACC()) return false;

        var elem = form.find('.js-sms__input--phone'),
            data = {phoneNumber: elem.val()},
            url = ACC.config.contextPath + "/my-account/mailing-lists/add-phone-aj",
            succesFunction = function(response){
                App.common.removeAllErrors(form);
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    window.location.href = ACC.config.contextPath + '/my-account/mailing-lists/sms';
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage)
                }
            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    activateNumber: function() {
        if(!App.common.isACC()) return false;

        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = $(this).data().phonenumber,//;par.find('.js-sms__number'),
            data = '',//{phoneNumber: phone},
            url = ACC.config.contextPath + "/my-account/mailing-lists/activate-phone-aj?phoneNumber="+phone,
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    App.common.setSuccess(elem, ACC.text.smscodesended, false);
                    elem.remove();
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage)
                }
            };

        App.common.removeSimpleErrors($(".js-sms"));
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    setStyleOfSMSError: function(errField){
        errField.addClass("short");
        if(errField.height() > 50)
            errField.removeClass("short");
    },
    sendCode: function() {
        if(!App.common.isACC()) return false;
        App.common.removeSimpleErrors($(".js-sms"));

        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = par.find('.js-sms__number'),
            code = par.find('.js-sms__code'),
            data = {phoneNumber: phone.val(), code: code.val()},
            url = ACC.config.contextPath + "/my-account/mailing-lists/send-code-aj",
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    //elem.parent().html(ACC.successmessage.activated).addClass('b-colored--green');
                    App.common.showLoading();
                    window.location.href = ACC.config.contextPath + '/my-account/mailing-lists/sms';
                    /*par.find('.b-checkbox__input').prop("checked",true);

                    $(".js-sms .js-sms__radio--orderStatus").prop("checked", false);
                    $(".js-sms .js-sms__radio--orderStatus").prop("checked", true);*/
                    return;
                }

                var errField = '';
                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(code, response.errorMessageList[i].defaultMessage);
                    App.smsnotification.setStyleOfSMSError( code.siblings(".b-text--error"));
                }
            };

        if($.trim(code.val()).length == 0){
            App.common.setError(code, ACC.validateerror.required);
            App.smsnotification.setStyleOfSMSError( code.siblings(".b-text--error"));
            return false;
        }

        if(isNaN(Number(code.val()))){
            App.common.setError(code, ACC.validateerror.digits);
            App.smsnotification.setStyleOfSMSError( code.siblings(".b-text--error"));
            return false;
        }

        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    smsSubscribeDelete: function(phoneNumber, mailingList) {
        if(!App.common.isACC()) return false;
        App.common.removeSimpleErrors($(".js-sms"));

        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = par.find('.js-sms__number'),
            orderCode = elem.data('order'),
            data = {
                phoneNumber: phone.val(),
                mailingList: orderCode
            },
            url = ACC.config.contextPath + "/my-account/mailing-lists/sms-delete",
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    elem.parent().show();
                    elem.parent().siblings().hide();
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage)
                }
            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    smsSubscribe: function() {
        if(!App.common.isACC()) return false;
        App.common.removeSimpleErrors($(".js-sms"));


        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = par.find('.js-sms__number'),
            orderCode = elem.data('order'),
            data = {
                phoneNumber: phone.val(),
                mailingList: orderCode
            },
            url = ACC.config.contextPath + "/my-account/mailing-lists/sms-subscribe-aj",
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    elem.parent().hide();
                    elem.parent().siblings().show();
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage)
                }
            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    deletePhoneNumber: function() {
        if(!App.common.isACC()) return false;
        App.common.removeSimpleErrors($(".js-sms"));

        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = par.find('.js-sms__number'),
            data = {phoneNumber: phone.val()},
            url = ACC.config.contextPath + "/my-account/mailing-lists/delete-phone",
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    par.each(App.common.removeChild);
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage)
                }
            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    smsSubscribeToggle: function () {
        if(!App.common.isACC()) return false;

        var elem = $(this),
            par = $(this).closest('.js-check__line'),
            phone = par.find('.js-sms__number'),
            orderCode = elem.data('order'),
            isChecked =  par.find('[name=' + elem.attr('name') + ']:checked').length > 0,
            data = {
                phoneNumber: phone.val(),
                mailingList: orderCode
            },
            url = ACC.config.contextPath + ((isChecked)?"/my-account/mailing-lists/sms-subscribe-aj":"/my-account/mailing-lists/sms-delete"),

            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    return;
                }
                $('.message').each(App.common.removeChild);
                for(var i = 0, len = response.errorMessageList.length; i < len; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage);
                    App.smsnotification.setStyleOfSMSError(elem.siblings(".b-text--error"));
                }

                if(isChecked) {
                    elem.prop('checked', false);
                } else {
                    elem.prop('checked',true);
                }
            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        //return false;
    },

    setOrderStatus: function () {
        App.common.removeSimpleErrors($(".js-sms"));

        var elem = $(this),
            data = {phoneNumber: elem.val()},
            url = ACC.config.contextPath + "/my-account/mailing-lists/sms-order-subscribe-aj",
            succesFunction = function(response){
                response = JSON.parse(response);
                if (response.status == "SUCCESS") {
                    if(elem.prop("type") == "radio")
                    {
                        $(".js-sms [type=radio]").removeData("checked");
                        elem.data("checked", "checked");
                    }
                    return;
                }

                for (var i = 0; i < response.errorMessageList.length; i++) {
                    App.common.setError(elem, response.errorMessageList[i].defaultMessage);
                    App.smsnotification.setStyleOfSMSError(elem.siblings(".b-text--error"));
                }
                if(elem.prop("type") == "radio")
                {
                    elem.prop("checked", false);
                    $(".js-sms :data(checked)").prop("checked", true);
                }

            };
        App.common.sendAjaxData(data, url, succesFunction, undefined, 'text', 'post');
        return false;
    },

    bindEvent: function(){
        $('.js-sms .js-sms__button--delete').on('click', App.smsnotification.deletePhoneNumber);
        $('.js-sms .js-sms__button--activate').on('click', App.smsnotification.activateNumber);
        $('.js-sms .js-sms__button--sendCode').on('click', App.smsnotification.sendCode);
        $('.js-sms .js-sms__button--subscribe').on('click', App.smsnotification.smsSubscribe);
        $('.js-sms .js-sms__button--subscribedelete').on('click', App.smsnotification.smsSubscribeDelete);
        $('.js-sms .js-sms__button--subscribetoggle').on('change', App.smsnotification.smsSubscribeToggle);

        $('.js-sms .js-sms__radio--orderStatus').on('change', App.smsnotification.setOrderStatus);
        $('.js-sms [type=radio]:checked').data("checked", "checked");

        //$('.js-sms__code').on("focusin", function(){$(this).siblings("input").focus()});
        //$('.js-sms .js-sms__button--getcode').on('click', App.smsnotification.getCode);
        $('.js-sms .js-sms__code').on('keydown', function(e){
            if(e.keyCode == 13)
            {
                $(this).closest(".js-sms__form--sendCode").find('.js-sms__button--sendCode').click();
                return false;
            }
        });
        $('.js-sms .js-sms__code').on('keypress change', function(){
            if(!/^([0-9]{1,}$)/.test($(this).val()))
            {
                if($('.message').length > 0)
                {
                    $('.message').html(ACC.validateerror.digits);
                }
                else {
                    App.common.setError($(this), ACC.validateerror.digits);
                }
                return;
            }
            $('.message').remove();
            $(this).removeClass("b-text--error");
        });
        $('.js-sms--add--validate').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        App.common.showLoading();
                        App.smsnotification.addPhoneNumber($(form));
                        return false;
                    }};

            $(this).validate(obj);
        })
    }
};