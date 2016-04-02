App.common = {
    //add element '...' near the title that should be cutted in the end
    hideTitle: function(parent){
        parent = typeof parent == "undefined" ?"" : parent+' ';
        $(parent + '.js-listTitle').each(function(){
            $(this).on('click', function(){
                var $th = $(this).siblings('.js-listHide'),
                    $nh = $(this);
                $th.slideToggle('fast', function(){
                    $nh.removeClass('hide');

                    if($(this).css('display')=='none')
                        $nh.addClass('hide');
                });
            })
        });

        $(parent +'.js-listTitleDown').each(function(){
            $(this).on('click', function(){
                var $tl, $nm;
                $tl = $(this).siblings('.js-listHideDown');
                $nm = $(this);

                if($nm.hasClass('hide') || $tl.css('display')=='none'){
                    if($nm.hasClass('js-listTitleDown--hide'))
                        $nm.hide();
                    $tl.slideDown(0, function(){
                        if($nm.hasClass('js-listTitleDown--hide'))
                            $nm.each(App.common.removeChild);
                        else $nm.removeClass('hide');
                        $tl.css("display", "inline" );
                    })
                }
                else $tl.slideUp(0, function(){
                    if($(this).css('display')=='none')
                        $nm.addClass('hide');
                });
            })
        });
    },

    //hide window with specific className (window1) if someone clicks somewhere except window1
    hideWindowByClick: function(className){
        $(document).on('mousedown', function(e) {

            var fClass = false;
            $(className).each(function(){
                if($(this).css('display') != 'none')
                    fClass = true;
            });

            if( ($(className).length==0) || !fClass)
                return;

            if( $(e.target).closest(className).length || $(e.target).hasClass(className) )
                return;

            $(className).hide();
            e.stopPropagation();
        });
    },
    popupWindow: function(){
            var $this=$(this),
                $child=$(this).find(".js-productinfo--popup"),
                $gallery=$(this).closest(".js-gallery__content"),
                fncOpen;
            //$child.parent().find("img").attr("title","");

            if($child.find('.js-productinfo--title').length > 0){
                $child.find('.js-productinfo--title').hide();
                $child.find('.js-productinfo--title').width($child.width());
                $child.find('.js-productinfo--title').show();
            }
        $child.css({
            position:"fixed",
            "top" : "-1000px",
            "display": "block",
            "bottom": "auto"
        });

        if($child.hasClass("totop")){

            var w = App.common.getWidthByChildren($child.children());

            if(w < $child.width() && w > 0)
            {
                w += Math.max($child.children().outerWidth() - $child.children().width(), 0);
                $child.children().css("minWidth", w + "px");
                $child.children().css("maxWidth", w + 5 + "px");
            }
            if(w == 0)
                $child.addClass("unscaled");

            fncOpen = function(){
                if($gallery.hasClass("moving"))
                    return;

                var pos = $this.offset(),
                    tempPosition = {
                        top : pos.top - $child.outerHeight()- $this.outerHeight() + "px",
                        left: parseInt(pos.left) + "px",
                        position: "absolute",
                        bottom: "auto",
                        right: "auto",
                        display: "block",
                        paddingLeft: 0
                    };

                $child.removeClass("left");
                $child.removeClass("right");

                if(parseInt(tempPosition.left) + $child.outerWidth() > $(document).width())
                {
                    tempPosition.left = parseInt(pos.left - $child.outerWidth()) + "px";
                    $child.addClass("right");
                }
                else
                {
                    $child.addClass("left");
                }
                $child.css(tempPosition);

                $('.b-content:first').append($child);
                $child.fadeIn('fast');


                if ($child.hasClass("unscaled")) {
                    var w = App.common.getWidthByChildren($child.children());

                    if(w < $child.width() && w > 0)
                    {
                        w += Math.max($child.children().outerWidth() - $child.children().width(), 0);
                        $child.children().css("minWidth", w + "px");
                        $child.children().css("maxWidth", w + 5 + "px");
                    }
                }
            }
        }
        else
            fncOpen = function(){
                if($gallery.hasClass("moving"))
                    return;

                var pos = $this.offset(),
                    tempPosition = {
                        top : pos.top + (($this.outerHeight() - $child.outerHeight()) >> 1) - 30 + "px",
                        position: "absolute",
                        bottom: "auto"
                    };

                $child.css(tempPosition);
                var left = parseInt(pos.left + $this.width());
                $child.css("left", left + "px").removeClass("right");

                if(left + $child.outerWidth() < $(document).width())
                {
                    $child.css("left", left + "px");
                }
                else
                {
                    $child.css("left", parseInt(pos.left - $child.outerWidth()) + "px");
                    $child.addClass("right");
                }

                $('.b-content:first').append($child);
                $child.fadeIn('fast');
            };

            var tm = null,
                openFnc = function(){
                    if(tm!= null)
                        tm = null;

                    tm = setTimeout(fncOpen, 500);
                },
                closeFnc = function(){
                    $child.hide();
                    if(tm!= null)
                        clearTimeout(tm);
                    tm = null;
                };
            $this.on("mouseenter", openFnc);
            $this.mouseleave(closeFnc);
    },
    //removew some symbols from form values
    formFilter: function(form){
        var arr = form.find('input[type=text], input[type=tel]');

        $.each(arr, function(key, value){
            if($(value).hasClass('js-validate--phone') || $(value).hasClass('js-validate--phone--simple'))
            {
                $(value).val($(value).val().replace(/[^0-9]/g,''));
            }
        })
    },

    //hide window with specific className (window1) if someone clicks somewhere except window1
    hideParentWindowByClick: function(className, parentClassName){
        $(document).on('mousedown', function(e) {

            var fClass = false;
            $(className).each(function(){
                if($(this).css('display') != 'none')
                    fClass = true;
            });

            if( ($(className).length==0) || !fClass)
                return;

            if( $(e.target).closest(className).length || $(e.target).hasClass(className) )
                return;

            $(className).closest(parentClassName).fadeOut('fast');
            e.stopPropagation();
        });
    },

    removeParentWindowByClick: function(className, parentClassName){
        $(document).on('mousedown', function(e) {
            if( $(e.target).closest(className).length || $(e.target).hasClass(className) )
            {
                $(className).closest(parentClassName).remove();
                $('html,body').removeClass('b-underPopup');//.css("overflow", "");
                e.stopPropagation();
            }
        });
    },

    closeBackWindow: function(){
        $(".js-back__remove").remove();
        $('html,body').removeClass('b-underPopup');//.css("overflow", "");
    },

    //like hideWindowByClick but remove elements
    hideWindowByClickFull: function(className){
        $(document).on('click', function(e) {

            if( ($(className).length==0) || ($(className).css('display')=='none') )
                return;
            if( $(e.target).closest(className).length || $(e.target).hasClass(className) )
                return;

            $(className).each(App.common.removeChild);
            e.stopPropagation();
        });
    },
    getWidthByChildren: function(parentItem){
        var w = 0,
            wTemp = 0;
        parentItem.children().each(function(){
            $(this).css("display", "inline");
            wTemp = $(this).children().length ? App.common.getWidthByChildren($(this)) : $(this).outerWidth();
            if (w < wTemp)
            {
                w = wTemp
            }

            $(this).css("display", "");
        });
        return w;
    },

    //hide window after some time. It work, when you write class or id in "data-def" parameters of some elements of page.
    //show by click and hide after mouseOut; stay visible if
    lightHideWindow: function(){
        $('.js-showWindow').each(function() {
            var $this = $(this),
                option = $(this).data().option,
                $child = null,
                openBool = false,
                timer = null,
                timeDelay = 500,
                cutClass = false;

            if (option == undefined)
                option = {};

            if (option.def)
            {
                //if displaying window is not the child of this element
                $child = $(option.def);
            }
            else
            {
                //if displaying window is the child of this element
                $child = $(this).find(".js-showWindow--child");
            }

            if (option.action == undefined)
                //option.action = "mouseover hover";
                option.action = "mouseenter";

            if (option.cutClass != undefined)
                cutClass = option.cutClass;

            if ($child == null || $child.length == 0 )
                return;

            var closeThisWindow = function(e) {
                    if(openBool) return;
                    $child.fadeOut("fast");
                    $child.find("select").selectmenu("close");
                    $this.removeClass("opened");
                },
                setTimerClose = function(e) {
                    if(e.relatedTarget == null)
                        return;
                    if($this.hasClass("js-showWindow--fixed"))
                        return;
                    if((($this.data() || {}).option || {}).unclose == true)
                        return;

                    openBool = false;

                    //it's nesessary for normal reaction when cursor moving over selectmenu's component
                    clearTimeout(timer);
                    if(timerOpen !=null)
                        clearTimeout(timerOpen);
                    timerOpen = null;
                    timer = setTimeout(closeThisWindow, 100);
                },
                timerOpen = null,
                fn = function(){
                    if(cutClass){
                        var tmp = $child.find(cutClass);
                        var w = App.common.getWidthByChildren(tmp);
                        if(w + 5 < $child.width())
                        {
                            tmp.css("minWidth", w + Math.max(tmp.outerWidth() - tmp.width(), 0) + 5 + "px");
                        }
                        cutClass = false;
                    }
                },
                openThisWindowTimer = function(){
                    $child.show();
                    fn();
                    $this.addClass("opened");
                    timerOpen = null;
                },
                openThisWindow = function(){
                    if($this.hasClass("js-showWindow--fixed"))
                        return;

                    if($child.css("display") == "none")
                    {
                        if(timerOpen == null)
                            timerOpen = setTimeout(openThisWindowTimer, timeDelay);
                    }
                };

            // event of window's display
            $.each([$this, $child], function(key, value){
                value.on("mouseover", function(){
                    if($this.hasClass("js-showWindow--fixed"))
                        return;
                    openBool = true;
                });
                value.on('mouseleave', setTimerClose);
            });
            $child.on("click", function(){
                $(".js-showWindow--child").not($child).hide().closest(".opened").removeClass('opened');
            });

            if(option.action == "mousedown" || option.action == "click"){
                $this.on(option.action, function(e){
                    $(".js-showWindow--child").not($child).hide();
                    if(($(e.target) == $child) || $child.find($(e.target)).length > 0)
                    {}
                    else{
                        if($child.css("display") != 'none' || $this.hasClass("opened")){
                            openBool = false;
                            $this.removeClass("js-showWindow--fixed");
                            closeThisWindow();
                            return;
                        }
                        openThisWindowTimer();
                    }
                });
                $this.off('mouseleave', setTimerClose);
                $child.off('mouseleave', setTimerClose);
            }
            else
                $this.on(option.action, openThisWindow);

        });

        $(document).on('mousedown', function(e) {

            var className = '.js-showWindow';
            var fClass = false;
            $(className).each(function(){
                if($(this).find('.js-showWindow--child').css('display') != 'none')
                    fClass = true;
            });

            if( ($(className).length==0) || !fClass)
                return;

            if( $(e.target).closest(className).length || $(e.target).hasClass(className) )
                return;

            $(className).not('.js-showWindow--fixed').removeClass('opened');
            $(className).not('.js-showWindow--fixed').find(".js-showWindow--child").hide();
            e.stopPropagation();
        });
    },

    //delete space from string and return Number
    getNumber: function(str){
            str = str.replace(/[^\d,.]/g,'');
            str = str.replace(/[,]/g,'.');
            return Number(str);
    },

    getPrice:function(str){
        if(!App.common.isACC())return str;

        return str + ' ' + (ACC.text || {}).currency;
    },

    //add space into string to get formatted number (45 000)
    setNumber: function(str, decimalPoints){
        if(str == undefined)
            return str;

        if(decimalPoints != undefined)
            str = Number(str).toFixed(decimalPoints).replace(/\./, ',');
        else
            str = str.toString();

        return str;
        /*str = str.replace('.',',');

        var secondStr = '',
            idx=str.indexOf(/[.,]/);

        if(idx >= 0){
             secondStr=str.substr(idx, str.length);
             str=str.substr(0, idx-1);
        }

        return (str.replace(/(\d{1,3})(?=((\d{3})*)[.,$])/g, " $1") + secondStr);*/
    },

    //remove element from DOM
    removeChild: function(){
        $(this).off('click');
        $(this).remove();
    },

    //send request to server to get full information about an element. Big image, for example
    showFullImgFunction: function(){
        $(this).off('mouseover', App.common.showFullImgFunction)
            .removeClass("js-img-showfull");

        var $elem = $(this).find("img").length > 0 ? $(this).find("img") : $(this),
            src = $elem.attr('src'),
            elemData = $elem.data() || {},
            $container = $(this);//.find(".img");

        $elem.removeAttr("title");
        //request
        if(elemData.picture != undefined && elemData.picture.length > 0)
        {
            src = elemData.picture;
        }
        if(src.length)
            $container.append('<div class="b-fullimg"><img src="'+src+'" alt="" /></div>');
    },
    showFullImgEvent: function(){
        $('.js-img-showfull').on('mouseover', App.common.showFullImgFunction);
    },

    isACC: function(){
        return typeof ACC != "undefined";
    },
    getAnalyticsFnc: function(fncName){
        if(App.googleTagManager != null && App.googleTagManager[fncName] != undefined)
            return App.googleTagManager[fncName];
        return function(){};
    },
    isHistoryApiAvailable: function() {
        return !!(window.history && history.pushState);
    },
    isLocalStorageAvailable: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    /*5mb*/
    saveDataToBrowser: function(name, data){
        if(App.common.isLocalStorageAvailable()){
            localStorage.setItem(name, data);
        }
        else{
            var storage = window.globalStorage[document.domain];
            storage[name] = str;
        }
    },
    getDataFromBrowser: function(name, str){
        var result={};
        if(App.common.isLocalStorageAvailable()){
            result = localStorage.getItem(name);
        }
        else{
        }
        return result;
    },
    clearDataFromBrowser: function(name){
        if(App.common.isLocalStorageAvailable()) {
            if (name != undefined)
                localStorage.removeItem(name);
            else
                localStorage.clear()
        }
        else {
            if (name != undefined)
            {
            }
        }
    },
    changeHash: function(hash){
        if(window.location.hash == hash)
            return;

        if(App.common.isHistoryApiAvailable())
        {
            var url = window.location.href;
            url = url.indexOf('#')>0 ? url.substr(0, url.indexOf('#')) : url;
            url += '#' + hash;
            history.pushState(null, null, url);
        }
        else
        {
            window.location.hash = hash;
        }
    },
    changeUrl: function(url){
        if(App.common.isHistoryApiAvailable() && url!=undefined && url.length > 0)
        {
            history.pushState(null, null, url);
        }
    },

    isIE: function(){
        if(!$.browser.msie)
            return false;
        return (navigator.appVersion.indexOf("MSIE 8.")>=0 || navigator.appVersion.indexOf("MSIE 9.")>=0);
    },
    isIE8: function(){
        if($.browser.msie && $.browser.version <= 8)
            return true;
        return false;
    },
    setError: function(elem, text){
        var id='';
        if(elem.attr("id") != undefined)
            id=" for='"+elem.attr("id")+"' ";
        var label = '<label class="b-text--error i-c-bt message"' + id + '>' + text + '</label>';
        if(elem.attr('type')!="radio")
            elem.addClass('b-text--error');
        if(elem.parent('label'))
            elem.parent().append(label);
        else
            elem.after(label);
    },
    removeAllErrors: function(container){
        if(container == undefined)
            $('.message').each(App.common.removeChild);
        else container.find('.message').each(App.common.removeChild);
        App.common.removeGlobalMessageErrors();
        App.common.hideLoading();
    },
    removeGlobalMessageErrors: function(){
        $('#globalMessages').empty();
    },
    removeSimpleErrors: function(container){
        if(container == undefined)
        {
            $('.message').each(App.common.removeChild);
            $('.b-text--error').removeClass("b-text--error");
        }
        else {
            container.find('.message').each(App.common.removeChild);
            container.find('.b-text--error').removeClass("b-text--error");
        }
    },

    setSuccess: function(elem, text, message){
        var label = '<label class="b-text--success i-c-bt ' + (message!=undefined && message === false ? '' : 'message')+ '">' + text + '</label>';
        elem.addClass('b-text--success');
        if(elem.parent('label'))
            elem.parent().append(label);
        else
            elem.after(label);
    },
    setSuccessBeforeElem: function(elem, text){
        var label = '<p class="b-text--success b-text__message i-mb10 message">' + text + '</p>';
        $(label).insertBefore(elem);
        var m = function(){
            elem.siblings('.b-text--success').remove();
        };
        setTimeout(m, 10000);
    },

    sendForm: function(form, url, successFuntion, errorFunction, dataType){

        if(dataType == undefined) dataType = "text";

        var arr = form.find('input[type=text], input[type=password], input[type=tel], input[type=email], input[type=hidden], textarea, [type=radio]:checked, [type=checkbox]:checked, select');

        var sendType = form.attr("method");
        sendType = (sendType == undefined) ? "POST" : sendType;

        var json = {};

        $.each(arr, function(key, value){
            var field_name = $(value).attr('name');
            if(field_name == undefined)
                return;
            if(field_name.length == 0) return;
            if(/^(_)/.test(field_name)) return;

            field_name = field_name.replace(/^(_)/,'');
            json[field_name] = $(value).val();

            if($(value).hasClass('js-validate--phone') || $(value).hasClass('js-validate--phone--simple'))
            {
                json[field_name] = "+7" + json[field_name].replace(/[^0-9]/g,'');
            }
        });

        if(errorFunction == undefined)
            errorFunction = function(){
                App.common.hideLoading();
                App.common.setGlobalDownloadError();
            };

        App.common.sendAjaxData(json, url, successFuntion, errorFunction, dataType, sendType);
    },

    sendJsonForm: function(form, url, successFuntion, errorFunction){
        App.common.sendForm(form, url, successFuntion, errorFunction, "json")
    },

    setGlobalDownloadError: function(){
        App.common.setGlobalError(ACC.text.errorLoading);
    },
    setGlobalAttention: function(text, className){
        $('#globalMessages').html($('#attentionMessage').tmpl({texts: [text]}).addClass(className) );
    },
    setGlobalError: function(text){
        $('#globalMessages').html($('#errorMessage').tmpl({errors: [text]}) );
    },
    setGlobalSuccess: function(text){
        $('#globalMessages').html($('#successMessage').tmpl({success: [text]}) );
    },

    sendAjaxData: function(json, url, successFuntion, errorFunction, dataType, sendType, completeFunction){
        var options = {
            url: url,
            data: json,
            type: sendType,
            contentType: 'application/x-www-form-urlencoded',
            dataType: dataType
        };

        if(dataType.toLowerCase() == "json"){
            options["data"] = JSON.stringify(json);
            options["contentType"] = 'application/json';
            options["mimeType"] = 'application/json';
        }

        if(successFuntion != undefined && typeof successFuntion == 'function')
            options["success"] = successFuntion;

        if(errorFunction != undefined && typeof errorFunction == 'function')
            options["error"] = errorFunction;

        if(completeFunction != undefined && typeof completeFunction == 'function')
            options["complete"] = completeFunction;

        $.ajax(options);
    },

    getFormAjaxData: function(response, form,  urlRedirect, successFunction){
        if (response.status == 'REDIRECT') {
            window.location.replace(urlRedirect);
        }
        else
            if (response.status == 'FAIL') {
                var i, item;
                for (i = 0; i < response.errorMessageList.length; i++) {
                    item = response.errorMessageList[i];
                    if (item.field == 'global') {
                        $('#globalMessages').html(item.defaultMessage);
                    }
                    else if (item.field == 'globalError') {
                        App.common.setGlobalError(item.defaultMessage);
                    }
                    else if (item.field == 'globalPositive') {
                        App.common.setGlobalSuccess(item.defaultMessage);
                    } else {
                        App.common.setError(form.find('[name=' + item.field + ']'), item.defaultMessage);
                    }
                }
            }
            else if (response.status == "SUCCESS" && successFunction != undefined)
                successFunction();
    },
    generatePassword: function(len){
        len = 14;
        var result = '',
            temp = '',
            numbers  = '0123456789',
            letters  = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
            symbols  = '-_=+@!&%^#$&*',
            nNumb = Math.floor(Math.random() * (len - 3)),
            nLet =  Math.floor(Math.random() * (len - 3 - nNumb)),
            nSymb = len - nNumb - nLet - 3,
            max_position,
            position,
            i;

        nNumb++;
        nLet++;
        nSymb++;

        max_position = numbers.length;

        for( i = nNumb; i >0; --i ) {
            position = Math.floor ( Math.random() * max_position );
            temp +=  numbers.substring(position, position + 1);
        }
        max_position = letters.length;
        for( i = nLet; i >0; --i ) {
            position = Math.floor ( Math.random() * max_position );
            temp += letters.substring(position, position + 1);
        }
        max_position = symbols.length;
        for( i = nSymb; i >0; --i ) {
            position = Math.floor ( Math.random() * max_position );
            temp += symbols.substring(position, position + 1);
        }

        max_position = temp.length;
        for( i = max_position; i >= 0; --i ) {
            position = Math.floor ( Math.random() * i );
            result = result + temp.substring(position, position + 1);
            temp = temp.substring(0, position) + temp.substring(position + 1, temp.length);
        }

        return result;
    },
    //close button
    closeButtonClick: function(closeCallback){
        $('.js-back--close').on('click', function(){
            $(this).closest('.js-back__remove').remove();
            $("html,body").removeClass('b-underPopup');//.css("overflow","");
            App.common.windowWidthUnfixed();
            if(closeCallback != undefined)
                closeCallback();
            return false;
        });
        $('.js-back__window__wrapper').on('click', function(e){
            if($(e.target).closest('.js-back__window').length > 0){
                e.stopPropagation();
                return;
            }
            $(this).closest('.js-back__remove').remove();
            $("html,body").removeClass('b-underPopup');//.css("overflow","");
            App.common.windowWidthUnfixed();
            if(closeCallback != undefined)
                closeCallback();
        });
    },

    //show back__window
    showBackWindowHtml:function(htmlText, closeCallback){
        $('body').append( $('#showBackWindow').tmpl({dataInformation:$('<div/>').append(htmlText).html()}) );
        App.common.showBackWindow(closeCallback);
    },

    showLoadingFormOnly: function(){
        if($(this).hasClass("sendingnow"))
            return false;

        $(this).addClass("sendingnow");
        App.common.showLoading();
    },
    //show loading
    showLoading:function(){
        var opts = {
            lines: 10,
            length: 7,
            width: 5,
            radius: 9,
            scale: 1,
            corners: 1,
            color: '#000',
            opacity: 0.3,
            rotate: 0,
            direction: 1,
            speed: 1.5,
            trail: 57,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '54%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };
        var spinner = new Spinner(opts).spin();
        $('body').append($('#loadingTemplate').tmpl());
        $('.js-loading--icon').append($(spinner.el));
    },
    //hide loading
    hideLoading:function(){
        $(".js-loading").remove();
    },

    backWindowChangePageAmount: function(){

        var pages = $('.js-back__window').find('.js-pagePopup--page'),
            pagesNumber = $('.js-popupPageNumber').find('.js-popupPageNumber--page').first(),
            count = pages.filter('[data-pageid=1]').length,
            pageId = pagesNumber.filter('.active').data().pageid,
            i, len, nowIndex = 1;

        for(i = 0, len = pages.length; i<len; i++){
            if(Math.ceil((i+1)/count) > nowIndex)
                nowIndex++;
            $(pages[i]).attr("data-pageid", nowIndex);
        }

        pages.hide();
        pages.filter('[data-pageid=' + pageId + ']').show();
    },
    addHtmlToBlock: function(parentClassName, html){
        $(parentClassName).hide();
        $(parentClassName).html(html);
        $(parentClassName).slideDown('fast');
        $(parentClassName + ' .js-html--close').on('click', function(){
            $(parentClassName).empty();
            $(parentClassName).hide();
        });
        App.common.windowInitElements(parentClassName);
    },
    windowInitElements: function(className){
        if($(className + ' .js-table--sort').length > 0)
            App.tablesort.bindEvent();
        $(className + ' .js-table--sort').on('click', App.common.backWindowChangePageAmount);

        if($(className + ' .js-validate__form').length > 0)
            $(className + ' .js-validate__form').validate({});

        if($(className + ' .js-select__simple').length > 0)
            $(className + ' .js-select__simple').each(function(){
                App.jQui.selectElement($(this), {appendTo: $(className)});
            });
        if($(className + ' .js-formal').length > 0)
            App.address.bindEvent();

        if($(className + ' .js-validate--phone, ' + className + ' .js-validate--phone--simple').length > 0)
            App.validation.validatePhone(className + ' .js-validate--phone, ' + className + ' .js-validate--phone--simple');
    },
    showBackWindow:function(closeCallback){
        $('.js-back__remove')
            .show()
            .css("display", "");

        var $window = $('.js-back__window');
        var top = (window.innerHeight || document.documentElement.clientHeight)/2 - $window.outerHeight()/2;
        top = top < 0 ? 0 : parseInt(top);
        $window.css('margin-top', parseInt(top) + "px");

        $(window).resize(function(){
            var top = (window.innerHeight || document.documentElement.clientHeight) /2 - $window.outerHeight()/2;
            top = top < 0 ? 0 : top;
            $window.css('margin-top', parseInt(top) + "px");
        });

        if($window.find('.js-popupPageNumber').length > 0){
            var $numbers = $window.find('.js-popupPageNumber');
            $numbers.find('.js-popupPageNumber--page--prev').hide();
            var updatePageNextBack = function(pagesNumber, pageId){
                if($(pagesNumber.filter('[data-pageid=' + (pageId + 1) + ']').not('.js-popupPageNumber--page--next')).length > 0){
                    $numbers.find('.js-popupPageNumber--page--next').show();
                }
                else
                    $numbers.find('.js-popupPageNumber--page--next').hide();

                if($(pagesNumber.filter('[data-pageid=' + (pageId - 1) + ']').not('.js-popupPageNumber--page--prev')).length > 0){
                    $numbers.find('.js-popupPageNumber--page--prev').show();
                }
                else
                    $numbers.find('.js-popupPageNumber--page--prev').hide();
            };

            $numbers.find('.js-popupPageNumber--page').on('click', function(){
                var pagesNumber = $(this).closest('.js-back__window').find('.js-popupPageNumber--page'),
                    pages = $(this).closest('.js-back__window').find('.js-pagePopup--page'),
                    pageId = $(this).data().pageid;

                pages.hide();
                pages.filter('[data-pageid=' + pageId + ']').show();
                pagesNumber.removeClass('active');
                pagesNumber.filter('[data-pageid=' + pageId + ']').addClass('active');
                updatePageNextBack(pagesNumber, pageId);

            });

            $numbers.find('.js-popupPageNumber--page--next').on('click', function(){
                var pagesNumber = $(this).closest('.js-back__window').find('.js-popupPageNumber--page'),
                    pages = $(this).closest('.js-back__window').find('.js-pagePopup--page'),
                    pageId = pagesNumber.filter('.active').data().pageid + 1;

                if(pagesNumber.filter('[data-pageid=' + pageId + ']').length > 0){
                    pages.hide();
                    pages.filter('[data-pageid=' + pageId + ']').show();
                    pagesNumber.removeClass('active');
                    pagesNumber.filter('[data-pageid=' + pageId + ']').addClass('active')
                }
                updatePageNextBack(pagesNumber, pageId);
            });

            $numbers.find('.js-popupPageNumber--page--prev').on('click', function(){
                var pagesNumber = $(this).closest('.js-back__window').find('.js-popupPageNumber--page'),
                    pages = $(this).closest('.js-back__window').find('.js-pagePopup--page'),
                    pageId = pagesNumber.filter('.active').data().pageid - 1;

                if(pagesNumber.filter('[data-pageid=' + pageId+']').length > 0){
                    pages.hide();
                    pages.filter('[data-pageid=' + pageId + ']').show();
                    pagesNumber.removeClass('active');
                    pagesNumber.filter('[data-pageid=' + pageId + ']').addClass('active')
                }
                updatePageNextBack(pagesNumber, pageId);
            })
        }

        if($window.find('.js-print--window__button').length > 0)
            $('.js-print--window__button').on('click',App.common.printWindow);

        App.common.windowInitElements('.js-back__window');

        App.common.closeButtonClick(closeCallback);
        //if($('.js-back__window').outerHeight() > window.innerHeight)
        App.common.windowWidthFixed();
        $(window).on("resize", App.common.windowWidthResize);
            $("html,body").addClass('b-underPopup');//css("overflow","hidden");
        //else

        $('.js-back__window:last-child input[type=text]').focus();
        if($('.js-back__window:last-child input[type=text]').length ==0)
            $('.js-back__window:last-child input').focus();

        //$('.b-pageWrapper').addClass("printSelected");
        //$('.js-back__window:last-child').addClass('printSelection');
    },

    windowWidthFixed: function(){
        /*$(".b-pageWrapper").width($(".b-pageWrapper").width());
        $(".b-header").width($(".b-pageWrapper").width());*/
        $("body, html").css("overflow", "hidden");
        var pdRt = $("body").width();
        $('body, html').css("overflow", "");
        pdRt -= $("body").width();

        $(".b-header").css("paddingRight", pdRt + "px");
        $(".b-pageWrapper").css("paddingRight", pdRt + "px");
    },
    windowWidthResize: function(){
        /*var width = $(".js-back__window__wrapper")[0].clientWidth ;
        $(".b-pageWrapper").width(width);
        $(".b-header").width(width);*/
    },
    windowWidthUnfixed: function(){
        $(window).off("resize", App.common.windowWidthResize);
        $(".b-pageWrapper").css("paddingRight" , "");
        $(".b-header").css("paddingRight" , "");
    },
    printWindow: function(){
        $('body, html').removeClass('b-underPopup')
        ;//.css("overflow", '');
        $('body, html').removeAttr("style");

        var div = $(this).closest('.js-back__window').clone();
        div.find('.js-popupPageNumber').hide();
        div.find('.js-pagePopup--page').css('display', '');
        div.attr('style', '');

        $('.js-back__remove').hide();
        $('.b-pageWrapper').addClass("printSelected");
        $('.printSelected').hide();
        $('.printSelected').append("<div class='printSelection'>"+div.html()+"</div>");
        $('.js-back__remove').hide();

        if($('.printSelected').find("table").length > 0)
        {
            $('.printSelected').find("table").css("marginLeft", '');
        }
        $('.printSelected').find("table").css("maxWidth", '100%');
        $('.printSelected').find(".b-contentTitle").attr("class", 'b-contentTitle i-db i-wb-no');
        $('.printSelected').find(".b-contentTitle").css("float", 'none');
        $('.printSelected').find(".b-contentTitle").css("clear", 'both');
        $('.printSelected').find(".b-contentTitle").css("width", '100%');

        var f = function(){
            $('.printSelected').show();
            var style = $('.b-pageWrapper').attr("style");
            $('.b-pageWrapper').removeAttr("style");


            window.print();
            //$('.b-pageWrapper').addClass("printSelected");
            //$('.js-back__window:last-child').addClass('printSelection');
            $('body, html').addClass('b-underPopup');//.css("overflow", 'hidden');
            $('.b-pageWrapper').attr("style", style);
            App.common.clearPrintWindow();
        };
        if($('.printSelected img').length > 0){
            App.common.showLoading();
            $('.printSelected img').load(function(){
                $('.printSelected img').off("load");
                App.common.hideLoading();
                f();
            })
        }
        else
        f();
    },

printTable: function(){
    $('.js-print--table').each(function(){
            var div = $(this).clone();
            //$('.js-back__remove').hide();
            $('.b-pageWrapper').addClass("printSelected");
            $('.printSelected').append("<div class='printSelection b-contentainer'><div>"+div.html()+"</div></div>");
            $('.printSelection').prepend("<div class='b-contentTitle'>"+$('.b-content .b-contentTitle:first').html()+"</div>");
        });
    window.print();
    App.common.clearPrintWindow();
},

    clearPrintWindow: function(){
        $('.printSelected').removeClass('printSelected');
        $('.printSelection').each(App.common.removeChild);
        $('.js-back__remove').show();
        var top = (window.innerHeight || document.documentElement.clientHeight)/2 - $('.js-back__window').outerHeight()/2;
        top = top < 0 ? 0 : top;
        $('.js-back__window').css('margin-top', top + "px");
        App.common.windowWidthResize();
    },
    getRow: function(elem){
        var cellID = elem.index() + 1,
            start = 0,
            table = elem.closest('table'),
            tdCount = table.find('tr:first td').length,
            trCount = table.find('tr').length,
            tdArr = [];

        for(var i = 0; i < trCount; i++)
        {
            start = i*tdCount + parseInt(cellID) - 1;
            tdArr[tdArr.length] = table.find('td:eq(' + start + ')');
        }
        return tdArr;
    },
    getProductCodes: function(parentName, checked) {
        var checkedLink = "";
        if(checked == true || checked == undefined)
            checkedLink = ":checked";

        var checkboxes = $(parentName + " [type=checkbox]" + checkedLink).not('.js-check--only');

        var result = [];
        $.each( checkboxes, function( i, val ) {
            result[result.length] = $(val).data('productcode');
        });

        return result;
    },

    noSendForm: function(){
        return false;
    },

    getProductCodesWithCount: function(parentName, checked) {
        var checkedLink = "";
        if(checked == true || checked == undefined)
            checkedLink = ":checked";

        var checkboxes = $(parentName + " [type=checkbox]" + checkedLink).not('.js-check--only');

        var result = [];
        $.each( checkboxes, function( i, val ) {
            var quant = val.closest('.js-check__line').find('.js-counter__number').val();
            result[result.length] = {"quantity": quant, "sku": $(val).attr('code')};
        });

        return result;
    },
    loadSWFFlag: 0,
    loadSWFFncArray: [],
    loadSWF: function(callback){
        if(App.common.loadSWFFlag == 2)
        {
            if(callback != undefined)
                callback();
            return true;
        }
        if(App.common.loadSWFFlag == 1 && callback != undefined)
        {
            App.common.loadSWFFncArray.push(callback);
            return false;
        }

        if(App.common.loadSWFFlag == 3)
            return false;

        if(App.common.loadSWFFlag == 0){
            App.common.loadSWFFlag++;

            App.common.loadSWFFncArray.push(callback);
            $.getScript(ACC.config.themeResourcePath + "/js/libs/swfobject.js", function(data, textStatus, jqxhr){
                if(jqxhr.status == 200 || jqxhr.status == 304){
                    {
                        App.common.loadSWFFlag = 2;
                        for(var i=0, len = App.common.loadSWFFncArray.length; i<len; i++){
                            App.common.loadSWFFncArray[i]();
                        }
                    }
                    App.common.loadSWFFncArray=[];
                }
                else
                    App.common.loadSWFFlag = 3;
            })
        };
        return undefined;
    },
    getKey: function(data) {
        for (var prop in data)
            return prop;
        return null;
    },
    formatPrice: function(value){
        if(value == null || value == undefined || isNaN(Number(value)))
            return value;
        value = Number(value).toFixed(2);

        return value.replace(".", ",").replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1 ");
    }
};


