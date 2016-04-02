App.checkout = {
    deliverySatArray: [],
    deliveryDateArray: [],
    deliveryThurArray: [],
    changeDeliveryFromTemplate: function(){
        $('.js-checkout--address--change__content--load').empty();

        var formHtml  = $('#checoutDeliveryAddressTemplate').tmpl();
        $(this).closest('.js-checkout--address--change__item').find('.js-checkout--address--change__content--load').append(formHtml);
        if($(this).attr('new') == 'new') {
            var formNewHtml  = $('#checoutNewDeliveryAddressTemplate').tmpl();
            $(this).closest('.js-checkout--address--change__item').find('.js-checkout--address--change__content--load').prepend(formNewHtml);
        }
        $(this).closest('.js-checkout--address--change__item').find('.js-checkout--address--change__content').show();
        App.common.windowInitElements('.js-checkout--address--change__content--load');
    },
    changeDelivery: function(){
        $('.js-checkout--address--change__content').hide();
        $(this).closest('.js-checkout--address--change__item').find('.js-checkout--address--change__content').show()
    },
    changeDeliveryType: function(){
        if($(this).attr('delivery') == 'delivery')
        {
            $('.js-delivery').show();
            $('.js-pickup').hide();
            return;
        }
        $('.js-delivery').hide();
        $('.js-pickup').show();
    },

    getSaturdayDates: function(){
        var url = window.location.href + "/move?dates",
            successFunction = function(result){
                App.common.hideLoading();
                if(result.status == "SUCCESS"){
                    $.each(result.dates, function(key, value){
                        $('select.js-checkout__date--sat').append("<option value='"+value+"'>" + value + "</option>");
                    });
                    App.checkout.setSaturdayDates();
                    $(".hasDatepicker").not($(".js-checkout__date--sat").attr("datepicker")).hide();
                    $(".js-date--sat").show();
                    return;
                }
                App.common.setGlobalError(result.message);
            },
            errorFunction = function(){
                App.common.hideLoading();
                App.common.setGlobalDownloadError();
            };

        App.common.sendAjaxData("", url, successFunction, errorFunction, "json", "get");
    },

    setSaturdayDates: function(){
        App.checkout.deliverySatArray = [];
        $('select.js-checkout__date--sat option').each(function(){
            App.checkout.deliverySatArray.push($.trim(App.jQui.formateDate($(this).text())));
        });

        if($('.js-checkout__date--sat').not('select').length > 0)
            $('select.js-checkout__date--sat').selectmenu('refresh');
        App.jQui.setDateDependence('.js-checkout__date--sat', ".js-date--sat", App.checkout.deliverySatArray, true);
    },

    changeDateTypeOfDelivery: function(){
        if($(this).val()!="COMMON"){
            $("#deliveryTimeslotCode").attr("disabled","disabled").selectmenu( "refresh" );
            if($(this).val()!="EVENING"){
                $("#deliveryDate").attr("disabled","disabled").selectmenu( "refresh" );
            }
            else
                $("#deliveryDate").removeAttr("disabled").selectmenu( "refresh" );
        } else {
            $("#deliveryTimeslotCode").removeAttr("disabled").selectmenu( "refresh" );
            $("#deliveryDate").removeAttr("disabled").selectmenu( "refresh" );
        }

        $(".js-checkout__dateblock").hide();
        var jsdatetime = $($(this).data().datetime);
        jsdatetime.show();
        $('.js-checkout__dateblock--wrapper').append(jsdatetime);

        if($(this).val()=="SATURDAY" && $('.js-checkout__date--sat option').length == 0){
            $(".hasDatepicker").not($(this).data("datepicker")).hide();
            App.common.showLoading();
            App.checkout.getSaturdayDates();
        }
        else{
            App.common.removeAllErrors();
            $(".hasDatepicker").not($(this).data("datepicker")).hide();
            $('.hasdatepicker').hide();
            $($(this).data("datepicker")).show();
        }
    },
    updatedDeliveryDateCheckout: function(){
        var $this = $('.js-checkout__date--inactive:checked').length > 0 ? $('.js-checkout__date--inactive:checked') : $('.js-checkout__date--inactive:first');
        if($this.val()!="EVENING" && $this.length > 0){
            $("#deliveryTimeslotCode").removeAttr("disabled");
        }
        else
        {
            $("#deliveryTimeslotCode").removeAttr("disabled");
        }

        if($this.val()!="COMMON" && $this.length > 0){
            $("#deliveryTimeslotCode").attr("disabled","disabled");
            if($this.val()!="EVENING"){
                $("#deliveryDate").attr("disabled","disabled");
                $("#deliveryTimeslotCode").removeAttr("disabled");
            }
            else
            {
                $("#deliveryDate").removeAttr("disabled");
                $("#deliveryTimeslotCode").removeAttr("disabled");
            }
        } else {
            $("#deliveryDate").removeAttr("disabled");
        }

        $(".js-checkout__dateblock").hide();
        if($this.length > 0)
        {
            $(".hasDatepicker").not($this.data("datepicker")).hide();

            var jsdatetime = $($this.data().datetime);
            $('.js-checkout__dateblock--wrapper').append(jsdatetime);
            jsdatetime.show();
        }
        $($this.data("datepicker")).show();

        $('.hasdatepicker').hide();
    },
    bindFurnitureEvent: function(){
        $('.js-checkout__date, .js-checkout__date--monday, .js-checkout__date--sat').on("change", function(){
            var startDate=new Date(App.jQui.formateDate($(this).val())).getTime();
            App.checkout.updateFurniture(startDate);
        });
        $('.js-checkout__date--inactive').on("change", function(){
            var startDate=new Date(App.jQui.formateDate($('.js-checkout__dateblock--wrapper '+$(this).data().datetime).find('.js-checkout__date, .js-checkout__date--monday, .js-checkout__date--sat').val())).getTime();
            App.checkout.updateFurniture(startDate);
        });
    },
    updateFurniture: function(startDate){
        var newDate,
            $furniture = $("select.js-furniture__date"),
            tempDate,
            count = 0;

        $furniture.empty();
        while (count < 5) {
            startDate += 24*60*60*1000;
            tempDate = new Date(startDate);
            if (tempDate.getDay() != 6 && tempDate.getDay() != 0) {
                newDate = $.datepicker.formatDate("dd.mm.yy", new Date(startDate));
                $furniture.append($('<option/>').attr("value", newDate).text(newDate));
                count++;
            }
        }
        $furniture.selectmenu("refresh");
    },
    bindDeliveryDateCheckoutEvent: function(){
        $('.js-checkout__date option').each(function(){
            App.checkout.deliveryDateArray.push(App.jQui.formateDate($(this).text()));
        });

        $('.js-checkout__date--monday option').each(function(){
            App.checkout.deliveryThurArray.push(App.jQui.formateDate($(this).text()));
        });

        $(".js-date.hasDatepicker").datepicker("destroy");
        App.jQui.setDateDependence('.js-checkout__date', ".js-date", App.checkout.deliveryDateArray, $('.js-checkout__date--sat:first').closest("label").find(".js-checkout__date--inactive:checked").length == 0);
        App.jQui.setDateDependence('.js-checkout__date--monday', ".js-date--monday", App.checkout.deliveryThurArray, $('.js-checkout__date--monday:first').closest("label").find(".js-checkout__date--inactive:checked").length > 0);

        App.checkout.setSaturdayDates();

        /*$('.js-checkout__date--inactive').data("datepicker", ".js-date");
        $('.js-checkout__date--sat:first').closest("label").find(".js-checkout__date--inactive").data("datepicker", ".js-date--sat");
        $('.js-checkout__date--monday:first').closest("label").find(".js-checkout__date--inactive").data("datepicker", ".js-date--monday");*/

        /*$('.js-checkout__date--sat').parent().hide();*/
        /*$('.js-checkout__date--monday').parent().hide();*/

        $('.js-checkout__date--inactive').on("change", App.checkout.changeDateTypeOfDelivery);

        //if($(".js-furniture__date").length > 0){
        //    App.checkout.bindFurnitureEvent();
        //}
    },
    bindPaymentModeCheckoutEvent: function(){
        if(!$("[name=paymentModeCode]:checked").hasClass("js-showAccount__bank"))
            $(".js-showAccount__bank--block").hide();

        $("[name=paymentModeCode]").on("change", function(){
            if($(this).hasClass("js-showAccount__bank")){
                $(".js-showAccount__bank--block").show();
                return;
            }
            $(".js-showAccount__bank--block").hide();
        });

        $('.js-showNextIfChecked__show').toggle();
        $('.js-showNextIfChecked__input:checked:first').closest('.js-showNextIfChecked__wrapper').find('.js-showNextIfChecked__show').show();
        $('.js-showNextIfChecked__wrapper').on("change", function(){
            $('.js-showNextIfChecked__show').hide();
            $('.js-showNextIfChecked__input:checked:first').closest('.js-showNextIfChecked__wrapper').find('.js-showNextIfChecked__show').show();
        });
    },
    bindDeliveryAddressEvent: function(){
        $('.js-checkout--address--change__content').hide();
        $('.js-checkout--address--change:checked')
            .closest('.js-checkout--address--change__item')
            .find('.js-checkout--address--change__content')
            .show();

        $('.js-checkout--address--change').on('click', App.checkout.changeDelivery);

        var $form = $('.js-checkout--address__form');
        if($form.length){
            var formTimer = null;

            if($form.find(".js-checkout--address--change__content").length > 20)
            {
                $form.find("button, [type=submit]").mousedown(function(){
                    if(formTimer != null)
                        return;
                    App.common.showLoading();
                    var $this = $(this);
                    formTimer = setTimeout(function(){
                        $this.click();
                    }, 300);
                });
            }


            $form.validate({});
            $form.on("submit", function(){
                if(formTimer != null)
                {
                    clearTimeout(formTimer);
                    formTimer = null;
                }
                var form = $form;
                if (!App.common.isACC()) return;

                if (form.validate().valid() && !form.hasClass("submited")) {
                    form.validate().checkForm();
                }
                if (!form.validate().valid()) {
                    App.common.hideLoading();
                    return false;
                }

                if(!form.hasClass("submited")){
                    var currentDeliveryAddress = $('.js-checkout--address--change:checked'),
                        currentRegionIso = $('.js-delivery__currentCode').val(),
                        isAvalaibleRegionIso = false,
                        isNotCurrentRegionIso = false,
                        selectedRegionIso = currentDeliveryAddress.hasClass('js-checkout--address__newaddress') ? $(".js-checkout--address__newaddress__region").val() : (currentDeliveryAddress.data() || {}).regioniso;

                    if(currentDeliveryAddress.hasClass('js-checkout--address__newaddress')){
                        if(currentRegionIso != $(".js-checkout--address__newaddress__region").val() && currentRegionIso.length > 0)
                            isNotCurrentRegionIso = true;
                    }
                    else
                    if (currentDeliveryAddress.length > 0 && currentDeliveryAddress.data().regioniso != currentRegionIso && currentDeliveryAddress.data().regioniso.length > 0)
                        isNotCurrentRegionIso = true;
                    else if(currentDeliveryAddress.length == 0)
                        isAvalaibleRegionIso = true;

                    if(typeof regionAvailableCodeId != "undefined")
                    {
                        if(regionAvailableCodeId.indexOf(selectedRegionIso) >= 0)
                            isAvalaibleRegionIso = true;
                    }
                    else isAvalaibleRegionIso = true;


                    if(isNotCurrentRegionIso || !isAvalaibleRegionIso){
                        App.common.hideLoading();
                        $(form).addClass("submited");

                        var option = {
                                message: !isAvalaibleRegionIso ? ACC.text.unableRegion : ACC.text.anotherRegion
                            },
                            html = $('#okWindow').tmpl(option);
                        App.common.showBackWindowHtml(html);
                        $('.js-back__window button').text(ACC.text.ok);

                        $('.js-back__window button').off("click");
                        $('.js-back__window button').on("click", function(){
                            if(!isAvalaibleRegionIso){
                                window.location.href = "/checkout/multi/delivery-address/invalidAddressRegion";
                                return false;
                            }
                            if (!$(form).validate().valid()) {
                                App.common.hideLoading();
                                $(form).removeClass("submited");
                                App.common.closeBackWindow();
                                return false;
                            }
                            App.common.showLoading();
                            formTimer = setTimeout(function(){
                                $(form).find('[type=submit]:first').click();
                            }, 300);
                        });
                        return false;
                    }
                    else App.common.showLoading();
                }
            });
        }
    },
    bindCheckoutEvent: function(){
        $('.js-checkout__fields--toggle').toggle();

        $(".js-checkout--change__name__button").on("click", function(){
            var $par = $(this).closest(".js-checkout--change__name__wrapper"),
                inp = $par.find(".js-checkout--change__name__input"),
                text = $par.find(".js-checkout--change__name__text"),
                hide = $par.find(".js-checkout--change__name__hide");
            inp.find("input").val($.trim(text.html()));
            $(this).hide();
            text.hide();
            hide.hide();
            inp.show();
        });
        $(".js-checkout--change__phone__button").on("click", function(){
            var $par = $(this).closest(".js-checkout--change__phone__wrapper"),
                inp = $par.find(".js-checkout--change__phone__input"),
                togglefieldShow = inp.closest(".js-checkout__fields--toggle"),
                togglefieldHide = $(this).closest(".js-checkout__fields--toggle"),
                text = $par.find(".js-checkout--change__phone__text");

            //debugger;
            inp.find("input").val($.trim(text.text().replace(/^([\s]{0,}\+7)/, '').replace(/([^\d])/g, "")).replace(/([0-9]{3})([0-9]{3})([0-9]{2})([0-9]{2})/,"($1) $2-$3-$4"));

            togglefieldHide.hide();
            togglefieldShow.show();
        });

        App.checkout.bindDeliveryAddressEvent();
        App.checkout.bindPaymentModeCheckoutEvent();
        App.checkout.bindDeliveryDateCheckoutEvent();
        App.checkout.updatedDeliveryDateCheckout();

        $(".js-checkout--toggle").hide();
        $(".js-checkout--height-by-calendar").css({
            height: "auto",
            minHeight: ($(".js-checkout--height-by-calendar").height() > $(".js-date").height() ? $(".js-checkout--height-by-calendar").height() : $(".js-date").height() + 10) + "px"
        })
            .parent().css("width", "50%");
        App.common.closeButtonClick();
    },
    bindConsolidateOrderEvent: function(){
        App.jQui.setDateDependenceInterval('.js-date--interval__start', '.js-date--interval__end', ".js-budgetDates");

        $(".js-budgetDates__start").datepicker({dateFormat: "dd.mm.yy", altField: ".js-date--interval__start", prevText: "<", nextText: ">",defaultDate: $(".js-date--interval__start").val(),onSelect: function(){
            $(".js-budgetDates__start").hide();
            $(".js-budgetDates").datepicker("refresh");
        }});

        $(".js-budgetDates__end").datepicker({dateFormat: "dd.mm.yy", altField: ".js-date--interval__end", prevText: "<", nextText: ">",defaultDate: $(".js-date--interval__end").val(),onSelect: function(){
            $(".js-budgetDates__end").hide();
            $(".js-budgetDates").datepicker("refresh");
        }});

        $(".js-date--interval__start").on('focus', function () {
            $(".js-budgetDates__start").show();
            $(".js-budgetDates__end").hide();
        });

        $(".js-date--interval__end").on('focus', function () {
            $(".js-budgetDates__end").show();
            $(".js-budgetDates__start").hide();
        });

        $('.js-checkout--phone__change').on('change', function () {
            if ($(this).prop('checked'))
                $('.js-checkout--phone').show();
            else
                $('.js-checkout--phone').hide();
        });
    },
    bindPlatronEvent: function(){
        /*$(".js-platron__radio").on("change", function () {
            var par = $(this).closest(".js-platron");
            par.addClass("valid");
            par.find(".js-platron__submit").addClass("active")
        });*/
        $(".js-platron").on("submit", function(){
            /*if(!$(this).hasClass("valid"))
                return false;*/
            App.common.showLoading();
        });
    },
    bindConfirmationEvent: function(){
        if($('.js-checkout--confirmation__form').length > 0)
        {
            $(".js-checkout--confirmation__comment").on("change", function(){
                $(this).addClass("changed");
            });
            $(window).on("beforeunload", function(e){
                var activeElement = $(e.target.activeElement);
                if(!activeElement.is('button, input[type=button]') && $(".js-checkout--confirmation__comment.changed").length > 0)
                {
                    var form = $(".js-checkout--confirmation__form"),
                        url = "confirmation/saveComments",
                        successFunction = function (result) {
                        };
                    form.attr("method", "post");
                    //App.common.showLoading();
                    App.common.sendForm(form, url, successFunction, function(){});
                }

            });
        }
    },
    paymentCoinsEvent: function(){
        /*$form.find(".js-checkout--coins__checkbox").on("change", function(){*/
        var $coins = $(".js-checkout--coins__checkbox");
        $coins.on("change", function(){
            if($(this).prop("checked") == true)
                $(".js-checkout--coins__table").show();
            else
                $(".js-checkout--coins__table").hide();
        });
        if($coins.filter(":checked").length){
            $(".js-checkout--coins__table").show();
        }
    },
    paymentAdditionalTypeEvent: function(){
        var nm = $('.js-courier__checkbox:first').attr("name"),
            $additional = $(".js-checkout__paymentType--additional__chbx"),
            $cRadio = $("[name="+nm+"]");

        $cRadio.not(".js-courier__checkbox").not("[disabled]").addClass("js-courier__checkbox--disabled");

        if($additional.filter(":checked").length > 0){
            $additional.not(":checked").closest(".js-checkout__paymentType--additional__label").removeClass("active");
        }

        $additional.on("change", function(){
            $(".js-checkout__paymentType--additional__label").removeClass("active");

            if($(this).prop("checked") == true)
            {
                $(".js-checkout__paymentType--additional__chbx").not($(this)).prop("disabled", true);
                $(".js-courier__checkbox--disabled").prop("disabled", true);
                $(this).closest(".js-checkout__paymentType--additional__label").addClass("active");
            }
            else
            {
                $(".js-checkout__paymentType--additional__chbx").prop("disabled", false);
                $(".js-courier__checkbox--disabled").prop("disabled", false);
                $(".js-checkout__paymentType--additional__label").addClass("active");
            }
        });

        if($additional.filter(":checked").length){
            $(".js-checkout__paymentType--additional__chbx").not(":checked").prop("disabled", true);
            $(".js-courier__checkbox--disabled").prop("disabled", true);
        };

        if($('.js-courier__checkbox:checked').length == 0)
            $(".js-checkout__paymentType--additional__body").hide();


        $cRadio.on("change", function(){
            if($(".js-courier__checkbox:checked").length)
                $(".js-checkout__paymentType--additional__body").show();
            else $(".js-checkout__paymentType--additional__body").hide();
        });

        if($('.js-courier__checkbox:checked').length == 0)
            $(".js-checkout__paymentType--additional__block").hide();


        $("[name="+nm+"]").on("change", function(){
            if($(".js-courier__checkbox:checked").length)
                $(".js-checkout__paymentType--additional__block").show();
            else $(".js-checkout__paymentType--additional__block").hide();
        });
    },
    paymentEvent: function(){
        var $form = $(".js-paymentmethod__form");

        App.checkout.paymentCoinsEvent();
        App.checkout.paymentAdditionalTypeEvent();

        $form.validate({
            ignore: ".js-giftcard__row .js-giftcard__number, .js-giftcard__row .js-giftcard__code, :hidden"
        });

        $form.on("submit", function(){
            var form = $(this);
            if (!App.common.isACC()) return;
            if (form.validate().valid()) {
                if(App.giftcard.wrapper.filter(":visible").length > 0)
                {
                    if(!App.giftcard.cardValidation())
                    {
                        App.common.setGlobalAttention(ACC.validateerror.giftcardglobal, "gift");
                        App.common.hideLoading();
                        return false;
                    }
                }
                App.common.showLoading();
                return;
            }
            else{
                if(App.giftcard.wrapper.filter(":visible").length > 0){
                    $(".gift").remove();
                    App.common.setGlobalAttention(ACC.validateerror.giftcardglobal, "gift");
                }
            }
            App.common.hideLoading();

        })

    },
    bindEvent: function(){
       this.bindCheckoutEvent();
       this.bindConsolidateOrderEvent();
       this.bindPlatronEvent();
       this.bindConfirmationEvent();
       this.paymentEvent();
    }
};
