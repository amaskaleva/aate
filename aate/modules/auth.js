//authorization
App.auth = {
    registerFormSubmit: function(){
        if($(this).attr('novalidate')=='novalidate')
            $(this).find('[type=password]').val('');
        return false;
    },
    registerForm: function(form){
        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/register/new-aj";

        var successFunction = function (response) {
            App.common.removeAllErrors();

            if (response.status == 'FAIL') {
                $.each(response.errorMessageList, function(key, value){
                    var item = form.find('[name=' + value.field + ']'),
                        $label = $('<label/>').addClass('b-text--error message').attr('for', item.attr('id')).html(value.defaultMessage);
                    if(item.parent('label').length>0){
                        item.parent().append($label);
                    }
                    else
                        item.after($label);
                    item.addClass('b-text--error');
                });

                form.find('[type=password]').val('');
            } else
            if(response.status == "IMKREDIRECT"){
                window.location.href = response.message;
            } else {
                var url = ACC.config.contextPath + "/my-account";
                if(form.find(".js-register__field--company:checked").length > 0)
                    url = ACC.config.contextPath + "/my-account/add-company";
                window.location.replace(url);
            }
        };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();

        return false;
    },

    //go to reset password page
    resetPassLinkGo: function(){

        var elem = $(this);
        var email = elem.closest('form').find('.js-validate--email').val();

        if (!App.common.isACC()) return;
        if(typeof ACC.config == "undefined") return false;

        var href = '/login/pw/request?email=';
        document.location = ACC.config.contextPath + href + (email != undefined ? email : '');

        return false;
    },
    setUpdatedPwd: function(form){
        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/login/pw/change-aj",
            successFunction = function (response) {
                App.common.removeAllErrors();

                if (response.status == 'FAIL') {
                    $.each(response.errorMessageList, function(key, value){
                        var item = form.find('[name=' + value.field + ']'),
                            $label = $('<label/>').addClass('b-text--error message').attr('for', item.attr('id')).html(value.defaultMessage);
                        if(item.parent('label').length>0){
                            item.parent().append($label);
                        }
                        else
                            item.after($label);
                        item.addClass('b-text--error');
                    });
                }
                else if(response.status == "IMKREDIRECT"){
                    window.location.href = response.message;
                } else {
                    var timerCount = 10,
                        html = $("#userUpdPwdTemplate").tmpl({count: timerCount});
                    form.replaceWith($(html));
                    var tm = setInterval(function(){
                            timerCount--;
                            if(timerCount < 0){
                                clearTimeout(tm);
                                var url = ACC.config.contextPath + "/login";
                                window.location.replace(url);
                                return;
                            }
                            else
                                $(".js-updatedPwd__count").text(timerCount+1);
                    }, 1000);
                }
            };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();
        return false;
    },
    updateResetPwdBindEvent: function(){
        var $form = $(".js-email__form");
        if ($form.length == 0)
            return;
        $form.validate({
            submitHandler: function(form){
                App.auth.setUpdatedPwd($(form));
                return false;
            }
        });
    },

    //reset password function
    resetPass: function(form) {

        if (!App.common.isACC()) return false;

        if (typeof ACC.config == "undefined") return false;

        var url = ACC.config.contextPath + "/login/pw/request-aj",
            email = $(form).find("[name=email]"),
            successFunction = function (data) {
                App.common.removeAllErrors(form);
                if(typeof data == "object")
                {
                    var textInfo="";

                    if(is_array(data.errorMessageList))
                        $.each(data.errorMessageList, function(key, value){
                            textInfo += ((textInfo.length>0) ? '<br>': '') + value.defaultMessage;
                        });

                    if (data.status == 'FAIL') {
                        $('<label class="b-text--error message" >' + textInfo + '</label>').insertAfter(email);
                        return;
                    }
                    else
                    if (data.status == 'SUCCESS')
                    {
                        var textInfo = "Success!";

                        if(typeof ACC.successmessage != "undefined")
                        {
                            textInfo = ACC.successmessage.resetepwd + " " + email.val();
                        }
                        if($('#globalMessages').length > 0)
                            App.common.setGlobalSuccess(textInfo);
                            else $('<label class="b-text--success message" >' + textInfo + '</label>').insertAfter(form.find('.js-validate--required:first'));
                        return;
                    }
                    $('<label class="message" >' + textInfo + '</label>').insertAfter(form.find('.js-validate--required:first'));
                }
            };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();
        return false;
    },

    //send "change password" object to server
    changePassword: function(form){

        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/my-account/update-password-aj";

        var successFunction = function (response)
        {
            App.common.removeAllErrors();
            App.common.hideLoading();

            if (response.status == 'FAIL') {
                $.each(response.errorMessageList, function(key, value){

                    var item = form.find('[name=' + value.field + ']'),
                        $label = $('<label/>').addClass('b-text--error message').attr('for', item.attr('id')).html(value.defaultMessage);

                    if(item.parent('label').length>0){
                        item.parent().append($label)
                    }
                    else
                        item.after($label);
                    item.addClass('b-text--error');
                })
            } else {
                var textInfo = "Success!";

                if(typeof ACC.successmessage != "undefined")
                {
                    textInfo = ACC.successmessage.changepwd + ' <a href="' + ACC.config.contextPath + "/my-account" +'" class="b-link">' + ACC.successmessage.accountname + "</a>";
                }

                form.find('input').not("[type=submit]").val('');

                form.before($('<label class="b-text--success b-text__message message">' + textInfo + "</label>"));
                //ACC.common.$globalMessages.html();
            }
        };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();

        return false;
    },

    //send "change email in personal page" object to server
    updateEmail: function(form){

        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/my-account/update-email-aj";

        var successFunction = function (response)
        {
            App.common.removeAllErrors();
            if (response.status == 'FAIL') {
                $.each(response.errorMessageList, function(key, value){

                    var item = form.find('[name=' + value.field + ']'),
                        $label = $('<label/>').addClass('b-text--error message').attr('for', item.attr('id')).html(value.defaultMessage);

                    if(item.parent('label').length>0){
                        item.parent().append($label);
                    }
                    else
                        item.after($label);
                    item.addClass('b-text--error');
                })
            }
            else {
                window.location.replace(ACC.config.contextPath + "/my-account");
            }
        };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();
        return false;
    },

    //send "change new account data in personal page" object to server
    updateAccountDetail: function(form){

        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/my-account/update-profile-aj";

        var successFunction = function (response)
        {
            App.common.removeAllErrors();
            if (response.status == 'FAIL') {
                $.each(response.errorMessageList, function(key, value){

                    var item = form.find('[name=' + value.field + ']'),
                        $label = $('<label/>').addClass('b-text--error message').attr('for', item.attr('id')).html(value.defaultMessage);
                    if(item.parent('label').length>0){
                        item.parent().append($label);
                    }
                    else
                        item.after($label);
                    item.addClass('b-text--error');
                })
            }
            else {
                window.location.replace(ACC.config.contextPath + "/my-account");
            }
        };

        App.common.sendJsonForm(form, url, successFunction);
        App.common.showLoading();
        return false;
    },

    //check password
    checkPassword: function(pass){
        return (!/[^0-9a-zA-Z]/.test(pass))
    },

    //check phone
    checkPhone: function(phone){
        if(typeof isValidNumber == "undefined")
            return false;
        return isValidNumber('+7'+phone, "RU") &&  /(^\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2})$/.test(phone);
    },

    checkFormValidPassword: function(){
        var btn = $(this).find('[type=password]');
        var f = true;
        $(this).find('input').not(btn).each(function(){
            if($(this).hasClass('b-text--error'))
                f=false;
        });
        if(!f)
            btn.val("");
    },

    removeGeneratedLabel: function(e){
        $(this).off('focusin', App.auth.removeGeneratedLabel);
        $(this).closest('.js-generate-pass__wrapper').find('.js-generate-pass__label').empty();
        $(this).val('');
        $(this).keyup();
    },
    bindEvent: function(){

        var loginfnc = function(){
            $(".js-loginpopup input").off("focus", loginfnc);
            var $bd = $(this).closest(".js-loginpopup");
            var option = ($bd.data() || {}).option || {};
            option.unclose = true;
            $bd.data("option", option);
        };
        $(".js-loginpopup input").on("focus", loginfnc);

        $('.js-generate-pass__button').on('click', function(){
            var pass = App.common.generatePassword(8);
            var $wrapper = $(this).closest('.js-generate-pass__wrapper');
            $wrapper.find('.js-generate-pass__field').val(pass)
                .focusout()
                .find('.js-generate-pass__field').keyup();

            $wrapper.find('.js-generate-pass__label').html('Предложенный пароль: <span class="b-colored--red">' + pass + '</span>');
            $wrapper.find('.js-generate-pass__field').on('focusin', App.auth.removeGeneratedLabel);

            return false;
        });


        $('.js-register__form').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        App.auth.registerForm($(form));
                        return false;
                    }};
            $(this).validate(obj);
            $(this).on('submit', App.auth.checkFormValidPassword)
        });
        $('.js-register__form--simple').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        App.common.formFilter($(form));
                        $(form)[0].submit();
                    }};
            $(this).validate(obj);
            $(this).on('submit', App.auth.checkFormValidPassword)
        });

        $('.js-auth__form').each(function(){

            if($(this).hasClass('js-popup')) {
                $(this).on('change', App.validation.checkFormValidButton)
            }

            $(this).validate();
        });

        $('.js-reset__form').each(function(){
            var obj = {};/*
                submitHandler:
                    function(form){
                        return App.auth.resetPass($(form));
                    }};
*/
            $(this).validate(obj);
        });

        $('.js-changepwd__form').each(function(){
            var obj = {};
                /*submitHandler:
                    function(form){
                        App.auth.changePassword($(form));
                        return false;
                    }};*/
            $(this).validate(obj);
        });

        $('.js-account--email__form').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        //App.auth.updateEmail($(form));
                        App.common.formFilter($(form));
                        $(form)[0].submit();
                    }};

            $(this).validate(obj);
        });

        $('.js-account--edit__form').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        //App.auth.updateAccountDetail($(form));
                        App.common.formFilter($(form));
                        $(form)[0].submit();
                    }};
            $(this).validate(obj);
        });

        $('.js-validate--reset_pass--link').on('click', App.auth.resetPassLinkGo);
        App.auth.updateResetPwdBindEvent();
    }
};