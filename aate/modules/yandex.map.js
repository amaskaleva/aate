//работа с картами
App.ymaps = {
    mapid: 0,

    //добавляет метки на карту
    makeBaloon: function(myMap, option){
        var placemark = new ymaps.Placemark([option.coordX, option.coordY], {

                balloonContent: option.content || '',
                iconContent: ""
            },{
                iconImageHref: ACC.config.contextPath + '/_ui/desktop/theme-komus/images/icons/store/store_icon.png', // картинка иконки
                iconImageSize: [20, 20], // размеры картинки
                iconImageOffset: [-10, -10], // смещение картинки
                // Отключаем кнопку закрытия балуна.
                balloonCloseButton: false,
                // Балун будем открывать и закрывать кликом по иконке метки.
                hideIconOnBalloonOpen: true
            }
        );
        myMap.geoObjects.add(placemark);
    },

    makeMap: function(){
        var mapParams = $(this).data('params');
        mapParams.zoom = isNaN(Number(mapParams.zoom)) ? 12 : mapParams.zoom ;
        if (isNaN(Number(mapParams.coordX)) || isNaN(Number(mapParams.coordY)) || isNaN(Number(mapParams.zoom)))
            return;

        App.ymaps.mapid++;
        $(this).attr('id','map' + App.ymaps.mapid).css({
            'width': mapParams.width,
            'height': mapParams.height
        }).empty();

        var myMap = new ymaps.Map('map' + App.ymaps.mapid, {
            // При инициализации карты обязательно нужно указать
            // её центр и коэффициент масштабирования.
            center: [mapParams.coordX, mapParams.coordY], // Москва
            zoom: mapParams.zoom,
            behaviors: ['default', 'scrollZoom']
        });

        // balloon creating
        $.each(mapParams.shops, function(index, shopParams){
            App.ymaps.makeBaloon(myMap, shopParams);
        });

        myMap.controls.add('mapTools');
        myMap.controls.add('typeSelector');
        myMap.controls.add('zoomControl');
    },

    bindEvent: function(){
        if($('.js-ymap').length>0){
            ymaps.ready(App.ymaps.initMap);
        }
    },

    // Create maps for each map-element
    initMap: function() {
        $('.js-ymap').each(App.ymaps.makeMap);
    }
};

