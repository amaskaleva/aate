App.docs= {
    typeClass: "js-requestdocs__type",
    themeClass:"js-requestdocs__theme",
    fieldsClass:"js-requestdocs__fields",
    requestData: null,

    bindEvent: function(){
        if(typeof request_theme != "undefined"  && !$.isEmptyObject(request_theme)) {
            App.docs.requestData = request_theme;
            $(".js-requestdocs__type:first").on("change", App.docs.typeSelectFnc);
        }
        if($.browser.msie || $.browser.version < 9){
            $(".js-fileupload__input").on("click", this.uploadFileMSIEEvent);
        }
        else
            $(".js-fileupload__input").on("change", this.uploadFileEvent);

    },
    uploadFileEvent: function(){
        App.docs.uploadFile($(this));
    },
    uploadFileMSIEEvent: function(){
        setTimeout(function()
        {
            if($(".js-fileupload__input").val().length > 0) {
                App.docs.uploadFile($(".js-fileupload__input"));
            }
        }, 0);

    },
    uploadFile: function(input){
        var $parent = input.closest(".js-fileupload__wrapper"),
            $label = $parent.find(".js-fileupload__label"),
            name = input.val();
        if(name.length == 0)
        {
            name = $label.attr("placeholder");
        }
        else
            name = name.replace(/^.*(\\|\/)(.*?)$/, "$2");//substring(name.lastIndexOf('/'), name.length);
        $label.text(name);
    },
    typeSelectFnc: function(){
        var $selection = $("."+App.docs.typeClass + " option:selected"),
            themeIndex = $selection.data().theme || '',
            html = '',
            $wrapper = $("." + App.docs.themeClass + "__wrapper"),
            $wrapperField = $("." + App.docs.fieldsClass + "__wrapper");

        $wrapperField.empty();
        $wrapperField.hide();

        if(!$.isEmptyObject(themeIndex)){
            var themeData = App.docs.requestData[themeIndex] || '';
            if(!$.isEmptyObject(themeData)){
                html = $("#requestDocsThemeTemplate").tmpl({themeData: themeData});
                if($wrapper.find("select").length > 0)
                {
                    $wrapper.find("select").off("change");
                    $wrapper.find("select").selectmenu("destroy");
                }

                $wrapper.html(html);
                $wrapper.find("select").selectmenu();
                $wrapper.slideDown("fast");
                $wrapper.find("select").on("change", App.docs.themeSelectFnc);
                return;
            }
        }
        $wrapper.empty();
        $wrapper.hide();
    },
    themeSelectFnc: function(){
        var $selectionTheme = $("."+App.docs.themeClass + " option:selected"),
            themeIndex = $selectionTheme.data().fields || '',
            html = '',
            $wrapper = $("." + App.docs.fieldsClass + "__wrapper");

        if($wrapper.find(".hasDatepicker").length > 0){
            $wrapper.find(".hasDatepicker").each(function(){$(this).datepicker("destroy");})
        }
        $wrapper.empty();
        $wrapper.hide();

        if(!$.isEmptyObject(themeIndex)){
            var fieldsData = themeIndex;
            if(!$.isEmptyObject(fieldsData)){
                html = $("#requestDocsFieldsTemplate").tmpl({fieldsType: fieldsData});
                $wrapper.html(html);
                $wrapper.slideDown("fast");
                var obj = {dateFormat: "dd.mm.yy"};
                if($wrapper.find(".js-requestdocs__date--from").length>0)
                    $( ".js-requestdocs__date--from" ).datepicker(obj);
                if($wrapper.find(".js-requestdocs__date--to").length>0)
                    $( ".js-requestdocs__date--to" ).datepicker(obj);
            }
        }
    }
};