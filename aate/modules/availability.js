App.availability = {
    getShopsData: function(){
        // show store availability
        $('.js-availability__link').on('click', function(){
            App.common.showLoading();
            $.ajax({
                url: ACC.config.contextPath + "/stock/check/" + ((ACC.product || {}).id ),
                data: '',
                success: function(data){
                    App.common.hideLoading();
                    if(data.availableStocks == null){
                        if(data.errorMessage){
                            App.common.showBackWindowHtml($('#okWindow').tmpl({message: data.errorMessage}));
                        }
                        return;
                    }
                    var l = 10,
                        i,
                        len;

                    data.pages = {};
                    data.pages.amountPerPage = l;
                    data.pages.pageCount = 0;
                    data.subwayNeed = false;

                    //subway
                    for(i = 0, len = data.availableStocks.length; i < len; i++){
                        if(data.availableStocks[i].subway != null)
                        {
                            data.subwayNeed = true;
                            break;
                        }
                    }

                    //pages
                    if(data.availableStocks.length > l){
                        data.pages.pageCount = Math.ceil(data.availableStocks.length / l);
                        data.pages.pageNumber = [];
                        for(i = 0, len = data.pages.pageCount; i < len; i++){
                            data.pages.pageNumber[data.pages.pageNumber.length] = data.pages.pageNumber.length + 1;
                        }
                    }

                    App.common.showBackWindowHtml($('#availabilitiListTemplate').tmpl(data))
                },
                error: function(){
                    App.common.hideLoading();
                    App.common.setGlobalError(ACC.text.errorLoading)
            }
            });
            return false;
        });
    },
    bindEvent: function(){
        $("#addVoucherFieldBtt").show();    //show button which needs if js is unable
        this.getShopsData();
    }
};

