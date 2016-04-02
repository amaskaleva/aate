App.slider = {
    setRange: function(elem){
        var obj = {};

        var parameters = elem.data("params");

        if (parameters == undefined) parameters = {};

        var min  = parameters.min != undefined  && parameters.min.length > 0 ? App.common.getNumber(parameters.min) : 0,
            max  = parameters.max != undefined && parameters.max.length > 0  ? App.common.getNumber(parameters.max) : min,
            amin = parameters.amin != undefined && parameters.amin.length > 0  ? App.common.getNumber(parameters.amin) : min,
            amax = parameters.amax != undefined && parameters.amax.length > 0  ? App.common.getNumber(parameters.amax) : max,
            cmin,
            cmax,
            step = 0,
            decimalPoints = 0;

        var facetcode  = parameters.facetcode,
            rangeTitle = parameters.rangeTitle,
            rangeMin = parameters.rangeMin,
            rangeMax = parameters.rangeMax,
            grid = parameters.grid;

        var sliderWrapper = elem.closest('.js-range__wrapper');

        if (sliderWrapper.length == 0)
            sliderWrapper = elem.parent();

                    //debugger;
        if (isNaN(min) || min<0) min = 0;
        if (isNaN(max) || max<0) max = min;

        /*min = Math.floor(min);
        max = Math.ceil(max);*/

        step = parameters.step != undefined && parameters.step.length > 0 ? App.common.getNumber(parameters.step) : Math.abs(min - max )/10;
        decimalPoints = parameters.decimalPoints != undefined && parameters.decimalPoints.length > 0 ? Number(parameters.decimalPoints) :
            (step< 1 ? 1 : 0);

        var param = {
            step: step,
            range: false
        };

        if (isNaN(amin) || amin<0) amin = 0;
        if (isNaN(amax) || amax<0 ) amax = min;


        if(amin>amax){
            var t = amin;
            amin=amax;
            amax=t;
        }
        if (amin < min ) amin = min;
        if (amax > max ) amax = max;

        cmin = parameters.cmin != undefined && parameters.cmin.length > 0  ? Number(parameters.cmin.replace(/\s/g,'').replace(",",'.')) : amin;
        cmax = parameters.cmax != undefined && parameters.cmax.length > 0  ? Number(parameters.cmax.replace(/\s/g,'').replace(",",'.')) : amax;

        if (cmin < min ) cmin = min;
        if (cmax > max ) cmax = max;

        param['range'] = true;
        param['facetcode'] = facetcode;
        param['min'] =   min;
        param['max'] =   max;
        param['aMin'] = amin;
        param['aMax'] = amax;

/*        param['amin'] = amin;
        param['amax'] = amax;*/
        //debugger;
        param['values'] = [cmin,  cmax];

        /*
         if(rangeMin)
         sliderWrapper.find(rangeMin).val(amin);
         if(rangeMax)
         sliderWrapper.find(rangeMax).val(amax);
         */

        param['slide'] = param['update']=function( event, ui ) {

            if(rangeTitle) {
                sliderWrapper.find(rangeTitle).html(App.common.setNumber(ui.values[0], decimalPoints)+' - ' + App.common.setNumber(ui.values[1], decimalPoints));
                sliderWrapper.find(rangeTitle).val(App.common.setNumber(ui.values[0], decimalPoints)+' - ' + App.common.setNumber(ui.values[1], decimalPoints));
            }

            if(rangeMin) {
                sliderWrapper.find(rangeMin).html(App.common.setNumber(ui.values[0], decimalPoints));
                sliderWrapper.find(rangeMin).val(App.common.setNumber(ui.values[0], decimalPoints));
            }

            if(rangeMax) {
                sliderWrapper.find(rangeMax).html(App.common.setNumber(ui.values[1], decimalPoints));
                sliderWrapper.find(rangeMax).val(App.common.setNumber(ui.values[1], decimalPoints));
            }
        };

        param['stop'] = function(){
            App.search.searchFacetFormDisableField();
            // sliderWrapper.closest("form").submit();
            /*if(rangeMin) {
                sliderWrapper.closest("form").submit();//find(rangeMin).change();
                return;
            }

            if(rangeMax) {
                sliderWrapper.find(rangeMax).change();
            }*/
        };


        if(rangeTitle=='auto'){
            if(elem.parent().find('.b-range__title').length == 0)
                elem.parent().append('<span class="b-range__title js-range__title">' + App.common.setNumber(min, decimalPoints) + ' - ' + App.common.setNumber(max, decimalPoints) + '</span>');
            rangeTitle='.js-range__title';
        }

        if(grid=='auto'){
            if(elem.parent().find('.b-range__title').length == 0)
                elem.parent().prepend('<span class="b-range__title b-range__title--top"><span class="b-range__title--top__item"> ' + App.common.setNumber(min, decimalPoints) + '</span><span class="b-range__title--top__item"> ' + App.common.setNumber(max, decimalPoints) + '</span></span>')
        }

        param['change'] = function(event, ui){
            if(!App.common.isACC)
                return;

        };
        obj["param"] = param;
        obj["rangeMin"] = sliderWrapper.find(rangeMin);
        obj["rangeMax"] = sliderWrapper.find(rangeMax);
        obj["decimalPoints"] = decimalPoints;

        return obj;
    },

    setAccessRange: function(elem, min,  max){
        elem.slider("option", "aMin", min);
        elem.slider("option", "aMax", max);
        elem.slider("option", "refresh", 0);
    },

    setNullRange: function(elem){
        elem.slider("option", "aMin", null);
        elem.slider("option", "aMax", null);

        elem.slider("option", "values",[elem.slider("option", "min"), elem.slider("option", "max")]);
        elem.slider("option", "refresh", 0);
    },

    setSingle: function(elem){
        var obj={};

        var parameters = elem.data('params');
        if (parameters == undefined) parameters = {};

        var min  = parameters.min != undefined? Number(parameters.min) : 0,
            max  = parameters.max != undefined ? Number(parameters.max) : min,
            step = parameters.step != undefined ? Number(parameters.step) : 1;

        var param = {step: step, range: false};

        if(isNaN(max) || max<0) min = 0;
        if(isNaN(min) || min<0) max = min;

        param['min'] = min;
        param['max'] = max;

        obj["param"] = param;

        return obj;
    },

    setRangeElement: function(){
        var obj = {};

        if($(this).hasClass('js-range--double'))
            obj = App.slider.setRange($(this));
        else obj = App.slider.setSingle($(this));

        var elem = $(this);

        elem.slider(obj['param']);

        if(elem.hasClass('js-range--double')){
            obj['rangeMin'].on('change',function(){
                var val = $.trim($(this).val()).replace(',', '.').replace(/\s/g, ''),//App.common.getNumber($(this).val()),
                    val1 = obj['rangeMax'] != undefined ? ((obj['rangeMax'].val()).replace(',', '.').replace(/\s/g, '')) : '',
                    valMin=elem.slider("option", "aMin"),
                    valMax=elem.slider("option", "aMax");

                if(isNaN(Number(val)) && val.length > 0)
                {
                    obj['rangeMin'].val('');
                    return false;
                }
                val = Number(val);
                var val0 = val <= valMax && val >= valMin ? val :
                    (val > valMax ? valMax : valMin);
                if(val1.length > 0){
                    if(val1 < val0)
                    {
                        val = val1;
                        val1 = val0;
                        val0 = val;
                    }
                }

                elem.slider('values', 0, val0);
                obj['rangeMin'].val(App.common.setNumber(val0, obj['decimalPoints']));
                if(val1.length > 0)
                {
                    obj['rangeMax'].val(App.common.setNumber(val1, obj['decimalPoints']));
                    elem.slider('values', 1, val1);
                }
                App.search.searchFacetFormDisableField();
            });

            /*elem.find('.ui-slider-handle').on('mouseup', function(){
                elem.closest('.js-range__wrapper').find('input').change();
            });*/

            obj['rangeMax'].on('change',function(){
                var val = $.trim($(this).val()).replace(',', '.').replace(/\s/g, ''),//App.common.getNumber($(this).val()),
                    val1 = obj['rangeMin'] != undefined ? obj['rangeMin'].val().replace(',', '.').replace(/\s/g, '') : '',
                    valMin=elem.slider("option", "aMin"),
                    valMax=elem.slider("option", "aMax");

                if(isNaN(Number(val)) && val.length > 0)
                {
                    obj['rangeMax'].val('');
                    return false;
                }
                val = Number(val);
                var val0 = val <= valMax && val >= valMin ? val :
                    (val > valMax ? valMax : valMin);

                if(val1.length > 0){
                    if(val1 > val0)
                    {
                        val = val1;
                        val1 = val0;
                        val0 = val;
                    }
                }

                elem.slider('values', 1, val0);
                obj['rangeMax'].val(App.common.setNumber(val0, obj['decimalPoints']));

                if(val1.length > 0) {
                    {
                        elem.slider('values', 0, val1);
                        obj['rangeMin'].val(App.common.setNumber(val1, obj['decimalPoints']));
                    }
                }
                App.search.searchFacetFormDisableField();
            })
        }
        elem.append('<span class="b-range__devide"></span>');
    }
};
