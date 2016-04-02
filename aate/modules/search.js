App.search = {
    //click button "search", when you try to get new serach result
    searchFasetFindProducts: function(){
        App.search.hideProductMoreLink();
        return false;
    },

    searchFacetFormDisableField: function(){
        $('.js-searchBlock')
            .find('input[type=text]')
            .each(function(){
                if($.trim($(this).val()).length == 0)
                    $(this).attr("disabled", "disabled");
            });
        App.common.showLoading();
        $('.js-searchBlock')[0].submit();
    },

    //if something in the search conditions changes
    searchInputChangeEvent: function(){
        $('.js-searchBlock').on('submit', App.common.noSendForm)
        .find('input')
        .not("[type=submit], .js-search--range")
        .on('change', this.searchFacetFormDisableField);
    },
    setFacetDisplayEvent: function(){
        $(".js-searchBlock").find(".js-listTitle").on("click", App.search.saveFacetState);
    },
    hideFacetDisplayEvent: function(){
        $(".js-searchBlock").find(".js-listTitle").each(function(){
            var name = $(this).data().name,
                state = App.common.getDataFromBrowser(name);
            state = (state != null) ? Boolean(state) : false;

            if(state){
                $(this).addClass("hide");
                $(this).siblings(".js-listHide").hide();
            }
        });
    },
    //saveState of facets
    saveFacetState: function(){
        var name = $(this).data().name,
            state = !$(this).hasClass("hide");
        if(!state){
            App.common.clearDataFromBrowser(name);
        }
        else
            App.common.saveDataToBrowser(name, Number(state));
    },
    filterSuppliedData: function(filters, finishedClassName){
        var result = [];

        for(var key in filters)
        {
            result.push(filters[key]);
            if(filters[key].name == finishedClassName)
                break;
        }

        return result;
    },
    filterResultData: function(data, filter){
        var newData = {},
            resultData = {};

        $.each(data, function(key, value){
            $.each(value, function(key2, value2){
                if(filter[key2] != undefined)
                    newData[key2] = value2;
            });
            resultData[key] = newData;
        });
        return resultData;
    },
    getSuppliedData: function($form, isFilter){
        var arr = [],
            next = true,
            rstrdCategories = '',
            nextFilter = {},
            nextFilterName = "";

        $form.find(".js-supplies__select").each(function(){
            //if(!next)
            //    return;

            var obj = {},
                slct = $(this);//$form.find("[name='"+$(this).attr("name").replace(/\..+/,'')+".value']");

            obj["name"] = ($(this).data() || {}).filtername;//$(this).val();
            if(obj["name"] == undefined || obj["name"].length == 0)
                return;

            if(slct.val() == undefined || slct.val().length == 0 || slct.attr("disabled") == "disabled")
            {
                nextFilterName =  ($(this).data() || {}).filtername;
                if($.isEmptyObject(nextFilter))
                {
                    nextFilter = {
                        name: nextFilterName,
                        slct: slct
                    };
                }
                next = false;
                obj["value"] = "*";
            }
            else{
                {
                    obj["value"] = slct.val();
                    obj["displayValue"] = $.trim(slct.find(":selected").text());
                }
            }
            arr.push(obj);
        });
        if($.isEmptyObject(nextFilter))
            nextFilter = {
                name: ""
            };
        rstrdCategories = $form.find(".js-supplied__rstrdCategories").val().replace(/[\[\]\s]/g, "");
        if(rstrdCategories.length > 0)
            rstrdCategories = rstrdCategories.split(",");
            else rstrdCategories = [];

        var restrictFirstValues = ($form.find(".js-supplied__firstBoolean").val() == "true"),
            supplies = ($form.find(".js-supplied__suppliesBoolean").val() == "true");

        if(isFilter == undefined)
            isFilter = false;

        var resultArr = {
            filters: isFilter ? App.search.filterSuppliedData(arr, nextFilter.name) : arr,
            supplies: supplies,
            nextFilter: nextFilter.name,
            componentUid: $form.find(".js-supplied__uid").val()
        };

        if (resultArr.filters[0].value == "" || resultArr.filters[0].value == "*")
            resultArr["restrictFirstValues"] = restrictFirstValues;
        if (restrictFirstValues == false || ((resultArr.filters[0].value == "" || resultArr.filters[0].value == "*") && restrictFirstValues == true))
            resultArr["restrictedCategories"] = rstrdCategories;
        else
            resultArr["restrictedCategories"] = [];

        return {arr: resultArr, nextFilter: (next ? undefined : nextFilter)};
    },
    suppliedGetOption: function(e){
        if(!$('#' + $(this).attr("id").replace("-button", "")).hasClass("auto"))
            return;

        var $this = $('#' + $(this).attr("id").replace("-button", "")),
            $form = $this.closest(".js-supplies__form"),
            $val = $this.val();

        $this.val("*");
        $this.removeClass("auto");

        var sendData = App.search.getSuppliedData($form, $this.hasClass("widgetFixedItem"));
        sendData = sendData.arr;
        sendData["nextFilter"] = ($this.data() ||{}).filtername;
        var changeValue = false,
            idx = -1;
        $.each(sendData.filters, function(key, value){
            if(changeValue)
            {
                sendData.filters[key].value = "*";
                return;
            }
            if(value.value == "*")
            {
                changeValue = true;
            }
        });
        var url = "/supplies",
            successFunction = function(data){
                if(!$.isEmptyObject(data)){
                    if($this.hasClass("customItemNameParent")){
                        data = App.search.filterResultData(data, ($form.find(".js-supplied__properties").data() || {}).value || {});
                    }

                    var html = $("#suppliesSelectTemplate").tmpl({items: data});
                    $this.find("option").not("[disabled]").remove();
                    $this.append(html);
                }
                if($val != null)
                    $this.val($val);

                $this.selectmenu("refresh");
                $this.selectmenu("enable");

                $("#" + $this.attr("id") + "-menu").css("opacity", "");
                $("#" + $this.attr("id") + "-menu").show();
                App.jQui.checkSelectElementPosition.apply($this);
            };

        $("#" + $this.attr("id") + "-menu").css("opacity", "0");
        App.common.sendAjaxData(sendData, url, successFunction, undefined, "json", "post");
    },
    suppliedChangeOption: function(){
        if($(this).hasClass("auto"))
            return;

            $(this).nextAll("select").selectmenu("disable");
            var $this = $(this),
                $form = $(this).closest(".js-supplies__form");

            var properties;

            if($(this).hasClass("customItemNameParent")){
                properties = ($form.find(".js-supplied__properties").data() || {}).value || {};
                if(properties[$(this).val()] != undefined){
                    properties = properties[$(this).val()];
                    var $items = $form.find(".customItemName"),
                        idx = 0;

                    $.each(properties, function(key, value){
                        var $item = $items.get(key);
                        $($item).data("filtername", value);
                        idx++;
                    });
                }
            }

            var sendData = App.search.getSuppliedData($form, $(this).hasClass("widgetFixedItem")),
                nextFilter = sendData.nextFilter;

            sendData = sendData.arr;

            if(nextFilter == undefined || $.isEmptyObject(nextFilter))
            {
                nextFilter = "";
            }

            var url = "/supplies",
                successFunction = function(data){
                    $this.selectmenu("enable");
                    nextFilter.slct.find("option").not(":disabled").remove();

                    if(!$.isEmptyObject(data)){
                        if(nextFilter.slct.hasClass("customItemNameParent")){
                            data = App.search.filterResultData(data, ($form.find(".js-supplied__properties").data() || {}).value || {});
                        }

                        var html = $("#suppliesSelectTemplate").tmpl({items: data});
                        nextFilter.slct.append(html);
                        nextFilter.slct
                            .addClass("customWidth").
                        removeClass("auto");
                    }

                    $this.nextAll(".js-supplies__select").removeClass("auto");
                    $this.nextAll(".js-supplies__select").val("*");

                    $this.nextAll(".js-supplies__select").selectmenu("refresh");
                    nextFilter.slct.selectmenu("refresh");
                    nextFilter.slct.selectmenu("enable");
                };

            $this.selectmenu("disable");
            if(nextFilter == ""){
                $form.find(".js-supplies__button").removeAttr("disabled");
            }
            else $form.find(".js-supplies__button").attr("disabled", "disabled");
            App.common.sendAjaxData(sendData, url, nextFilter != "" ? successFunction : function(){$this.selectmenu("enable");}, undefined, "json", "post");
    },
    bindSuppliesEvent: function(){
        $(".js-supplies__form").each(function(){
            var $form = $(this);
            $form.on("click", '.js-supplies__button', function(){
                var $formThis = $(this).closest(".js-supplies__form");
                if($formThis.find("select:disabled").length)
                    return false;

                var can = true;
                $formThis.find("select").not(":disabled").filter(function(){
                    if($(this).val() == undefined || $(this).val() == "*" || $(this).val().length == 0)
                        can=false;
                });
                if(!can)
                    return false;

                App.common.showLoading();
                var data = App.search.getSuppliedData($form),
                    url = ($(this).data() || {}).link;
                if(url.indexOf("?") < 0)
                url +="?";
                if(!$.isEmptyObject(data))
                    $.each(data.arr.filters, function(key, value){
                        url += encodeURIComponent(value.name) +"=" + encodeURIComponent(value.value) + "&";
                    });
                url = url.replace(/[&]$/, '');
                window.location.href=url;
                return false;
            });

            $form.on("change", ".js-supplies__select", App.search.suppliedChangeOption);
            $form.on("mousedown", ".ui-selectmenu-button", App.search.suppliedGetOption);

            if(!$form.find(".js-supplies__select:first").hasClass("auto"))
                App.search.suppliedChangeOption.apply($form.find(".js-supplies__select:first").not(".auto"));

            var enable = $form.find("select:disabled").length == 0;

            if(enable)
                $form.find("select").filter(function(){
                    if($(this).val() == undefined || $(this).val() == "*" || $(this).val().length == 0)
                        enable=false;
                });

            if(enable)
                $form.find(".js-supplies__button").removeAttr("disabled");
        })
    },

    bindEvent: function(){
        if($(".js-searchBlock")){
            App.search.setFacetDisplayEvent();
            App.search.hideFacetDisplayEvent();
            App.search.searchInputChangeEvent();
        }
        $(".js-searchbutton--pseudoclear").on("click", function(){
            $(".js-searchbutton--clear")[0].click();
            return false;
        });
        this.bindSuppliesEvent();
    }
};