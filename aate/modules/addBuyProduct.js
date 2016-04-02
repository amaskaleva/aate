App.productAdd = {
    addProduct: function(elem){
        if(elem.hasClass('active'))
        {
            window.location.href = elem.attr('href');
            return;
        }
        if(elem.hasClass('loading'))
            return false;

        var par = elem.closest('.js-product-add__wrapper'),
            form = elem.closest('form'),
            btn = par.find('.js-product-add'),
            count = parseInt(par.find('.js-counter__number').val()),
            code = form.find('.js-product-add__code').val(),
            sub = form.find('.js-product__sub'),
            url = ACC.config.contextPath + '/cart/add',
            sendType = form.attr('method'),
            typeId = elem.data() != undefined ? (elem.data("typeId") || elem.data("typeid")) : undefined;

        if(count <=0 || isNaN(count)){
            btn.attr('disabled', 'disabled');
            return;
        }
        btn.removeAttr('disabled');

        $(elem).addClass("loading");
        if(App.common.isIE())
        {
            $(elem).css("width", $(elem).outerWidth() + 1 + "px")
                .text(" ")
                .val(" ");
        }
        var obj = {productCodePost: code, qty: count},
            successFunction = function(result, statusText, xhr, formElement){
                if(App.common.isACC())
                {
                    $(elem).removeClass("loading");
                    $(elem).css("width", "");
                    App.common.getAnalyticsFnc("addToCart")(code, count, elem);
                    ACC.product.displayAddToCartPopup(result, statusText, xhr, formElement);
                    $('.js-product-add__code[value=' + code + ']').each(function() {
                        elem = $(this).closest('.add_to_cart_form ');

                        elem.find('.js-product-add')
                            .val((ACC.successmessage || {}).incart)
                            .attr('href', ACC.config.contextPath + "/cart")
                            .addClass('active')
                            .text((ACC.successmessage || {}).incart);
                        elem.find(".js-counter__wrapper").hide();
                    })
                }
            },
            errorFunction = function(){
                $(elem).removeClass("loading");
                if(App.common.isIE())
                {
                    $(elem).text((ACC.text || {}).tocart);
                    $(elem).val((ACC.text || {}).tocart);
                    $(elem).css("width", "");
                }
            }
        ;
        if(sub.length > 0)
            obj["sub"] = sub.val();
        if(typeId != undefined && typeId.toString().length > 0)
            obj["type"] = typeId;
        App.common.sendAjaxData(obj, url, successFunction, errorFunction,"text", sendType);
        return false;
    },
//    removeFromMiniCart: function(item){

    bindEvent: function(){
        $('.b-content').on('click', ".js-product-tobest", function(e) {
                e.preventDefault();
                App.favorites.toBestProduct($(e.target));
                return false;
            }).on('click', ".js-product-tocompare", function(e) {
                e.preventDefault();
                App.compare.toCompareProduct($(e.target));
                return false;
            }).on('click', ".js-product-add", function(e) {
                e.preventDefault();
                App.productAdd.addProduct($(e.target));
                return false;
            });

        /*set event to products*/
        $('.miniCartPopup').on('click', ".js-miniCart__remove", function(e){
            e.preventDefault();
            var $this = $(this);
            ACC.minicart.removeItemFromCart($this.data().item, $this.data().code);
            return false;
        })
    }
};