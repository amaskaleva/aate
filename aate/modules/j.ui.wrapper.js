App.jQui = {
    select: function(){
        $('.js-select__simple').not(".asyncload").each(function(){
            App.jQui.selectElement($(this))
        });
        $(".js-select--trigger").on("click", function(){
            if($(this).is(":checked") && $(this).data() != undefined && $(this).data().select && $($(this).data().select).hasClass("asyncload"))
            {
                $($(this).data().select).each(function(){
                    App.jQui.selectElement($(this));
                });
            }
        });
    },
    bindSelectOther: function(){
        $('.js-select__simple.asyncload:visible').each(function(){
            $(this).removeClass("asyncload");
            App.jQui.selectElement($(this))
        });

        var $elements = $('.js-select__simple').not(".asyncload").not(":visible").addClass("invisible");
        if($elements.length){
            var t = setInterval(function(){
                if($elements.filter(":visible").length){
                    var el = $elements.filter(":visible");
                    el.removeClass("invisible");
                    App.jQui.selectElement(el);
                    $elements = $('.js-cart--textarea.invisible');
                }
                if($elements.length == 0){
                    clearTimeout(t);
                    return;
                }
            }, 300);
        }
    },
    selectElement: function(elem, param){
        elem.removeClass('js-select__simple')
            .removeClass('asyncload');

        param = param == undefined ? {} : param;
        if(parseInt(elem.width()) != 0)
            if(parseInt(elem.width()) < 0)
                param['width'] = "100%";
            else
                param['width'] = elem.css('width');

        if(typeof elem.data().parentclass != "undefined")
            param['appendTo'] = elem.data().parentclass;
        if(elem.hasClass("i-w-f"))
            elem.removeClass("i-w-f");

        if(elem.hasClass("customRendering")) {
            param["open"] = App.jQui.checkSelectElementPosition;
            param["differentWidth"] = true;
            elem.addClass("toBottom");
        }
        elem.selectmenu(param);
    },

    checkSelectElementWidth: function(){
        var maxWidth = ($(this).data() || {}).width,
            fWidth = $(this).selectmenu("instance").focusable.outerWidth();

        if(maxWidth == undefined || maxWidth < fWidth)
            return;

        var widget = $(this).selectmenu("menuWidget"),
            width;
        widget.addClass("i-text-nowrap");
        widget.css("width", "auto");

        width = widget.outerWidth();

        if(width > fWidth){
            if(width > maxWidth) {
                $(this).selectmenu("option", "width", maxWidth + "px");
                widget.css("width", maxWidth + "px");
            }
            else {
                $(this).selectmenu("option", "width", width + "px");
                widget.css("width", width + "px");
            }
            $(this).addClass("updatePosition");
        }
        else widget.css("width", fWidth + "px");

        $(this).selectmenu("instance").focusable.css("maxWidth", "100%");
        widget.removeClass("i-text-nowrap");
    },
    checkSelectElementPosition: function(event, ui){
        if($(this).hasClass("customWidth"))
        {
            App.jQui.checkSelectElementWidth.apply($(this));
        }

        if($(this).hasClass("updatePosition")){
            $(this).removeClass("customWidth");
        }

        var top = $(window).scrollTop() + $(window).height(),
            widget = $(this).selectmenu("menuWidget"),
            pos = widget.offset();

        var isChanged = false;
        if(top < pos.top + widget.outerHeight()){
            {
                $(this).selectmenu("option", "position", { my : "left bottom", at: "left top" });
                if($(this).hasClass("toBottom"))
                    isChanged = true;
                $(this).addClass("toTop")
                    .removeClass("toBottom");
            }
        }
        else
        {
            $(this).selectmenu("option", "position", { my : "left top", at: "left bottom" });
            if($(this).hasClass("toTop"))
                isChanged = true;

            $(this).addClass("toBottom")
                .removeClass("toTop");
        }
        if(isChanged || $(this).hasClass("updatePosition")){
            $(this).removeClass("updatePosition");
            $(this).selectmenu("instance")._position();
        }
    },
    //работает с группой checkbox. Убирает галочку с Все, если выбрано что-то, кроме него
    setCheckOnly: function(){
        $('.js-check__wrapper').each(function(){
            $(this).find('.js-check').on('click', function(){
                var par = $(this).closest('.js-check__wrapper');

                if($(this).hasClass('js-check--only'))
                {
                    if(par.find('.js-check--only:checked').length > 0)
                        par.find('.js-check').not('.js-check--only').prop('checked', true);
                    else
                        par.find('.js-check').not('.js-check--only').prop('checked', false);
                }
                else {
                    if(par.find('.js-check:checked').not('.js-check--only').length >=  par.find('.js-check').not('.js-check--only').length)
                        par.find('.js-check--only').prop('checked', true);
                    else
                        par.find('.js-check--only').prop('checked', false);
                }

                par.find('.js-check__line').removeClass('checked');
                par.find('.js-check:checked').closest('.js-check__line').addClass('checked')
            })
        })
    },
    /* from timestamp to mm/dd/yyyy */
    revertDateFromTimeStamp: function(dateTime){
        var realDate = new Date();
        //dateTime = Number(dateTime) - (realDate.getTimezoneOffset() * 60000);
        realDate.setTime(Number(dateTime));// - (realDate.getTimezoneOffset() * 60000));//dateTime);
        realDate = $.datepicker.formatDate("mm/dd/yy", realDate);
        return realDate;
    },
    /* from dd.mm.yyyy to mm/dd/yyyy */
    formateDate: function(date){
        if(date == undefined)
            return '';
        return date.replace(/([0-9]{1,2}).([0-9]{1,2}).([0-9]{4})/,'$2/$1/$3');
    },

    updateDateDependence: function(selectItemClass, getDateClass, selectClass, dateClass, availableDate){
        if($(selectItemClass).length == 0 || $(dateClass).length == 0)
            return;

        $(selectItemClass).on('change', function(){
            if($(this).val().toUpperCase() == "SATURDAY")
            {
                $(dateClass).datepicker("option", {
                    "beforeShowDay": function (d) {
                        if(d.getDay() == 6)
                            return [true];
                        return [false];
                    },
                    onSelect: function(dateText, inst){
                        $(getDateClass).val(dateText);
                    }
                });
                $(dateClass).datepicker('refresh');

                return;
            }
            var option = App.jQui.getOptionForDateDependence(selectClass, dateClass, availableDate);

            $(dateClass).datepicker("option", option);
        });
    },

    getOptionForDateDependence: function(selectClass, dateClass, availableDate){
        var option = {
            beforeShowDay: function (d) {
                var dat = $.datepicker.formatDate("mm/dd/yy", d);
                if (availableDate.indexOf(dat) >= 0) {
                    return [true]
                }
                return [false]
            },
            onSelect: function (dateText, inst) {
                var realDate = Date.parse(dateText + ' UTC');

                $(selectClass + ' option').removeAttr('selected').filter(':contains("' + $.datepicker.formatDate("dd.mm.yy", new Date(dateText)) + '")')
                    .prop('selected', true);

                if($('#' + $("select" + selectClass).attr("id") + "-button").length > 0)
                {
                    $('#' + $("select" + selectClass).attr("id") + "-button .ui-selectmenu-text").text($("select" + selectClass).val());
                    $("select" + selectClass).trigger("change");
                }
                return false;
            },
            defaultDate: App.jQui.formateDate($.trim($(selectClass + ' option:selected').text()))
        };
        return option;
    },

    setDateDependence: function(selectClass, dateClass, availableDate, visible) {
        if($(dateClass).length == 0)
            return;

        $(selectClass).on('change', function () {
            $(dateClass).datepicker("setDate", App.jQui.formateDate($(this).find(':selected').text()));
        });

        var option = App.jQui.getOptionForDateDependence(selectClass, dateClass, availableDate);
        option["prevText"] = '<';
        option["nextText"] = '>';

        if($(dateClass).html().length > 0)
        {
            $(dateClass).datepicker('destroy');
        }
        $(dateClass).datepicker(option);
        $(dateClass).datepicker('refresh');

        if(visible)
            $(dateClass).show();
            else
            $(dateClass).hide();

    },

    setDateDependenceInterval: function(inputStartClass, inputEndClass, dateClass) {
        if($(dateClass).length == 0)
            return;

        $(inputStartClass).on('change', function () {
            $(dateClass).datepicker('refresh');
        });
        $(inputEndClass).on('change', function () {
            $(dateClass).datepicker('refresh');
        });

        $(dateClass).datepicker({
            prevText: '<',
            nextText: '>',
            beforeShowDay: function (d) {
                var dat = $.datepicker.formatDate("dd.mm.yy", d);

                var start = App.jQui.formateDate($(inputStartClass).val());
                start = new Date(start);
                start = start.getTime();

                var end = App.jQui.formateDate($(inputEndClass).val());
                end = new Date(end);
                end = end.getTime();

                if (d.getTime() == start) {
                    return [true, "b-date--interval--point"]
                }

                if (d.getTime() == end) {
                    return [true, "b-date--interval--point"]
                }
                if (d > start && d < end) {
                    return [true, "b-date--interval"]
                }
                return [true]
            },
            onSelect: function (dateText, inst) {
                var selected = new Date(dateText);

                var start = App.jQui.formateDate($(inputStartClass).val());
                start = new Date(start);

                var end = App.jQui.formateDate($(inputEndClass).val());
                end = new Date(end);

                if(Math.abs(selected.getTime()- end.getTime()) > Math.abs(selected.getTime()- start.getTime()) || (selected.getTime() < start.getTime()))
                    $(inputStartClass).val($.datepicker.formatDate("dd.mm.yy", selected));
                else
                    $(inputEndClass).val($.datepicker.formatDate("dd.mm.yy", selected));
            },
            defaultDate: App.jQui.formateDate($(inputStartClass).val())
        });
    },
    addProgressBar: function(parentClass){
        if($.isEmptyObject(parentClass))
            parentClass = "body";

        $(parentClass).append("<div id='progressbar' />");
        $("#progressbar").progressbar({value: false});
    },
    removeProgressBar: function(){
        $("#progressbar").progressbar("destroy");
        $("#progressbar").remove();
    },
    bindEvent: function(){
        this.select();
        this.setCheckOnly();
    }
};