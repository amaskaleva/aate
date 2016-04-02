App.company = {
    addByInn: function(form){
        var url = ACC.config.contextPath + "/my-account/add-company/inn-client-aj",
            successFunction = function(response){
                App.common.hideLoading();
                response = JSON.parse(response);
                App.common.getFormAjaxData(response, form, ACC.config.contextPath + response.message)
            };

        App.common.sendForm(form, url, successFunction, undefined, 'text');
        App.common.showLoading();
    },
    addBySpecPwd: function(form){
        var url = ACC.config.contextPath + "/my-account/add-company/spec-pass-aj",
            successFunction = function(response){
                App.common.hideLoading();
                response = JSON.parse(response);
                App.common.getFormAjaxData(response, form, ACC.config.contextPath + response.message)
            };

        App.common.sendForm(form, url, successFunction, undefined, 'text');
        App.common.showLoading();
    },

    newCompany: function(form){
        var url = ACC.config.contextPath + "/my-account/create-company-aj",
            successFunction = function(response){
                App.address.unsetAddressCityInLow(form);
                App.common.hideLoading();
                App.common.getFormAjaxData(response, form, ACC.config.contextPath + response.message)
            };

        if (form.find(".js-formparam--checkout").length) {
            console.log(form.find(".js-formparam--checkout").length);
            url += "?checkout=" + form.find(".js-formparam--checkout").val();
        }
        App.address.setAddressCityInLowNoSend(form);

        App.common.sendForm(form, url, successFunction, undefined, 'json');
        App.common.showLoading();
    },
    removeCompanyFromList: function(){
        var form = $(this).closest('form'),
            btn = $(this);

        if(form.find('[name=selectedCompany]:checked').length == 0)
            return false;

        form.on('submit', App.common.noSendForm);
        var option = {
                message: ACC.text.removeCompany,
                url: '#'
            },
            html = $('#approveWindow').tmpl(option);
        App.common.showBackWindowHtml(html);

        $('.js-approveWindow__buttonWrapper').find('button')
            .on('click', function () {
                form.off('submit', App.common.noSendForm);
            });

        $('.js-approveWindow__button').on('click', function () {
            btn.off('click', App.company.removeCompanyFromList);
            form.off('submit', App.common.noSendForm);
            btn.click();
            return false;
        }).html(ACC.text.continueRemove);
        return false;
    },
    makeCompanyChangeWindow: function(e){
        e.stopPropagation();
        App.common.removeAllErrors();

        var form = $(this).closest('.js-editCompanyInfo'),
            f = false,
            data = {
                'org': form.find('.js-editCompanyInfo__field--org:checked').length,
                'inn': form.find('.js-editCompanyInfo__field--inn:checked').length,
                'kpp': form.find('.js-editCompanyInfo__field--kpp:checked').length,
                'recipient': form.find('.js-editCompanyInfo__field--recipient:checked').length,
                'recipientPhone': form.find('.js-editCompanyInfo__field--recipientPhone:checked').length,
                'legalAddress': form.find('.js-editCompanyInfo__field--legalAddress:checked').length,
                'deliveryAddress': form.find('.js-editCompanyInfo__field--deliveryAddress:checked').length
            };
        $.each(data, function(key, value){
            if(value > 0)
                f = true;
        });

        if(!f)
        {
            App.common.setGlobalError(ACC.text.notSelectedEditedParameters);
            $('.js-editCompanyInfo__template').empty();
            return false;
        }

        var formHtml  = $('#editCompanyInformationTemplate').tmpl(data),
            popupHtml = $('#confirmFormPostTemplate').tmpl({form: $('<div/>').append(formHtml).html()});

        //App.common.showBackWindowHtml(popupHtml);
        App.common.addHtmlToBlock('.js-editCompanyInfo__template', popupHtml);
        return false;
    },

    /*
    //don't remove
    makeAddBankDataWindow: function(){
        App.common.removeAllErrors();
        var formHtml  = $('#bankDataAddTemplate').tmpl(),
            popupHtml = $('#confirmFormPostTemplate').tmpl({form: $('<div/>').append(formHtml).html()});

        App.common.showBackWindowHtml(popupHtml);
        return false;
    },*/

    makeAddBankDataHtml: function(){
        App.common.removeAllErrors();
        if($('.js-bankDataEdit__form').html().length > 0)
            return false;

        var formHtml  = $('#bankDataAddTemplate').tmpl(),
            popupHtml = $('#confirmFormPostTemplate').tmpl({form: $('<div/>').append(formHtml).html()});

        App.common.addHtmlToBlock('.js-bankDataEdit__form', popupHtml);
        return false;
    },

    changeCompany: function(){
        var companyId = $(this).val();
        var url = ACC.config.contextPath + "/my-account/my-manager/company?companyId=" + companyId;
        window.location.replace(url);
    },

    changeRegionCompanyFromList: function(){
        var form = $(this).closest('form');

        if(form.find('[name=selectedCompany]:checked').length == 0)
        {
            App.common.setGlobalError(ACC.text.notSelectedCompany);
            return false;
        }
    },

    bindCompanyInnEvent: function(){
        var obj, $form = $('.js-addcompany--byinn__form');
        if(!$form.length)
            return;

        obj = {
            submitHandler:
                function(form){
                    App.company.addByInn($(form));
                    return false;
                }
        };
        $form.validate(obj);
    },
    bindCompanySpecCodeEvent: function(){
        var obj, $form = $('.js-addcompany--byspecpwd__form');
        if(!$form.length)
            return;

        obj = {
            submitHandler:
                function(form){
                    App.company.addBySpecPwd($(form));
                    return false;
                }
        };
        $form.validate(obj);
    },
    bindNewCompanyEvent: function(){
        var obj, $form = $('.js-newCompany__form');
        if(!$form.length)
            return;

        obj = {
            submitHandler:
                function(form){
                    App.company.newCompany($(form));
                    return false;
                }
        };
        $form.validate(obj);
    },
    bindCompanyListEvent:function(){
        var $form = $('.js-companylist__form');
        if($form.length)
        {
            //companylist
            $form.find('.js-companylist__button--remove').on('click', App.company.removeCompanyFromList);
            $form.find('.js-companylist__select').on("change", App.company.changeCompany);
            $form.find('.js-companylist__button--region, .js-companylist__button--change').on('click', App.company.changeRegionCompanyFromList);
        }

        $form = $('.js-editCompanyInfo');
        if($form.length) {
            $form.find('.js-editCompanyInfo__button--change').on('click', App.company.makeCompanyChangeWindow);
            $('.js-bankDataEdit__button').on('click', App.company.makeAddBankDataHtml);
        }

        $form = $('.js-headerCompany--select');
        if($form.length){
            var compHeight = 0.8*$(window).height() - 50;
            compHeight = compHeight < 350 ? 350 : compHeight;

            $form.closest(".js-showWindow--child")
                .css("maxHeight", compHeight + "px");
            $form.css("maxHeight", compHeight - 2 + "px");

            if($form.find('a').length < 13)
                $form.css("overflow", "hidden")
        }
    },
    bindCompanyAddEvent: function(){
        $(".js-company__ilkconfirmation").on("click", function(){
            var option = {
                message: ACC.text.addILKCard,
                url: $(this).find("a").attr("href")
                },
            html = $('#approveWindow').tmpl(option);
            App.common.showBackWindowHtml(html);
            $('.js-approveWindow__buttonWrapper .js-back--close').html(ACC.text.back);
            $('.js-approveWindow__buttonWrapper .js-approveWindow__button').html(ACC.text.continueToWaitingList);
            return false;
        })
    },
    bindEvent: function(){
        this.bindCompanyInnEvent();
        this.bindCompanySpecCodeEvent();
        this.bindNewCompanyEvent();
        this.bindCompanyListEvent();
        this.bindCompanyAddEvent();
    }
};