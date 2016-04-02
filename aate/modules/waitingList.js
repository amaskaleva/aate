App.waitingList = {
    addToCart:function()
    {
        $("#globalMessages").empty();
        var parent = $(this).closest(".js-waitinglist__form"),
            url = ACC.config.contextPath + "/waitinglist/addToCart-ajax",
            productsToCartCheckbox = parent.find("[type=checkbox]:checked").not(".js-check--only"),
            productsToCart = [],
            typeId = $(this).data() != undefined ? $(this).data("typeId") || $(this).data("typeid") : undefined;

        if(productsToCartCheckbox.length == 0) {
            var html = $("#errorMessage").tmpl({errors: [ACC.text.addWithoutProductsFromWLError]});
            $("#globalMessages").html(html);
            return false;
        }

        productsToCartCheckbox.each(function(){
            var productItem = {
                "quantity": 1,
                "sku": $(this).data().productcode || null,
                "entryNumber": $(this).data().entrycode || null,
                "checked": "on"
            };
            productsToCart.push(productItem);
        });

        var successFunction = function (addedEntries) {
            $.each(productsToCart, function (key, value) {
                if (addedEntries.indexOf(value.e) < 0) {
                    App.common.getAnalyticsFnc("addToCart")(value.sku, value.quantity, '.js-gtm--addtocart');
                }
            });

            $.each(addedEntries, function (index, value) {
                $('.js-check__line[data-entrycode=' + value + ']').remove();
            });
            var idx = 0,
                $lines = $(".js-check__line"),
                html;
            if(!$lines.length) {
                window.location.reload();
                return;
            }
            $lines.each(function(){
                $(this).find("td[name='index']").text(++idx);
            });

            if($(addedEntries).length > 0) {
                $("#globalMessages").html($("#successMessage").tmpl());
            }
            else {
                var errors = [];
                $.each(productsToCart, function(k,v){
                    if(addedEntries == null || addedEntries.length == 0 || addedEntries.indexOf(v.entrycode)<0)
                        errors.push(ACC.text.addNotAvailableProductByCode.replace("{0}", v.sku));
                });
                if(errors.length == 0)
                    errors = [ACC.text.addNotAvailableProductFromWLError];
                $("#globalMessages").html($("#errorMessage").tmpl({errors:errors}));
            }
        },
            sendedObj = {productQuantities: productsToCart};

        if(typeId != undefined && typeId.toString().length > 0)
            sendedObj.type = typeId;

        App.common.sendAjaxData(sendedObj, url, successFunction, undefined, "json", "post");
        return false;
    },
    removeItem: function()
    {
        var $global = $("#globalMessages");
        $global.empty();

        var parent = $(this).closest(".js-waitinglist__form"),
            url = ACC.config.contextPath + "/waitinglist/removeEntries-ajax",
            productsToRemoveCheckbox = parent.find("[type=checkbox]:checked").not(".js-check--only"),
            productsToRemove = [];

        if(productsToRemoveCheckbox.length == 0) {
            var html = $("#errorMessage").tmpl({errors: [ACC.text.removeWithoutProductsFromWLError]});
            $global.html(html);
            return false;
        }

        productsToRemoveCheckbox.each(function(){
            productsToRemove.push($(this).data().entrycode);
        });

        var successFunction = function (addedEntries) {
            $.each(productsToRemove, function (index, value) {
                $('.js-check__line[data-entrycode=' + value + ']').remove();
            });
            var $lines = (".js-check__line");
            if($lines.length == 0) {
                window.location.reload();
                return;
            }
            var idx = 0;
            $(".js-check__line").each(function(){
                $(this).find("td[name='index']").text(++idx);
            });

            if($(addedEntries).length == 0) {
                var html = $("#errorMessage").tmpl({errors:[ACC.text.couldNotRemoveProducts]});
                $global.html(html);
            }
        };

        App.common.sendAjaxData(productsToRemove, url, successFunction, undefined, "json", "post");
        return false;
    },
    setEmail:function()
    {
        $("#globalMessages").empty();
        var url = ACC.config.contextPath + "/waitinglist/isNotifyByEmail-ajax",
            button = $(this),
            requestFlagParam = Boolean($(this).data().flag),
            successFunction = function(response){
                if (response.status == "FAIL") {
                    var html = $("#errorMessage").tmpl({errors:[response.message]});
                    $("#globalMessages").html(html);
                };
                if (response.status == "SUCCESS") {
                    if (Boolean(button.data().flag)) {
                        button.removeClass("b-btn--grey").addClass("b-btn--green");
                    } else {
                        button.removeClass("b-btn--green").addClass("b-btn--grey");
                    }
                    button.data("flag",!Boolean(button.data().flag));
                }
        };
        App.common.sendAjaxData('', url + "?flag=" + requestFlagParam, successFunction, undefined, "json", "get");
        return false;
    },
    setSms: function()
    {
        $("#globalMessages").empty();
        var url = ACC.config.contextPath + "/waitinglist/isNotifyBySMS-ajax",
            button = $(this),
            requestFlagParam = Boolean($(this).data().flag),
            successFunction = function(response) {
                if (response.status == "FAIL") {
                    var html = $("#errorMessage").tmpl({errors: [response.message]});
                    $("#globalMessages").html(html);
                };
                if (response.status == "SUCCESS") {
                    if (Boolean(button.data().flag)) {
                        button.removeClass("b-btn--grey").addClass("b-btn--green");
                    } else {
                        button.removeClass("b-btn--green").addClass("b-btn--grey");
                    }
                    button.data("flag", !Boolean(button.data().flag));
                }
            };
        App.common.sendAjaxData('', url+'?flag=' + requestFlagParam, successFunction, undefined, "json", "get");
        return false;
    },
    toWaitingList: function() {
        var form = $(this),
            to_wl_link = $("#to_waitinglist_link"),
            url = ACC.config.contextPath + "/waitinglist/add-ajax",
            json = {
                "productCode": form.find('input[name="code"]').val(),
                "baseStoreUid": form.find('input[name="baseStore"]').val(),
                "b2bUnitUid": form.find('input[name="b2bUnit"]').val(),
                "postponed": form.find('input[name="isPostponed"]').val()
            };
            var options = {
                url: url,
                data: JSON.stringify(json),
                contentType: 'application/json',
                mimeType: 'application/json',
                type: "POST",
                dataType: "json",
                success: function (response) {
                    if (response.status == 'FAIL') {
                        alert(response.message);
                    } else {
                        $(form).remove();
                        to_wl_link.show();
                    }
                }
            };
            $.ajax(options);
        return false;
    },
    bindEvent: function(){
        if($('.js-waitinglist__form').length){
            $('.js-waitinglist__form').on('submit', App.common.noSendForm)
                .on('click', '.js-waitinglist__button--remove', App.waitingList.removeItem)
                .on('click', '.js-waitinglist__button--tocart', App.waitingList.addToCart)
                .on('click', '.js-waitinglist__button--email', App.waitingList.setEmail)
                .on('click', '.js-waitinglist__button--sms', App.waitingList.setSms);

            $('#add_to_waitinglist_form').on('submit', App.waitingList.toWaitingList);
        }
    }
};