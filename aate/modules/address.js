App.address = {
    specRegions: ["RU-MOW", "RU-SPE", "RU-SEV"],
    dadataEnable: false,
    isSpecRegionRegExp: new RegExp(),

    removeAddressFromTable: function(){
        if(!App.common.isACC()) return;

        var option = {
                message: ACC.text.clearAddress,
                url: $(this).attr("href")
            },
            html = $('#approveWindow').tmpl(option);
        App.common.showBackWindowHtml(html);
        return false;
    },

    updateRegion: function($city, kladr_id){
       if($city.length > 0)
        {
            var obj = {
                constraints:{
                    locations:{
                        kladr_id: kladr_id
                    }
                },
                geoLocation: {
                    kladr_id: kladr_id
                }
            };

            if(!$city.hasClass("js-formal__post"))
            {
                if(kladr_id == undefined){
                    $city.suggestions().clear();
                    $city.suggestions().disable();
                }
                else
                {
                    $city.suggestions().setOptions(obj);
                    $city.suggestions().enable();
                }
            }
        }
    },

    bindAddressSuggestionsItem: function(element, kladr_id, $fullKladr, lvl) {
        var item = element.item,
            bounds = element.bounds,
            minChars = bounds.indexOf("house") >= 0 ? 1 : 3;

        item.data("level", lvl);

        var options = {
            serviceUrl: ACC.location.SuggestionServiceUrl,
            token: ACC.location.SuggestionToken,
            type: "ADDRESS",
            hint: false,
            minChars: minChars,
            noCache: true,
            autoSelectFirst: true,
            triggerSelectOnSpace: false,
            bounds: bounds,
            onSelect: App.address.selectAddressSuggestions,
            restrict_value: true,
            onSearchStart: function(query){
                var level = item.data().level,
                    exampleLevelArray = parseInt($fullKladr.data().levelError);
                if($fullKladr.data().regionid != undefined && $fullKladr.data().regionid.length > 0)
                {
                    if(level > exampleLevelArray)
                    {
                        var par = $fullKladr.closest(".js-formal"),
                            levelExampleElement = par.find(":data(level)").filter(function(){
                                return $(this).data().level == exampleLevelArray;
                            });

                        if(levelExampleElement.length > 0 && levelExampleElement.val().length == 0)
                        {
                            exampleLevelArray++;
                            if(level == exampleLevelArray)
                                exampleLevelArray++;

                            $fullKladr.data("levelError", exampleLevelArray);
                        }

                        if(level > exampleLevelArray)
                            return false;
                    }
                }
                else return false;

            },
            onSearchComplete: function (query, suggestions) {
                /*console.log("complete", suggestions.length);*/
                if(suggestions.length == 0 && item.attr("class").indexOf("house") < 0){
                    {
                        $fullKladr.val('');
                    }
                }
            }
        };

        item.on("focusin", function(){
            var level = item.data().level,
                exampleLevelArray = parseInt($fullKladr.data().levelError);

            /*console.log("exampleLevelArray", exampleLevelArray);*/
            if(level > exampleLevelArray)
            {
                /*$(this).suggestions().clearCache();*/
                /*$(this).suggestions().hide();*/
            }

        });
        item.on("focusout", function(){
            if($(this).suggestions().suggestions.length == 1 &&
                $(this).suggestions().suggestions[0].unrestricted_value.toLowerCase().match(new RegExp('([.]{1,}\s'+ $.trim(item.val().toLowerCase())+')$')))
            {
                item.suggestions().onSelect($(this).suggestions().suggestions[0]);
            }
        });
        if (item.hasClass("js-formal__house")) {
            options.onSearchStart = function (query) {
                var beforeElement = $(this).closest(".js-formal").find($(this).data("before_elem_class"));
                if ($.trim(beforeElement.val()).length == 0 || beforeElement.data("kladrid") == undefined || beforeElement.data("kladrid").length == 0)
                    return false;
            };
        }
        if(item.suggestions != undefined){
            item.suggestions(options);
            App.address.updateRegion(item, kladr_id);
            this.dadataEnable = true;
        }

        /*var fnc = function(obj){
            //App.address.updateRegion(item, kladr_id);
            console.log(8);
            *//*console.log(obj);*//*
        };
        var newDeferred2 = $.Deferred(function(defer){
            //
            console.log(9);
        }).promise().done(fnc);


        //newDeferred2.done(fnc);*/

    },

    updateAddressSuggestion: function(parent, arr, $fullKladrId, $street, $city, $city2){
        var i, lenI, tempChild, h, lenH,
            kladr_id = parent.val().length > 0 ? regionId2KladrCode[parent.val()] : undefined,
            wasFormailzed = $fullKladrId.val().length > 0;

        for(i = 0, lenI = arr.length; i < lenI; i++)
        {
            if(!is_array(arr[i]))
            {
                arr[i] = [arr[i]];
            }
            tempChild = arr[i];
            for(h = 0, lenH = tempChild.length; h < lenH; h++)
            {
                if(tempChild[h].item.length == 0)
                    continue;

                App.address.updateRegion(tempChild[h].item, kladr_id);
                if(wasFormailzed)
                    tempChild[h].item.val('');
            }
        }

        if(App.address.specRegions.indexOf(parent.val().toUpperCase())>=0)
        {
            if($city2 != undefined)
                $city2.val(parent.find("option:selected").html());

            App.address.isSpecRegionRegExp = new RegExp("(" + $.trim(parent.find("option:selected").html().toLowerCase()) + ")$");
            if(!App.address.isSpecRegionRegExp.test($.trim($city.val()).toLowerCase()))
                $city.val("");

            $city.focusout();
            $street.focus();
        }
        else
        {
            $city.val("");
            if($city2 != undefined)
                $city2.val($city.val());
            $city.focus();
        }

        if(parent.val().length == 0)
        {
            $fullKladrId.val('');
        }
    },

    bindAddressSuggestionsDependence: function(arr, parent, $fullKladrId){
        var i, lenI,
            j, lenJ,
            child,
            classBefore = '',
            classCurrent = '';


        for(i = 0, lenI = arr.length; i < lenI; i++) {

            if (!is_array(arr[i])) {
                arr[i] = [arr[i]];
            }
            child = arr[i];

            for (j = 0, lenJ = child.length; j < lenJ; j++) {
                if(child[j] ==null || child[j].item == null || child[j].item.length == 0)
                    continue;

                if(classCurrent.indexOf("city__settl") < 0)
                {
                    if(classCurrent.length > 0)
                        classCurrent += ', ';
                    classCurrent += child[j].className;
                }

                child[j].item.data("before_elem_class", classBefore);
            }

            if(classCurrent.length > 0)
            {
                classBefore = classCurrent;
                classCurrent = '';
            }
        }

        classBefore = '';
        classCurrent = '';

        for(i = lenI - 1; i >= 0; i--) {

            if (!is_array(arr[i])) {
                arr[i] = [arr[i]];
            }
            child = arr[i];

            for (j = 0, lenJ = child.length; j < lenJ; j++) {
                if(child[j] ==null || child[j].item == null || child[j].item.length == 0)
                    continue;

                if(classCurrent.indexOf("city__settl") < 0)
                {
                    if(classCurrent.length > 0)
                        classCurrent += ', ';
                    classCurrent += child[j].className;
                }

                child[j].item.data("after_elem_class", classBefore);
            }

            if(classCurrent.length > 0)
            {
                classBefore = classCurrent;
                classCurrent = '';
            }
        }
    },

    setAddressSuggestionsKladr: function(arr, parent, fullKladr, update){
        var i, lenI,
            j, lenJ,
            child,
            kladr_id = parent.val().length > 0 ? regionId2KladrCode[parent.val()] : undefined;


        var arrKladr = [];

        arrKladr["area"] = fullKladr.substr(0, 6);
        arrKladr["city"] = fullKladr.substr(0, 10);
        arrKladr["settl"] = fullKladr.substr(0, 12);
        arrKladr["street"] = fullKladr.substr(0, 17);
        arrKladr["house"] = fullKladr.substr(0, 19);

        /*console.log("arr", arrKladr);*/

        if(arrKladr["area"].length>0)
            arrKladr["area"] = arrKladr["area"] + "0000000";

        if(arrKladr["city"].length>0)
            arrKladr["city"] = arrKladr["city"] + "0";

        for(i = 0, lenI = arr.length; i < lenI; i++) {

            if (!is_array(arr[i])) {
                arr[i] = [arr[i]];
            }

            child = arr[i];

            for (j = 0, lenJ = child.length; j < lenJ; j++) {
                if(child[j].item.length == 0)
                    continue;

                if(update != false)
                    if(kladr_id != undefined && kladr_id.length > 0){
                        /*console.log("upd", kladr_id);*/
                        App.address.updateRegion(child[j].item, kladr_id);
                    }

                if(child[j].bounds.indexOf("area")>= 0)
                    kladr_id = arrKladr["area"];

                if(child[j].bounds.indexOf("city-settl")>= 0)
                    kladr_id = arrKladr["settl"];

                if(child[j].bounds.indexOf("street")>= 0)
                    kladr_id = arrKladr["street"];

                child[j].item.data("kladrid", kladr_id);
            }
        }
        /*console.log("setsuggestion",kladr_id);*/
    },

    suggestionsMadeEmpty: function(){
        /*console.log("was changed", $(this).data().level, $(this).data().levelError, $(this).data().kladrid);*/
        if($(this).val().length > 0){
            var par = $(this).closest(".js-formal"),
                $fullKladrId = par.find(".js-formal__fullkladr");
            //if($(this).data().kladrid.length == 0)
            if($(this).data().level < $fullKladrId.data().levelError)
                $fullKladrId.data("levelError", $(this).data().level);

            if(($(this).attr("class").indexOf("house")<0) && ($(this).attr("class").indexOf("post")<0))
            {
                /*console.log(1, $(this).attr("class").indexOf("house"));*/
                $fullKladrId.val('');
            }
            return;
        }

        var beforeElement,
            afterElement,
            par = $(this).closest(".js-formal"),
            kladr_id = par.find(".js-formal__region").val() > 0 ? regionId2KladrCode[par.find(".js-formal__region").val()] : undefined,
            $fullKladrId = par.find(".js-formal__fullkladr"),
            level = 0;

        /*console.log("empty 1");*/
        $(this).data("kladrid", "");

        beforeElement = par.find($(this).data("before_elem_class"));

        while(beforeElement != undefined &&
            beforeElement.length > 0 &&
            beforeElement.data("kladrid") != undefined &&
            beforeElement.data("kladrid").length == 0 &&
            beforeElement.data("before_elem_class").length > 0)
            {
                beforeElement = par.find(beforeElement.data("before_elem_class"));
            }

        if(beforeElement!= undefined &&
            beforeElement.data("kladrid") != undefined &&
            beforeElement.length > 0 &&
            beforeElement.data("kladrid").length > 0)
            {
                kladr_id = beforeElement.data("kladrid");
                level = beforeElement.data().level;
            }

        afterElement = $(this);

        while(afterElement.length > 0)
        {
            if(afterElement.data("kladrid") == null ||
                afterElement.data("kladrid").indexOf(kladr_id) < 0)
                afterElement.data("kladrid", "");

            afterElement.not(".js-formal__post").each(function(){
                App.address.updateRegion($(this), kladr_id);
            });

            /*if(afterElement.hasClass("js-formal__post"))
                afterElement.val("");*/

            afterElement = par.find(afterElement.data("after_elem_class"));
        }

        if(($(this).attr("class").indexOf("house")<0) && ($(this).attr("class").indexOf("post")<0))
        {
            /*console.log(2);*/
            $fullKladrId.val('');
        }
    },

    suggestionsKladrEmpty: function(){
        if(($(this).attr("class").indexOf("house") < 0) && ($(this).attr("class").indexOf("post") < 0))
        {
            /*console.log("empty 2");*/
            $(this).data("kladrid", "");
        }
    },

    bindAddressSuggestionsEmpty: function(arr){
        var i, lenI,
            j, lenJ,
            child;

        for(i = 0, lenI = arr.length; i < lenI; i++) {

            if (!is_array(arr[i])) {
                arr[i] = [arr[i]];
            }
            child = arr[i];

            for (j = 0, lenJ = child.length; j < lenJ; j++) {

                if(child[j] ==null || child[j].item == null || child[j].item.length == 0)
                    continue;

                child[j].item.on("change", App.address.suggestionsMadeEmpty);
                child[j].item.on("keyup", App.address.suggestionsKladrEmpty);
            }
        }
    },

    getRegionArr: function(par){
        var $area = par.find(".js-formal__area"),
            $city = par.find(".js-formal__city"),
            $city_settl = par.find(".js-formal__city__settl"),
            $settlement = par.find(".js-formal__settlement"),
            $street = par.find(".js-formal__street"),
            $house = par.find(".js-formal__house"),
            $postal = par.find(".js-formal__post");

        return [
            [
                {item: $area, bounds: 'area', dataId: 'area', className: ".js-formal__area"}
            ],
            [
                {item: $city_settl, bounds: 'city-settlement', dataId: 'city', className: ".js-formal__city__settl"},
                {item: $city, bounds: 'city', dataId: 'city', className: ".js-formal__city"},
                {item: $settlement, bounds: 'settlement', dataId: 'settlement', className: ".js-formal__settlement"}
            ],
            [
                {item: $street, bounds: 'street', dataId: 'street', className: ".js-formal__street"}
            ],
            [
                {item: $house, bounds: 'house-block', dataId: 'house', className: ".js-formal__house"}
            ],
            [
                {item: $postal, bounds: 'postal_code', dataId: 'postal_code', className: ".js-formal__post"}
            ]
        ];
    },

    selectAddressSuggestions: function(suggestion){
        var k, lenK,
            h, lenH,
            tempChild,
            par = $(this).closest(".js-formal"),
            $fullKladr = par.find(".js-formal__fullkladr"),
            arr = App.address.getRegionArr(par),
            selectedRegionName = (par.find(".js-formal__region option:selected").text() || '').toLowerCase(),
            isSpecRegion = App.address.specRegions.indexOf(par.find(".js-formal__region").val() >= 0);


        var isValChanged = $(this).data("kladrid")== undefined? true : !($(this).data("kladrid").length > 0 && suggestion.data.kladr_id.indexOf($(this).data("kladrid"))>=0);

        $(this).data("kladrid", suggestion.data.kladr_id);

        var bounds = $(this).suggestions()["bounds"]["from"],
            f = false,
            twoMean = false,
            bounds1 = '',
            bounds2 = '';

        if(bounds == "house"){
            $(this).suggestions()["bounds"]["to"] = "block";
        }

        if($(this).suggestions()["bounds"]["to"] != bounds)
        {
            bounds = bounds + '-' + $(this).suggestions()["bounds"]["to"];
            bounds1 = $(this).suggestions()["bounds"]["from"];
            bounds2 = $(this).suggestions()["bounds"]["to"];
            twoMean = true;
        }

        $.each(arr, function(key, tempChild){

            if(!is_array(tempChild))
            {
                tempChild = [tempChild];
            }

            for(h = 0, lenH = tempChild.length; h < lenH; h++)
            {
                if(tempChild[h].item.length == 0)
                    continue;

                if(tempChild[h].bounds.indexOf("post") >= 0 &&
                        (
                            !(bounds.indexOf("street") >= 0 || bounds.indexOf("house") >= 0)||
                            (suggestion.data["postal_code"] == null || suggestion.data["postal_code"].length == 0)
                        )
                    )
                    continue;

                var val = "";

                twoMean= false;
                if(tempChild[h].bounds.indexOf("-") > 0){
                    bounds1 = tempChild[h].bounds.substr(0, tempChild[h].bounds.indexOf("-"));
                    bounds2 = tempChild[h].bounds.substr(tempChild[h].bounds.indexOf("-") + 1, tempChild[h].bounds.length);
                    twoMean = true;
                }

                var specRegionCityFilled = false;

                if(isValChanged){// && tempChild[h].bounds != bounds) {
                    if (twoMean) {
                        tempChild[h].item.val();

                        if(!(bounds1 == "city" && suggestion.data[bounds1] != null && selectedRegionName == suggestion.data[bounds1].toLowerCase()) && isSpecRegion) {
                            val = App.address.formateFromSuggestion(suggestion.data[bounds1 + "_type"], suggestion.data[bounds1 + "_type_full"], suggestion.data[bounds1]);
                        }

                        if (suggestion.data[bounds2] != undefined && suggestion.data[bounds2 + "_type"] != null) {
                            if (val.length > 0) val += ", ";
                            val += App.address.formateFromSuggestion(suggestion.data[bounds2 + "_type"], suggestion.data[bounds2 + "_type_full"], suggestion.data[bounds2]);
                        }

                        if(isSpecRegion && suggestion.data[bounds1] !=null && (selectedRegionName == suggestion.data[bounds1].toLowerCase()))
                            specRegionCityFilled = $.trim(tempChild[h].item.val()).length == 0 || App.address.isSpecRegionRegExp.test(tempChild[h].item.val());

                        if(!specRegionCityFilled)
                            tempChild[h].item.val(val);
                        tempChild[h].item.focusout();

                    }
                    else {
                        val = App.address.formateFromSuggestion(suggestion.data[tempChild[h].dataId + "_type"], suggestion.data[tempChild[h].dataId + "_type_full"], suggestion.data[tempChild[h].dataId]);
                        tempChild[h].item.val(val);
                        tempChild[h].item.focusout();
                    }

                    if(val.length == 0){
                        tempChild[h].item.data("kladrid", "");
                        /*console.log("empty 3");*/
                    }
                }

                var cs = (tempChild[h].bounds.indexOf("city") >= 0 || tempChild[h].bounds.indexOf("area") >= 0) && (bounds.indexOf("city") >= 0 || bounds.indexOf("area") >= 0);

                if (f && !cs)
                {
                    App.address.updateRegion(tempChild[h].item, suggestion.data.kladr_id);
                }

                if (tempChild[h].bounds == bounds) {
                    /*console.log(suggestion);*/
                    tempChild[h].item.val(suggestion.value);
                    f = true;
                }
            }

        });

        /*console.log("was changed by selected 0", $fullKladr.val());*/
        if(bounds.indexOf("house") < 0)
            par.find($(this).data().after_elem_class).focus();

        if($fullKladr != undefined && $fullKladr.length > 0)
        {
            /*console.log("empty 8");*/
            if(bounds.indexOf("street") >= 0)
            {
                /*console.log(10);*/
                $fullKladr.val(suggestion.data.kladr_id);
            }
            else if(bounds.indexOf("house") < 0)
            {
                /*console.log(3);*/
                $fullKladr.val('');
            }
        }


        /*console.log(par.find($(this).data().after_elem_class));*/

        $fullKladr.data("levelError",150);
        /*console.log("was changed by selected", $fullKladr.data("levelError"), $(this).data().kladrid);*/
        /*console.log("was changed by selected 1", $fullKladr.data("levelError"), $fullKladr.val());*/
        App.address.setAddressSuggestionsKladr(arr, par.find(".js-formal__region"), suggestion.data.kladr_id);
        /*console.log("was changed by selected 2", $fullKladr.data("levelError"), $fullKladr.val());*/
    },

    bindAddressSuggestions: function(arr, parent, $fullKladrId){
        if(typeof regionId2KladrCode == "undefined")
            return;

        if(!App.common.isACC())
            return;

        var i, lenI,
            j, lenJ,
            child,
            kladr_id = parent.val().length > 0 ? regionId2KladrCode[parent.val()] : undefined;

        for(i = 0, lenI = arr.length; i < lenI; i++){

            if(!is_array(arr[i]))
            {
                arr[i] = [arr[i]];
            }
            child = arr[i];

            for(j = 0, lenJ = child.length; j < lenJ; j++)
            {
                if(child[j] ==null || child[j].item == null || child[j].item.length == 0)
                    continue;

                if(child[j].item.hasClass("js-formal__post"))
                    break;
                App.address.bindAddressSuggestionsItem(child[j], kladr_id, $fullKladrId, i+1);
            }
        }
    },

    formateFromSuggestion: function(type, typeFull, text){
        var val = '';
        if(type != undefined && type != null && typeFull != undefined && typeFull != null)
        {
            val = type + (type != typeFull ? ". ":" ");
        }
        else if(type != undefined){
            val = type + " ";
        }
        if(text != undefined && text != null)
            val += text;
        return val;
    },

    checkAddressError: function(){
        var form = $(this);
        $("#globalMessages").empty();
        if(form.find('.b-text--error').not("label").length > 0){
            var option = {error: ""},
                html = $('#errorMessage').tmpl(option);
            $("#globalMessages").html(html);
            return false;
        }
    },

    setAddressCityInLow: function(form){
        App.address.setAddressCityInLowNoSend(form);
        form[0].submit();
    },
    setAddressCityInLowNoSend: function(form){
        if(form.find(".js-formal__city__settl").length == 0)
            return;
        form.find(".js-formal").filter(function() {
            if($(this).find(".js-formal__city").length > 0 && $(this).find(".js-formal__city__settl").length > 0){
                return $(this).find(".js-formal__city").val().length <= 0;
            }
            if($(this).find(".js-formal__city").length > 0 && $(this).find(".js-formal__city__settl").length > 0 && $(this).find(".js-formal__city").val().length > 0)
                return false;
            return !!($(this).find(".js-formal__city__settl").length > 0 && App.address.specRegions.indexOf($(this).find(".js-formal__region").val()) >= 0);

        }).each(function() {
            var nm = $(this).find(".js-formal__region :selected").text();
            if($(this).find(".js-formal__city").length > 0){
                $(this).find(".js-formal__city").val(nm);
                return;
            }
            $(this).find(".js-formal__city__settl").addClass("temporaryMeaning").val(nm).css("color", "transparent");
        });
    },
    unsetAddressCityInLow: function(form){
        form.find('.temporaryMeaning').val("").removeClass("temporaryMeaning").css("color", "");
    },

    bindDeliveryAddressEvent: function(){

        var obj,
            $addrForm = $('.js-deliveraddress--add__form'),
            $addrValidateForm = $('.js-validate__form--address');

        if($addrValidateForm.length){
            obj = {
                submitHandler:
                    function(form){
                        App.address.setAddressCityInLow($(form));
                        return false;
                    }};
            $addrValidateForm.each(function(){
                $(this).validate(obj);
            });
        }

        if(!$addrForm.length)
            return;

        $addrForm.validate({});
        $addrForm.on("submit", App.address.checkAddressError);
    },
    bindEvent: function() {
        App.address.bindDeliveryAddressEvent();
        $('.js-address--remove').on('click', App.address.removeAddressFromTable);

        var $wrapper = $(".js-formal");
        if($wrapper.length > 0){

            $wrapper.each(function(){
                var $region = $(this).find(".js-formal__region"),
                    $area = $(this).find(".js-formal__area"),
                    $city = $(this).find(".js-formal__city"),
                    $city_settl = $(this).find(".js-formal__city__settl"),
                    $settlement = $(this).find(".js-formal__settlement"),
                    $street = $(this).find(".js-formal__street"),
                    $house = $(this).find(".js-formal__house"),
                    $postal = $(this).find(".js-formal__post"),
                    $fullkladr = $(this).find(".js-formal__fullkladr");

                var fullKladrId = $fullkladr.val();

                var arrAddresses = [
                    [
                        {item: $area, bounds: 'area', dataId: 'area', className: ".js-formal__area"}
                    ],
                    [
                        {item: $city_settl, bounds: 'city-settlement', dataId: 'city', className: ".js-formal__city__settl"},
                        {item: $city, bounds: 'city', dataId: 'city', className: ".js-formal__city"},
                        {item: $settlement, bounds: 'settlement', dataId: 'settlement', className: ".js-formal__settlement"}
                    ],
                    [
                        {item: $street, bounds: 'street', dataId: 'street', className: ".js-formal__street"}
                    ],
                    [
                        {item: $house, bounds: 'house-block', dataId: 'house', className: ".js-formal__house"}
                    ],
                    [
                        {item: $postal, bounds: 'postal_code', dataId: 'postal_code', className: ".js-formal__post"}
                    ]
                ];
                $city_settl.on("keyup", function(){
                    $city.val($(this).val());
                });
                if($region.find("option").length > 0)
                {
                    App.address.bindAddressSuggestions(arrAddresses, $region, $fullkladr);
                    if(!App.address.dadataEnable)
                        return;
                    App.address.bindAddressSuggestionsDependence(arrAddresses, $region);
                    App.address.bindAddressSuggestionsEmpty(arrAddresses, $region, $fullkladr);

                    if(fullKladrId.length > 0)
                    {
                        App.address.setAddressSuggestionsKladr(arrAddresses, $region, $fullkladr.val());
                    }
                    $fullkladr.data("levelError", 150);

                    if(App.address.specRegions.indexOf($region.val()) >= 0)
                        $(this).find(".js-formal__regionmandatory").hide();
                    else $(this).find(".js-formal__regionmandatory").show();

                    $region.on('change', function(){
                        $fullkladr.data("regionid", $region.val());
                        App.address.updateAddressSuggestion($(this), arrAddresses, $fullkladr, $street, $city_settl.length>0?$city_settl:$city, $city_settl.length>0?$city:undefined);
                        if(App.address.specRegions.indexOf($(this).val()) >= 0)
                            $(this).closest(".js-formal").find(".js-formal__regionmandatory").hide();
                        else $(this).closest(".js-formal").find(".js-formal__regionmandatory").show();
                    });

                    $house.on("focusin", function(){
                        if($(this).parent().find(".suggestions-wrapper").children().length == 0)
                        {
                            $(this).suggestions().clearCache();
                            $(this).suggestions().update();
                        }
                        else
                            $(this).parent().find(".suggestions-wrapper").show();
                    });
                    $fullkladr.data("regionid", $region.val());
                }
                if(App.address.specRegions.indexOf($region.val()) >= 0 && new RegExp(($region.find(":selected").text().toLowerCase())+"$", 'i').test($city_settl.val()))
                    $city_settl.val('');
            });
            if(this.dadataEnable)
                $('.js-address__fields--toggle').toggle().removeClass("js-address__fields--toggle");
        }
    }
};