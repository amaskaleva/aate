App.crossgoods = {
    loadedtabs: [],
    gotTabs: false,
    loadProductsAndTabs: function(){
        if(App.crossgoods.gotTabs){
            App.crossgoods.loadOnlyProducts.apply($(this));
        }
        var url = ACC.config.contextPath + "/relatedproducts/" + ACC.product.id,
            successFunction, errorFunction;

        errorFunction = function(){};
        successFunction = function(data){
            if(data == undefined)
            {
                errorFunction();
                return;
            }
            if(data.length == 0 || data.tabs == undefined || data.tabs.length == 0)
            {
                return;
            }
            /*$.each(data.products, function(key, value){
                console.log(key)
                if(value.price != null){
                    value.price.formattedValue = App.common.formatPrice(value.price.value);
                    value.price.crossedPrice = App.common.formatPrice(value.price.crossedPrice);
                }
                data.products[key] = value;
            });*/

            var html = $('#productDetailTabTemplate').tmpl(data),
                parent = $(".js-croddgoods__wrapper");

            if(!$.isEmptyObject(html) && (data || {}).products){
                parent.append(html);
                App.crossgoods.filledProductsSpace(data.products, "#" + App.common.getKey(data.tabs), data.nextProducts);
                App.tabs.tabs(".js-croddgoods__wrapper", App.crossgoods.loadOnlyProducts);
                parent.find(".js-tab:first").click();
            }
            App.crossgoods.getMoreProduct(".js-croddgoods__wrapper");
        };
        App.common.sendAjaxData({}, url, successFunction, errorFunction, "json", "POST");
        this.gotTabs = true;
    },

    loadOnlyProducts: function(){
        if(App.crossgoods.loadedtabs.length && App.crossgoods.loadedtabs.indexOf($(this).data("targettab")) >= 0)
            return;

        var type = ($(this).data() || {}).reftype,
            url = ACC.config.contextPath + "/relatedproducts/" + ACC.product.id + "/" + type,
            targetClass = ($(this).data() || {}).targettab,
            sucessFuntion, errorFunction;
        App.crossgoods.loadedtabs.push($(this).data("targettab"));
        if(type == undefined || type.length == 0)
            return false;
        errorFunction = function(){
            App.jQui.removeProgressBar();
            App.common.setGlobalDownloadError();
        };
        succesFunction = function(data){
            if(data == undefined)
            {
                errorFunction();
                return;
            }
            App.jQui.removeProgressBar();
            if(data.length == 0)
            {
                return;
            }
            App.crossgoods.filledProductsSpace(data.products, targetClass, data.nextProducts);
        };
        App.jQui.addProgressBar($(this).data("targettab"));
        App.common.sendAjaxData({}, url, succesFunction, errorFunction, "json", "POST");
    },

    filledProductsSpace: function(products, parentId, nextProducts){
        var parent = $(parentId),
            relatedLabelMaxCount = (parent.data() || {}).labelcount || 1;

        if(nextProducts != undefined && nextProducts.length > 0)
        {
            nextProducts = "["+nextProducts.join(",")+"]";
        }
        $.each(products, function(key, value){
            if(value.price != null){
                value.price.formattedValue = App.common.formatPrice(value.price.value);
                value.price.crossedPrice = App.common.formatPrice(value.price.crossedPrice);
            }
            if(value.labels != undefined && value.labels.length > 1)
            {
                value.labels = value.labels.splice(0, Math.min(value.labels.length, relatedLabelMaxCount));
            }
            products[key] = value;
        });
        var typeId = App.common.getAnalyticsFnc("getTypeIdByBlockType")(parentId.replace('#', '')),
            html2 = $('#productDetailTabContentTemplate').tmpl({products: products, nextProducts: nextProducts, typeId: typeId});
        parent.html(html2);
        App.counterNumber.bindEvent();
        if(parent.find(".js-simple-gallery").length){
            App.gallery.makeSimpleGallery.apply(parent.find(".js-simple-gallery"));
        }
        parent.find('.js-productinfo--hover').each(App.common.popupWindow);
        App.crossgoods.loadedtabs.push(parentId);
    },
    getSimilar: function(e){
        var url = $(this).attr("href"),
            successFunction = function (result) {

                if(result.products.length > 0){
                    var datas,
                        artInCart = [],
                        closeFunction = ACC.minicart.isCart ? function(){
                            var isChanged = false,
                                count = artInCart.length;

                            $compareTable.find(".js-product-add.active").each(function(){
                                if(isChanged)
                                    return;

                                if(artInCart.indexOf($(this).siblings(".js-product-add__code").val()) >=0)
                                {
                                    artInCart.splice(artInCart.indexOf($(this).siblings(".js-product-add__code").val()), 1);
                                }
                                else isChanged = true;
                            });
                            if(!isChanged && (artInCart.length != count))
                                isChanged = true;
                            if(isChanged)
                                window.location.reload();
                        } : undefined ;

                    if(!$.isEmptyObject(result.product))
                    {
                        var code = result.product.code;

                        $.each(result.products, function(key, value){
                            if(value.code != code)
                                result.products[key].similar = code;
                        });
                    }
                    datas = App.compare.createContentOfComparisonView(result, "#productSimilarContent")

                    App.common.showBackWindowHtml($('#productSimilarPopup').tmpl(datas), closeFunction);
                    App.compare.bindPopupEvent();

                    var $compareTable = $('.js-compare__table');
                    $compareTable.css("marginLeft", parseInt(($compareTable.parent().width() - $compareTable.width()) / 2) + 1 + 'px');

                    $compareTable.find(".js-product-add.active").each(function(){
                        artInCart.push($(this).siblings(".js-product-add__code").val());
                    });
                    $compareTable.on("click", ".js-popup__button--hideitem", App.crossgoods.hideSimilar);
                }
            };

        App.common.sendAjaxData({}, url, successFunction, undefined, "json", "GET");


        return false;
    },

    hideSimilar: function(){
        var $tl = $(this).closest(".js-compare__item"),
            $td = $tl.parent(),
            $table = $td.closest(".js-compare__table"),
            index = $td.index(),
            $tr;

        if($table.find(".js-popup__button--hideitem").length > 1)
            $tr = $table.find(".js-compare__property");
        else
        {
            $tr = $table.find("tr").not($td.closest("tr"));
        }
        $td.remove();

        $tr.each(function(){
            $(this).children().get(index).remove();
        });
        return false;
    },
    getMoreProductFnc: function() {
        if($(this).hasClass("unload") || !$(this).hasClass("getmore")|| $(this).hasClass("moving"))
            return;
        $(this).removeClass("getmore");
        var $parent = $(this).closest(".js-simple-gallery"),
            $this = $(this),
            dataList = ($parent.data() || {}).productlist;

        $.each(dataList, function(key, val){
            if($parent.find("[data-id="+val+"]").length > 0)
                dataList.splice(key, 1);
        });

        if(dataList.length == 0)
        {
            $this.addClass("unload");
            return;
        }
        var url = "/productBasicDetails/"+dataList.join(","),
            maxCount = ($parent.data() || {}).labelcount || 1,
            typeId = "",
            successFunction = function (data) {
                if(data.length == 0)
                {
                    $this.addClass("unload");
                    return;
                }
                data = JSON.parse(data);

                var dataList = ($parent.data() || {}).productlist;
                if(dataList.indexOf(data.code) >= 0)
                {
                    dataList = dataList.splice(dataList.indexOf(data.code), 1);
                    $parent.data("productlist", dataList);
                }
                if($parent.find("[data-id="+data.code+"]").length > 0)
                {
                    return;
                }

                if(data.price != null){
                    data.price.formattedValue = App.common.formatPrice(data.price.value);
                    data.price.crossedPrice = App.common.formatPrice(data.price.crossedPrice);
                }
                if(data.labels != undefined && data.labels.length > 1)
                {
                    var tempMin = Math.min(data.labels.length, maxCount),
                        temp = data.labels.splice(0, tempMin);

                    if(data.labels.length){

                        for(var i = temp.length - 1 ; i>=0; i--){
                            if((temp[i].imageSmall == undefined || temp[i].imageSmall.url.length > 0) && (temp[i].image == undefined || temp[i].image.url.length == 0)){
                                temp.splice(i,1);
                                if(data.labels.length > 0)
                                    temp.push(data.labels.shift());
                            }
                        }
                    }

                    data.labels = temp;
                }

                var templateName = "#productCarouselItemTemplate",
                    html;
                if($parent.hasClass("related"))
                {
                    templateName = '#productDetailTabContentItemTemplate';
                    html = $(templateName).tmpl({product: data, typeId: typeId});
                }
                else
                {
                    html = $(templateName).tmpl({products: [data]});
                }

                $parent.find(".js-gallery__item").last().after(html);
                html.find('.js-productinfo--hover').each(App.common.popupWindow);
                App.counterNumber.bindEvent();
                App.gallery.simpleGalleryInitCalculate($parent);
                App.counterNumber.bindEvent();
            };
        if($parent.hasClass("related"))
        {
            url = "/relatedproducts/product/"+dataList.join(",");
            typeId = App.common.getAnalyticsFnc("getTypeIdByBlockType")($parent.closest(".js-tabContent").attr('id')),
            maxCount = ($parent.closest(".js-tabContent").data() || {}).labelcount || 1;
        }
        App.common.sendAjaxData({}, url, successFunction, undefined, "text", "get")
    },
    getMoreProduct: function(selector){
        if(selector != undefined && selector.length > 0)
            $(selector).on("mousedown", ".js-simple-gallery[data-productlist] .js-gallery__next", App.crossgoods.getMoreProductFnc);
        else $(".js-simple-gallery[data-productlist]").on("mousedown", ".js-gallery__next", App.crossgoods.getMoreProductFnc);
    },
    bindEvent: function(){
        $(".js-similar__button").on("click", this.getSimilar);
        App.crossgoods.getMoreProduct();

        if($(".js-croddgoods__wrapper").length == 0)
            return;
        /*

        App.tabs.tabs(".js-croddgoods__wrapper", App.crossgoods.loadOnlyProducts);
        $(".js-croddgoods__wrapper .js-tab:first").click();*/

        this.loadProductsAndTabs();
    }
};

