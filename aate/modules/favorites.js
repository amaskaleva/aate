App.favorites = {
    toBestProduct: function(elem){
        var productCode = elem.data().code;

        if(typeof productCode == "undefined" || productCode == undefined)
            return false;

        var url = ACC.config.contextPath + "/favorites/addProductToFavorites",
            data = {productCode: productCode},
            successFunction = function(result){
                if(!App.common.isACC()) return;
                if(ACC.successmessage == undefined) return;

                elem.text(ACC.successmessage.infavourite);

                elem.off('click', App.productAdd.toBestProduct);

                if(!App.common.isACC()) return;
                elem.removeClass('js-product-tobest');
                elem.attr('href', ACC.config.contextPath + "/favorites/viewFavorites");
                App.common.getAnalyticsFnc("addToFavorites")(productCode);
            };
        App.common.sendAjaxData(data, url, successFunction, undefined, 'text', 'get');
        return false;
    },

    removeChecked:function(){
        //TODO:ajax-request
    },

    removeFromBestOnly: function(){
        if(!App.common.isACC()) return;
        App.common.removeGlobalMessageErrors();
        App.common.removeGlobalMessageErrors();

        var elem = $(this);
        var productCodesMap = elem.closest('tr').find('[type=checkbox]').data('productcode'),
            url = ACC.config.contextPath + "/favorites/removeProductFromFavorites",
            successFunction = function(data)
            {
                if (data.success) {
                    $('#product_' + productCodesMap).each(App.common.removeChild);
                    $(".js-favorites__categories").removeClass("show");
                    $.each(data.categoryCodes, function(key, value){
                        $(".js-favorites__categories#"+value.code).addClass("show");
                    });
                    $(".js-favorites__categories").not(".show").remove();

                    if ($('tr[id^=product_]').length == 0) {
                        $('#submits').each(App.common.removeChild);
                        $('.js-productstable__table').find("tbody").append('<tr class="noprint"><td class="b-tableProduct__td" colspan="9">' + ACC.text.favorites_no_products + '</td></tr>');
                    }
                }
            };

        App.common.sendAjaxData([productCodesMap], url, successFunction, undefined, 'json', 'POST');
        return false;
    },
    removeFromBest: function(){
        if(!App.common.isACC()) return;

        var elem = $(this);
        var productCodesMap = App.common.getProductCodes(".js-favorites__table", true),
            url = ACC.config.contextPath + "/favorites/removeProductFromFavorites",
            successFunction = function(data)
            {
                App.common.removeGlobalMessageErrors();

                if($.isEmptyObject(data))
                    return;
                if(data.success)
                    $.each(productCodesMap, function(key, value){
                        $('#product_' + value).each(App.common.removeChild);
                    });
                if(data.info != undefined && data.info.length > 0){
                    App.common.setGlobalAttention(data.info);
                }
            };

        App.common.sendAjaxData(productCodesMap, url, successFunction, undefined, 'json', 'POST');
        return false;
    },

    updatePrice: function(){
        var par = $(this).closest('.js-check__line');
        if(par.length == 0) return;

        var count = Number(App.common.getNumber(par.find('.js-price').html()) * parseInt(par.find('.js-counter__number').val().replace(/[^\d,.]/g,'')));
        if(isNaN(count))
            count = 0;
        par.find('.js-price--result').html(App.common.getPrice(App.common.setNumber(count.toFixed(2))));
        par.find('.js-price--result').change();
    },

    addToFavorites: function(){
        if(!App.common.isACC())
            return;

        var url = ACC.config.contextPath + "/view/CMSRecentlyViewedProductsListComponentController/addProductsToFavorites",
            productsToCart = App.common.getProductCodesWithCount('.js-productstable__table');

        var successFunction = function(response){
            window.location.href = response;
        };

        App.common.sendAjaxData(productsToCart, url, successFunction, undefined, "json", "post");
        return false;
    },


    updateCount: function() {
        var elem = $(this),
            obj = {
                code: elem.closest(".js-check__line").find(".js-check").data("productcode"),
                quantity:  elem.closest(".js-check__line").find(".js-counter__number").val()
            },
            url = ACC.config.contextPath + "/favorites/changeQuantityFavoritesProduct";
        App.common.sendAjaxData(obj, url, undefined, undefined, "text", "POST");
        $(this).hide();
        $(this).closest(".js-check__line").find(".js-favorite--remove--only").show();
        return false;
    },

    bindEvent: function(){
        $('.js-productstable--tofavorites').on('click', App.favorites.addToFavorites);

        var $table = $('.js-favorites__table');
        if(!$table.length) {
            //$('.js-productstable--add').on('click', App.favorites.addProducts);

            return;
            $table.find('.js-favorite--update').hide();
        }
        //$('.js-favorites__table .js-counter__number').on("change",App.favorites.updateCount);

        $table.find('.js-favorite--remove').on('click', App.favorites.removeFromBest);

        $table.find('.js-favorite--remove--only').on('click', App.favorites.removeFromBestOnly);

        $table.find('.js-check__line').find('.js-counter__number').on('change', App.cart.buttonUpdateEnable);
        $table.find('.js-favorite--update').on('click', App.favorites.updateCount);
    }

};