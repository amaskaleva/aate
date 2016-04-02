App.gallery = {
    // Video Init
    videoInit: function(videoPath, thumbPath, videocontainer, otherOptions){
        var params;
        if(!(!!window.HTMLCanvasElement)){
            var m = function(){
                var flashvars = (otherOptions != undefined) ? otherOptions : {},
                    id = videocontainer.data().id;
                flashvars.m = "video";
                flashvars.uid = id + "_child";
                flashvars.file = videoPath;
                flashvars.poster = thumbPath;

                params = {
                    id:"myplayer",
                    allowFullScreen:"true",
                    allowScriptAccess:"always"
                };
                videocontainer.html("<div id='"+ id +"_child'></div>");
                this.player = new swfobject.embedSWF(
                    "/_ui/desktop/theme-komus/swf/uppod.swf",
                    id + "_child",
                    parseInt(videocontainer.width()),
                    parseInt(videocontainer.height()),
                    "9",
                    false,
                    flashvars,
                    params
                );
                if(typeof uppod_players == "undefined")
                    uppod_players = [];
                uppod_players.push(flashvars);
            };
            App.common.loadSWF(m);
        }
        else{
            var id = videocontainer.data().id;
            if(videocontainer.attr("id") == undefined)
                videocontainer.attr("id", id);
            else id = videocontainer.attr("id");
            params = (otherOptions != undefined) ? otherOptions : {};
            params.m = "video";
            params.uid = id;
            params.file = videoPath;
            params.poster = thumbPath;

            this.player = new Uppod(params);
        }
    },

    initImageZoom: function(elm){

        if($(elm).length == 0)
            return;
        $(elm).elevateZoom({
            gallery:'imagesList',
            cursor: 'pointer',
            galleryActiveClass: 'active',
            imageCrossfade: true,
            parentName: '.' + $(elm).parent().attr('class')
        });
    },
    // Initialize gallery on element
    initGallery: function(elm, elmLink){
        var zoom = $(elm).data("zoom");
        if(zoom == true)
            this.initImageZoom(elm);

        if($(elmLink).length){
            $('.js-productGalleryImage').on('click', function(){
                $(elmLink).attr("href", ($(elmLink).data() || {}).href + "?galleryPosition="+encodeURIComponent(($(this).data() || {}).index));

            });
        }
    },

    // Simple roller
    simpleGalleryInit: function(){
        $('.js-simple-gallery').each(App.gallery.makeSimpleGallery);
    },

    verticalGalleryInit: function(){
        $('.js-vertical-gallery').each(App.gallery.makeVerticalGallery)
    },

    makeVerticalGallery:function(){
        var video = $(this).find('.js-gallery__video');
        var items = $(this).find('.js-gallery__items');
        if(video.outerHeight() == 0){
            video.css("height", items.css("height"));
        }

        if(items.outerHeight() < 320){
            items.css("overflow", "auto");
        }
        else items.css("overflow", "hidden");

        items.height('320px');
    },
    // Initialize simple gallery
    makeSimpleGallery: function(){
        var
            back =    '<div class="js-gallery__back b-gallery__button b-gallery__button--back disable"><div></div></div>',
            next =    '<div class="js-gallery__next b-gallery__button b-gallery__button--next"><div></div></div>',
            body =    '<div class="js-gallery__content b-gallery__content b-gallery__button--content"></div>',
            bodyPar = '<div class="js-gallery__content--wrapper b-gallery__contentWrapper b-gallery__button--contentWrapper"></div>',
            gallery = $(this);

        if(gallery.find('.js-gallery__item').length == 0)
            return;
        gallery
            .append(back)
            .append(next)
            .append(bodyPar)
            .append(body)
            .addClass('b-gallery--simple')
            .css('display','block');

        body = gallery.find('.js-gallery__content');
        next = gallery.find('.js-gallery__back');
        back = gallery.find('.js-gallery__next');

        bodyPar=gallery.find('.js-gallery__content--wrapper');
        bodyPar.append(body);


        var h = 0;

        gallery.find('.js-gallery__item').css({
            float: 'left'
        });
        gallery.find('.js-gallery__item').each(function(){
            body.append($(this));
        });
        gallery.find('.js-gallery__item').slice(0,5).each(function(){
            var currentHeight = $(this).outerHeight()+parseInt($(this).css('marginTop'))+parseInt($(this).css('marginBottom'))+parseInt($(this).css('paddingTop')) + 2;
            h = currentHeight < h ? h : currentHeight;
        });

        h++;
        gallery.css('height',h + 'px');
        body.addClass('i-text-nowrap');

        App.gallery.simpleGalleryInitCalculate(gallery);
    },
    simpleGalleryInitCalculate: function(gallery){
        var next = gallery.find('.js-gallery__back'),
            back = gallery.find('.js-gallery__next'),
            body =    gallery.find(".js-gallery__content"),
            bodyPar = gallery.find(".js-gallery__content--wrapper");

        var x = [];

        x[0] = 0;

        gallery.find('.js-gallery__item').css({
            float: 'left'
        });

        gallery.find('.js-gallery__item').each(function(){
            x.push(x[x.length-1] + $(this).outerWidth() + parseInt($(this).css('margin-right')));
        });

        x[x.length - 1] = x[x.length - 1] + parseInt(gallery.find('.js-gallery__item:last-child').css('margin-right'));
        body.css('width', x[x.length - 1] + 1 + 'px');

        var curX = body.data().index || 0,
            maxWidth = bodyPar.outerWidth();

        if(bodyPar.parent().width() == 0 && /%/.test(bodyPar.css("width"))){
            maxWidth = 0;
        }

        // Click on previous image
        next.off('click');
        back.off('click');

        if((x[x.length-1] - x[curX] - maxWidth < x[x.length-1] - x[x.length-3]))
            back.addClass("getmore");

        if(gallery.find(".js-gallery__item.active").length > 0 &&  (body.data() || {}).index == undefined){
            curX = gallery.find(".js-gallery__item.active").index();
            body.addClass("moving");
            var left = -x[curX];
            if(x[x.length-1] + left < maxWidth)
            {
                left = -(x[x.length-1]-maxWidth);
                while(x[curX] > -left)
                    curX--;
            }

            body.animate({left: left}, 400, function(){
                body.removeClass("moving");
                if(!(x[x.length-1] - x[curX] - maxWidth < x[x.length-1] - x[x.length-3]))
                    back.removeClass("getmore");
            });
        }

        next.on('click', function(){
            if(curX-1 < 0){
                next.addClass('disable');
                return;
            }
            back.removeClass('disable');

            curX--;
            var left = -x[curX];

            if(left > 0)
                return;

            body.data("index", curX);
            body.addClass("moving");
            body.stop().dequeue().animate({left: left},400, function(){
                body.removeClass("moving");
                if(!(x[x.length-1] - x[curX] - maxWidth < x[x.length-1] - x[x.length-3]))
                    back.removeClass("getmore");
            });
        });

        back.on('click', function(){
            if(curX >= x.length-1){
                back.addClass('disable');
                return;
            }

            var left = parseInt(body.css('left'));

            if(parseInt(x[x.length-1]) + left + 1 <= maxWidth){
                back.addClass('disable');
                return;
            }

            next.removeClass('disable');

            if(left < -x[curX])
            {
                back.addClass('disable');
                return;
            }
            if(maxWidth == 0){
                maxWidth = bodyPar.outerWidth();
            }
            if(x[x.length-1] - x[curX] < maxWidth + 5)
            {
                back.addClass('disable');
                return;
            }

            curX++;
            left = -x[curX];

            if(x[x.length-1] + left < maxWidth)
                left = -(x[x.length-1]-maxWidth);

            body.data("index", curX);
            body.addClass("moving");
            body.stop().dequeue().animate({left: left},400, function(){
                body.removeClass("moving");
                if(x[x.length-1] - x[curX] - maxWidth - 10 < x[x.length-1] - x[x.length-3])
                    back.addClass("getmore");
                else {
                    back.removeClass("getmore");
                }
            })
        })
    },

    bindVideoGalleryClickEvent: function(e){
        e.preventDefault();

        // Get links to video and thumb
        var options = ($(this).data() || {}).options,
            thumbLink = (options || {}).thumbLink,
            videoLink = options.videoLink,
            videoContainerID = ($(this).data()|| {}).videoid ;

        //if(options.thumbLink != undefined)
        //    delete options.thumbLink;
//
        //if(options.videoLink != undefined)
        //    delete options.videoLink;

        var $videoContainer = $(".js-videogallery__view").filter("[data-id='"+ videoContainerID +"']"),
            imgContainerID = $videoContainer.length > 0 ? ($videoContainer.data() || {}).imgid : null,
            $imgContainer = imgContainerID != null ? $(".js-imggallery__view").filter("[data-id='"+ imgContainerID +"']") : [];

        if($videoContainer.length == 0)
            return false;

        if($imgContainer.length > 0 && $imgContainer.filter(":visible").length > 0)
        {
            var w = $imgContainer.width(),
                h = $imgContainer.height();

            $imgContainer.hide();
            if (w > 0 && $videoContainer.width() == 0)
                $videoContainer.width(w);
            if (h > 0 && $videoContainer.height() == 0)
                $videoContainer.height(h);

            if($videoContainer.filter(":visible").length == 0)
                $videoContainer.fadeIn(200);
        }

        App.gallery.videoInit(videoLink, thumbLink, $videoContainer, options);
    },

    bindImgGalleryClickEvent: function(e) {
        var imgContainerID = $(this).data('imgid') || {},
            $imgContainer = $(".js-imggallery__view").filter("[data-id='" + imgContainerID + "']"),
            videoContainerID = $imgContainer.length > 0 ? ($imgContainer.data('videoid') || {}) : null,
            $videoContainer = videoContainerID != null ? $(".js-videogallery__view").filter("[data-id='" + videoContainerID + "']") : [];

        if ($videoContainer.length && $videoContainer.filter(":visible").length) {
            if (typeof uppod_players != "undefined") {
                if (!(!!window.HTMLCanvasElement)) {
                    $.each(uppod_players || [], function (index, elm) {
                        swfobject.removeSWF(elm.uid);
                    });
                    uppod_players = [];
                }
                else
                    $.each(uppod_players || [], function (index, elm) {
                        elm.Stop();
                    });
            }
            $videoContainer.hide();
            $imgContainer.fadeIn(200);
        }
        else
            if($imgContainer.filter(":visible").length == 0)
                $imgContainer.show();
    },
    bindEvent: function(){
        // Init Galleries
        this.simpleGalleryInit();
        this.verticalGalleryInit();

        $('.js-videogallery__item').on('click', App.gallery.bindVideoGalleryClickEvent);
        $('.js-imggallery__item').on('click', App.gallery.bindImgGalleryClickEvent);

        this.initGallery('#imageGallery', ".productImagePrimaryLink");
    }
};

