App.validation = {
    makeMethods: function(){
        $.validator.addMethod('equal_pass', function(val, el, args){
            var eqElem = $(el).closest('form').find(args);
            if (eqElem.length == 0) return false;
            return eqElem.val() == val;

        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.equalPassTo : ''));

        $.validator.addMethod('equal_field', function(val, el, args){
            var eqElem = $(el).closest('form').find(args);
            if (eqElem.length == 0) return false;
            return eqElem.val() == val;

        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.equalTo : ''));

        $.validator.addMethod('unequal_pass', function(val, el, args){
            var eqElem = $(el).closest('form').find(args);
            if (eqElem.length == 0) return true;
            return eqElem.val() != val;

        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.unequalTo : ''));

        $.validator.addMethod('equal_pass_master', function(val, el, args){
            var eqElem = $(el).closest('form').find(args);
            if(eqElem.length == 0) return;

            $(el).off('focusout');
            $(el).on('focusout', function(e){
                eqElem.focusout();
            });
            return true;
        }, "");

        $.validator.addMethod('check_pass', function(val, el, args){
            return (App.auth.checkPassword(val) == true);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.unequalTo : ''));

        $.validator.addMethod('digits_polite', function(val, el, args){
            return (!/[^0-9]/.test(val));
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.digits_polite : ''));

        $.validator.addMethod('check_field', function(val, el, args){
            return (App.auth.checkPassword(val) == true);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.equal : ''));

        $.validator.addMethod('check_phone', function(val, el, args){
            return (App.auth.checkPhone(val) == true);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.phone : ''));

        $.validator.addMethod('check_phone__simple', function(val, el, args){
            return (App.auth.checkPhone(val) == true || val.length == 0);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.phone : ''));

        $.validator.addMethod('digits_letter', function(val, el, args){
            return (/^([0-9a-zA-Z]{0,}$)/.test(val));
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.letterdigit : ''));

        $.validator.addMethod('letter', function(val, el, args){
            return (/^([a-zA-Zа-яА-Я\-\s]*$)/.test($.trim(val)));
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.letter : ''));

        $.validator.addMethod('digits_letter_expand', function(val, el, args){
            return (/^([а-яА-Я0-9a-zA-Z\s]{0,}$)/.test(val));
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.error : ''));

        $.validator.addMethod('k_digits', function(val, el, args){
            return val.length == 0 || (/^([0-9а-яА-Яa-zA-Z\s\-\.]+$)/.test(val));
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.letterdigit : ''));

        $.validator.addMethod('boundValidation', function(val, el, args){
            return (App.auth.checkPassword(val) == true);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.unequalTo : ''));

        $.validator.addMethod('cardnumber', function(val, el, args){
            return /^([0-9]{13}$)/.test(val);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.giftcardnumberfail : ''));

        $.validator.addMethod('cardcode', function(val, el, args){
            return /^([0-9a-zA-Z]{1,6}$)/.test(val);
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.giftcardcodefail : ''));

        $.validator.addMethod('cardcode_required', function(val, el, args){
            return val.length > 0;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.giftcardcoderequired : ''));

        $.validator.addMethod('cardnumber_required', function(val, el, args){
            return val.length > 0;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.giftcardnumberrequired : ''));

        $.validator.addMethod('cardnumber_length', function(val, el, args){
            return val.length == 13;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.giftcardnumberlength : ''));

        $.validator.addMethod('coinsmax', function(val, el, args){
            var max = ($(el).data() || {}).max;
            return !isNaN(Number(val)) &&!isNaN(Number(max)) && val <= max && val >=0;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.coinsmax : ''));

        $.validator.addMethod('coinsrequired', function(val, el, args){
            return val.length;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.coinsrequired : ''));

        $.validator.addMethod('city_settl', function(val, el, args){
            var par = $(el).closest('.js-formal') || $(el).closest('form'),
                rg = par.find('.js-formal__region:first');

            if($(el).val().length > 0)
                return true;

            return App.address.specRegions.indexOf(rg.val()) >= 0;
        }, (App.common.isACC() && ACC.validateerror != undefined ? ACC.validateerror.required : ''));
    },
    makeRules: function(){
        $.validator.addClassRules({
            'js-validate--email': {
                required: true,
                email: true,
                minlength: 2
            },
            'js-validate--simple': {
                required: true
            },
            'js-validate--pass--old':{
                required:true,
                equal_pass_master: '.js-validate--pass--new'
            },
            'js-validate--pass': {
                required: true,
                /*minlength: 1,*/
                unequal_pass: '.js-validate--pass--old'
            },
            'js-validate--pass--new': {
                required: true,
                minlength: 6,
                unequal_pass: '.js-validate--pass--old'
            },
            'js-validate--pass--simple': {
                required: true
            },
            'js-validate--pass_same': {
                required: true,
                equal_pass: '.js-validate--pass--new'
            },
            'js-validate--email_same': {
                required: true,
                equal_field: '.js-validate--email'
            },
            'js-validate--checkbox': {
                required: true
            },
            'js-validate--phone': {
                required: true,
                check_phone: true
            },
            'js-validate--phone--simple': {
                check_phone__simple: true
            },
            'js-validate__digits': {
                required: true,
                digits: true
            },
            'js-validate__digits--simple': {
                digits: true
            },
            'js-validate__bottles--simple': {
                digits_polite: true,
                maxlength: 3
            },
            'js-validate__city-settl': {
                city_settl: true
            },
            'js-validate__inn': {
                required: true,
                digits: true,
                maxlength: 12,
                minlength: 10
            },
            'js-validate__kpp': {
                required: true,
                //digits_letter: true,
                digits: true,
                minlength: 9,
                maxlength: 9
            },
            'js-validate__kpp--simple': {
                digits_letter: true,
                minlength: 9,
                maxlength: 9
            },
            'js-validate__po--simple': {
                digits_letter_expand: true
            },
            'js-validate__clientcode': {
                digits_letter: true
            },
            'js-validate__postal': {
                required: true,
                digits: true,
                minlength:6,
                maxlength:6
            },
            'js-validate__postal--simple': {
                digits: true,
                minlength:6,
                maxlength:6
            },
            'js-validate__office': {
                required: true,
                k_digits: true,
                minlength:1,
                maxlength:40
            },
            'js-validate__office--simple': {
                k_digits: true,
                maxlength:40
            },
            'js-validate__city__settl': {
                boundValidation: true
            },
            'js-validate__voucher': {
                required: true
            },
            'js-validate__ilkcard': {
                required: true,
                maxlength: 13,
                minlength: 13,
                digits: true
            },
            'js-validate__presentcard': {
                cardnumber_required: true,
                cardnumber_length: true,
                cardnumber: true
                /*maxlength: 13,
                 minlength: 13,
                 digits: true*/
            },
            'js-validate__presentcard__code': {
                //required: true,
                cardcode_required: true,
                cardcode: true
                /*maxlength: 6,
                minlength: 6*/
            },
            'js-validate__coins' : {
                coinsrequired: true,
                digits: true,
                coinsmax: true
            },
            'js-validate__name' : {
                required: true,
                letter: true
            },
            'js-validate__name--simple' : {
                letter: true
            }
        });

        if (App.common.isACC()){
            var ErrorMessages = ACC.validateerror;
            if(ErrorMessages != undefined){
                ErrorMessages["maxlength"] = $.format(ErrorMessages["maxlength"]);
                ErrorMessages["minlength"] = $.format(ErrorMessages["minlength"]);
                ErrorMessages["rangelength"] = $.format(ErrorMessages["rangelength"]);
                ErrorMessages["max"] = $.format(ErrorMessages["max"]);
                ErrorMessages["min"] = $.format(ErrorMessages["min"]);

                $.extend($.validator.messages, ErrorMessages);
            }
        }
    },
    checkFormValidButton: function(){
        var btn = $(this).find('[type=submit]');
        var f = true;
        $(this).find('input').not(btn).each(function(){
            if((($.trim($(this).val()).length == 0) && $(this).hasClass("required")) || $(this).hasClass('b-text--error'))
                f=false;
            else if($(this).attr("type") == "checkbox" && $(this).filter(":checked").length == 0 && $(this).hasClass("required"))
                f=false;
        });
        if(f)
            btn.addClass('active');
        else
            btn.removeClass('active')
    },
    addCustomValidationSelectEvent: function($selects){
        if(!$selects.length)
            return;

        $selects.closest("form")
            .on("submit", function(){
                var $select = $(this).find("select.js-validate__select");
                var bSubmitForm = true;
                $select.each(function(){
                    if($(this).find("option:data(selected)").length == 0)
                    {
                        App.common.hideLoading();
                        bSubmitForm = false;
                        App.common.setError($(this).siblings('.ui-selectmenu-button'), ACC.validateerror.requiredSelect);
                    }
                });
                if(!bSubmitForm)
                    return false;
            });

        $selects.on("change", function(){
            $(this).siblings(".message").remove();
            $(this).siblings('.ui-selectmenu-button').removeClass("b-text--error");
            $(this).find("option").removeData("selected");
            $(this).find("option:selected").data("selected", true);
        });

        $("form select.js-validate__select option[selected]").data("selected", true);
    },
    addCustomValidationRatingEvent: function($selects) {
        var $rates = $('.js-validate__rating');
        if (!$selects.length)
            return;

        $rates.closest("form").on("submit", function(){
            var $radio = $(this).find(".js-validate__rating");

            if($radio.filter(":checked").length == 0){
                App.common.setError($radio.closest(".js-validate__ratingWrapper"), ACC.validateerror.requiredSelect);
                App.common.hideLoading();
                return false;
            }
        });
        $rates.each(function(){
            $('[name='+$(this).attr("name") + ']').on("change", function(){
                $(this).closest(".js-validate__ratingWrapper").removeClass("b-text--error")
                    .siblings(".message")
                        .remove();
            });
        })
    },
    addCustomValidationEvent: function(){
        $('.js-validate__form.js-loading__form').each(function(){
            if($(this).hasClass('btnvalidate')) {
                $(this).on('change', App.validation.checkFormValidButton);
                App.validation.checkFormValidButton.apply($(this));
            }

            var obj = {
                submitHandler:
                    function(form){
                        App.common.showLoading();
                        $(form)[0].submit();
                    }};
            $(this).validate(obj);
        });
        $('.js-validate__form').not("js-loading__form").each(function(){
            $(this).validate({});
        });

        var $selects = $('select.js-validate__select');
        this.addCustomValidationSelectEvent($selects);
        this.addCustomValidationRatingEvent($selects);
    },
    validatePhoneFormat:{
        loaded: false,
        load: function(){
            if(this.loaded)
                return;
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = ACC.config.themeResourcePath + "/js/libs/phonenumber/PhoneFormat.js";
            document.getElementsByTagName("body")[0].appendChild(s);
        }
    },
    validatePhone: function(elements){
        var $phone = $(elements);

        if($phone.length){
            this.validatePhoneFormat.load();
            $phone.mask('(999) 999-99-99', {placeholder: '(___) ___-__-__'});
            $phone.removeAttr('maxLength');
        }
    },
    bindEvent: function(){
        this.makeMethods();
        this.makeRules();

        $('.js-validate--pass--new').on('keyup', function(){$(this).closest('form').find('.js-validate--pass_same').focusout()});

        this.validatePhone('.js-validate--phone, .js-validate--phone--simple');

        this.addCustomValidationEvent();
    }
};