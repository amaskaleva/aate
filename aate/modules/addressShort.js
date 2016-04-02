App.addressShort = {
    specRegions: ["RU-MOW", "RU-SPE", "RU-SEV"],
    dadataEnable: false,
    isSpecRegionRegExp: new RegExp(),

    bindAddressSuggestions: function(addressField, parent, $fullKladrId){
        if(typeof regionId2KladrCode == "undefined")
            return;

        if(!App.common.isACC())
            return;

        var kladr_id = parent.val().length > 0 ? regionId2KladrCode[parent.val()] : undefined;

        if(!$.isEmptyObject(addressField))
            App.addressShort.bindAddressSuggestionsItem(addressField, kladr_id, $fullKladrId);
    },

    bindAddressSuggestionsItem: function(element, kladr_id, $fullKladr) {

        var item = element.item,
            bounds = element.bounds,
            minChars = 1;

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
            onSelect: App.addressShort.selectAddressSuggestions,
            restrict_value: true
        };

        item.on("focusout", function(){
            if($(this).suggestions().suggestions.length == 1 &&
                $(this).suggestions().suggestions[0].unrestricted_value.toLowerCase().match(new RegExp('([.]{1,}\s'+ $.trim(item.val().toLowerCase())+')$')))
            {
                item.suggestions().onSelect($(this).suggestions().suggestions[0]);
            }
        });

        if(!$.isEmptyObject(item.suggestions))
        {
            item.suggestions(options);
            this.dadataEnable = true;
        }

       App.addressShort.updateRegion(item, kladr_id);
    },
    getRegionArr: function(par){
        var $area =         par.find(".js-formal__area"),
            $city =         par.find(".js-formal__city"),
            $settlement =   par.find(".js-formal__settlement"),
            $street =       par.find(".js-formal__street"),
            $house =        par.find(".js-formal__house");

        return [
                {item: $area,       bounds: 'area',        dataId: 'area',        className: ".js-formal__area"},
                {item: $city,       bounds: 'city',        dataId: 'city',        className: ".js-formal__city"},
                {item: $settlement, bounds: 'settlement',  dataId: 'settlement',  className: ".js-formal__settlement"},
                {item: $street,     bounds: 'street',      dataId: 'street',      className: ".js-formal__street"},
                {item: $house,      bounds: 'house-block', dataId: 'house',       className: ".js-formal__house"}
            ];
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
            $city.suggestions().setOptions(obj);
        }
    },


    selectAddressSuggestions: function(suggestion){

        var par = $(this).closest(".js-formal--short"),
            $fullKladr = par.find(".js-formal__fullkladr"),
            arr = App.addressShort.getRegionArr(par);

        var bounds = $(this).suggestions()["bounds"]["from"],
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
            if($.isEmptyObject(tempChild) || $.isEmptyObject(tempChild.item) || (tempChild.item.length == 0))
                return;

            var val = "";
            twoMean = false;
            if(tempChild.bounds.indexOf("-") > 0){
                bounds1 = tempChild.bounds.substr(0, tempChild.bounds.indexOf("-"));
                bounds2 = tempChild.bounds.substr(tempChild.bounds.indexOf("-") + 1, tempChild.bounds.length);
                twoMean = true;
            }

            if (twoMean) {
                tempChild.item.val();
                if (suggestion.data[bounds1] != undefined && suggestion.data[bounds1 + "_type"] != null) {
                    val = App.address.formateFromSuggestion(suggestion.data[bounds1 + "_type"], suggestion.data[bounds1 + "_type_full"], suggestion.data[bounds1]);
                }
                if (suggestion.data[bounds2] != undefined && suggestion.data[bounds2 + "_type"] != null) {
                    if (val.length > 0) val += ", ";
                    val += App.address.formateFromSuggestion(suggestion.data[bounds2 + "_type"], suggestion.data[bounds2 + "_type_full"], suggestion.data[bounds2]);
                }

                tempChild.item.val(val);
            }
            else {
                val = App.address.formateFromSuggestion(suggestion.data[tempChild.dataId + "_type"], suggestion.data[tempChild.dataId + "_type_full"], suggestion.data[tempChild.dataId]);
                tempChild.item.val(val);
            }
        });
        $fullKladr.val('');
        $(this).data("kladrid", "");
        if(!$.isEmptyObject(suggestion.data['street']) && suggestion.data['street'].length > 0)
        {
            $fullKladr.val(suggestion.data.kladr_id);
            $(this).data("kladrid", suggestion.data.kladr_id);
        }
    },
    suggestionsKladrEmpty: function(){
        $(this).data("kladrid", "");
    },

    bindAddressSuggestionsEmpty: function(addressField){
        if($.isEmptyObject(addressField) || $.isEmptyObject(addressField.item) || addressField.item.length == 0)
            return;

        addressField.item.on("change", App.addressShort.suggestionsMadeEmpty);
        addressField.item.on("keyup", App.addressShort.suggestionsKladrEmpty);
    },

    suggestionsMadeEmpty: function(){
        var par = $(this).closest(".js-formal--short"),
            $fullKladrId = par.find(".js-formal__fullkladr");

        $fullKladrId.val('');

        if(!$.isEmptyObject($(this).data("kladrid"))){
            return;
        }

        var arr = App.addressShort.getRegionArr(par);
        $.each(arr, function(key, tempChild){
            if($.isEmptyObject(tempChild) || $.isEmptyObject(tempChild.item) || (tempChild.item.length == 0))
                return;
            tempChild.item.val('');
        });

        par.find(".js-formal__city").val($(this).val());
    },

    updateAddressSuggestion:function(){
        var par = $(this).closest(".js-formal--short"),
            $fullKladrId = par.find(".js-formal__fullkladr"),
            arr = App.addressShort.getRegionArr(par),
            addressField = par.find('.js-formal__fulladdress'),
            region = par.find('.js-formal__region'),
            kladrid = region.val().length > 0 ? regionId2KladrCode[region.val()] : undefined;

        $fullKladrId.val('');

        $.each(arr, function(key, value){
            if(!$.isEmptyObject(value.item))
                value.item.val('');
        });
        App.addressShort.updateRegion(addressField, kladrid);
        addressField.val("");
    },
    bindEvent: function() {
        var $wrapper = $(".js-formal--short");
        if($wrapper.length > 0){
            $wrapper.each(function(){
                var $region = $(this).find(".js-formal__region"),
                    $addressField = $(this).find(".js-formal__fulladdress"),
                    $fullkladr = $(this).find(".js-formal__fullkladr"),

                    $addressFieldArr = {
                        item: $addressField, bounds: 'area-city-settlement-street-house-block'
                    };

                if($region.find("option").length > 0){

                    App.addressShort.bindAddressSuggestions($addressFieldArr, $region, $fullkladr);
                    if(App.addressShort.dadataEnable){
                        $('.js-address__fields--toggle').toggle().removeClass("js-address__fields--toggle");

                        $region.on('change', App.addressShort.updateAddressSuggestion);
                        App.addressShort.bindAddressSuggestionsEmpty($addressFieldArr, $region, $fullkladr);
                        $fullkladr.data("regionid", $region.val());
                    }
                }
            });
        }
    }
};