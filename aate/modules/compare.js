App.compare = {
    compareButtonClick: function(){
        var par = $(this).closest('.js-compare__table');

        if($(this).prop('checked'))
            par.find('.js-compare__property').each(App.compare.checkProperty);
        else par.find('.js-compare__property').each(App.compare.clearComparing)
    },
    addToFacetSearch: function(currentElement, id){
        var obj = {
            url: currentElement.find('.js-compare__link').attr('href'),
            img: currentElement.find('.js-compare__img').attr('src')
        };

        $('.js-compare__item.disable:first').attr("data-id", id)
            .removeClass('disable')
            .append($("#productComparasionFacetItem").tmpl(obj));
        $('.js-product-tocompare--view').addClass('active');
        //App.compare.bindEvent();
    },
    checkProperty: function(){
        var par = $(this),
            f = false,
            first = true,
            old = '';

        par.find('.js-compare__property__item').each(function(){
            if(f) return;
            if(old.length == 0 && first) {
                old = $.trim($(this).text().toLowerCase());
                first = false;
                return;
            }

            if(old != $.trim($(this).text().toLowerCase())){
                f = true;
                return;
            }
            old = $.trim($(this).text().toLowerCase());
        });

        if(f){
            par.find('.js-compare__property__title').addClass('different');
            par.find('.js-compare__property__item').addClass('different');
            return;
        }
        par.find('.js-compare__property__title').removeClass('different');
        par.find('.js-compare__property__item').removeClass('different');
    },

    clearComparing: function(){
        var item = $(this);
        item.find('.js-compare__property__title').removeClass('different');
        item.find('.js-compare__property__item').removeClass('different');
    },

    removeProductFromComparation: function(){
        $(this).off('click');
        //debugger;
        var par = $(this).hasClass('js-compare__item') ? $(this) : $(this).closest('.js-compare__item'),
            id = par.data().id,
            $this = $(this),
            obj = {productCode: id},
            successFunction = function(data){
                App.common.hideLoading();
                $(".js-product-tocompare[data-id=" + id + "]").removeClass("active")
                    .html(ACC.text.tocompare);

                App.compare.removeItem(id);

                if($(".js-compare__item").length > 1){
                    $('.js-comparison__properties').show();
                }
                else $('.js-comparison__properties').hide();

                if($this.hasClass('js-compare__button--close')){
                    data = JSON.parse(data);
                    data = App.compare.createContentOfComparisonView(data, "#productComparisonContent");
                    $('.js-compare__table').html(data.content);
                    App.compare.bindPopupEvent();

                    if (data.products.length > 1)
                        $('.js-comparison__properties').show();
                    else $('.js-comparison__properties').hide();
                }
            },
            url = ACC.config.contextPath + "/comparison/removeProductFromComparison";

        if($this.hasClass('js-compare__button--close'))
            App.common.showLoading();
        App.common.sendAjaxData(obj, url, successFunction, undefined, "text", "get");
    },

    //change products title, if it's seen
    //send to server ifo about removing
    removeItem: function(itemID){
        $('.js-compare__item[data-id=' + itemID + ']').each(function(){
            $(this).html('');
            if($(this).hasClass('js-compare__item--big'))
            {
                App.compare.removeItemFromTable($(this));
                $(this).removeClass('js-compare__item');
            }
            else App.compare.removeItemIcon($(this));

        });
        if($('.js-compare__item--big').length==0){
            App.common.closeBackWindow();
        }
    },

    removeItemIcon: function(elem){
        elem.addClass('disable');
        elem.removeAttr('data-id');

        var par = elem.parent();
        par.find('.disable').each(function(){
            par.append($(this));
        });
        if(!elem.parent().find(".js-compare__item").not(".disable").length)
            $(".js-product-tocompare--view").removeClass("active");
    },

    removeItemFromTable: function(elem){
        var tdArray = App.common.getRow(elem.closest('td'));
        for(var i = tdArray.length - 1; i>=0; i--){
            tdArray[i].html('')
                .removeClass('js-compare__property__item')
                .removeClass('js-compare__item--big')
                .removeAttr("data-id")
                .addClass("js-tableproduct__fastremoveitem");
        }
        $(".js-tableproduct__fastremoveitem").remove();

        if($('.js-back__window').find('.js-compare__table').length)
            $('.js-compare__table').css("marginLeft", parseInt(($('.js-compare__table').parent().width() - $('.js-compare__table').width())/2) + 'px');
        $('.js-compare__property__button').change();
    },

    showCompareWindow: function(){
        var $backBlock = $('.js-back__background'),
            $blockCompare = $('.js-comparasion__wrapper');
        $('body').append($backBlock);

        $backBlock.append($blockCompare);
        $backBlock.fadeIn(200);

        $blockCompare.show();

        $('.js-back--close').on('click', function(){
            $('.js-back__background').fadeOut('fast', function(){
                $('.js-comparasion__wrapper').each(App.common.removeChild)
            });
        });
    },
    showInOtherShopWindow: function(){
        var $backBlock = $('.js-back__background'),
            $blockOtherShop = $('.js-inothershop__wrapper');

        $('body').append($backBlock);

        $backBlock.append($blockOtherShop);
        $backBlock.fadeIn(200);
        $blockOtherShop.show();

        $('.js-back--close').on('click', function(){
            $('.js-back__background').fadeOut('fast', function(){
                $('.js-inothershop__wrapper').each(App.common.removeChild)
            });
        });
    },
    createContentOfComparisonView: function(result, templateName){
        if (!$.isEmptyObject(result.breadcrumbs)) {
            result["groupName"] = result.breadcrumbs[result.breadcrumbs.length - 1];
        }
        var uName = "Единица измерения";
        result.fields[uName]=[];
        for (var i= 0, len=result.products.length; i<len; i++){
            result.products[i].name = (result.products[i].name.length > 40)? result.products[i].name.substr(0,36)+"...":result.products[i].name;
            result.products[i].trademarklink = (result.products[i].trademark != null) ? encodeURIComponent(result.products[i].trademark.name) : '';
            result.fields[uName].push(result.products[i].unitName);
        }
        result.content = $('<div/>').append($(templateName || '#productComparisonContent').tmpl(result)).html();
        return result;
    },
    viewCompareProduct: function(elem) {
        if (elem.hasClass("active"))
        {
            var successFunction = function (result) {
                    result = JSON.parse(result);
                    if(result.products.length > 0){
                        var datas = App.compare.createContentOfComparisonView(result, "#productComparisonContent");
                        App.common.showBackWindowHtml($('#productComparasionWindow').tmpl(datas));
                        App.compare.bindPopupEvent();

                        if (datas.products.length > 1)
                            $('.js-comparison__properties').show();
                        else $('.js-comparison__properties').hide();

                        var $compareTable = $('.js-compare__table');
                        $compareTable.css("marginLeft", parseInt(($compareTable.parent().width() - $compareTable.width()) / 2) + 1 + 'px')
                    }
                };
            App.common.sendAjaxData("", viewProductComparisonsUrl, successFunction, undefined, "text", "get");
            return true;
        }
        return false;
    },
    toCompareProduct: function(elem){
        if(!App.compare.viewCompareProduct(elem))
        {
            var productCode = elem.data().id;
            var url = ACC.config.contextPath + "/comparison/addProductToComparison",
                data = {productCode: productCode},
                successFunction = function(result){
                    result = JSON.parse(result);
                    if(result.status == "FAIL")
                    {
                        App.common.showBackWindowHtml($('#okWindow').tmpl({message: result.message}));
                        return;
                    }
                    elem.text(ACC.text.incompare);
                    elem.addClass("active");
                    App.compare.addToFacetSearch(elem.closest('.js-item'), productCode);
                    App.common.getAnalyticsFnc("addToComparison")(productCode);
                };
            App.common.sendAjaxData(data, url, successFunction, undefined, "text", "GET")
        }
        return false;
    },

    bindPopupEvent: function(){
        var $backBlock = $('.js-back__window');
        if($backBlock.length){
            App.counterNumber.bindEvent();

            $backBlock.find('.add_to_cart_form')
                .on("submit", App.common.noSendForm);

            $backBlock.find('.js-product-add')
                .on("click",function(){
                    App.productAdd.addProduct($(this));
                });
            $backBlock.find('.js-compare__button--close, .js-compare__remove').on('click', App.compare.removeProductFromComparation);
            $backBlock.find('.js-compare__property__button').on('change', App.compare.compareButtonClick);
        }
    },
    bindEvent: function(){
        if(!$('.js-compareFacet__block').length)
            return;

        $('.js-compareFacet__block').on('click', '.js-compare__button--close, .js-compare__remove', App.compare.removeProductFromComparation);

        $('.js-product-tocompare--view').on("click", function () {
            App.compare.viewCompareProduct($(this));
            return false;
        });
        //$('.js-compare--show').on('click', App.compare.showCompareWindow);
    }
};
