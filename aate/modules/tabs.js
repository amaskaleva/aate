/**
 * Tabs
 *
 * .js-tabs - tabs container
 * .js-tab - tab
 * .js-tabContent - tab content
 * .b-tabs__tab--active - class for active tab
 * .b-tabs__content--active
 */
App.tabs = {
    tabs: function(parent, callback) {
        $((parent!=undefined ? parent : "") +  ' .js-tab').on('click', function(e){
            if(callback != undefined)
                callback.apply($(this));

            var targetTab = $(this).data(targetTab);

            if (!targetTab.targettab)
                return false;

            if($(this).attr("href")!=undefined)
                App.common.changeUrl($(this).attr("href"));
            //else App.common.changeHash(targetTab.targettab.replace("#", ""));

            App.tabs.setTab($(this), targetTab.targettab);

            e.stopPropagation();
            return false;
        });
    },
    setTab: function(item, tabCode){
        item
            .addClass('b-tabs__tab--active')
            .siblings('.js-tab').removeClass('b-tabs__tab--active');

        item
            .closest('.js-tabs').children('.js-tabContent').hide();

        $(tabCode).show();
    },
    selectCurrentTab: function(){
        var tabCode = window.location.hash;
        if(tabCode.length > 1 && $(tabCode).length > 0)
        {
            var tab = $('.js-tab[data-targettab='+tabCode+']');
            App.tabs.setTab(tab, tabCode);
        }
    },
    makeTabsActive: function(e){
        var targetTab = $(this).data(targetTab);

        if (!targetTab.targettab)
            return false;

        var targettab = targetTab.targettab;
        $(targettab)
            .addClass('b-tabs__tab--active')
            .siblings('.js-tab').removeClass('b-tabs__tab--active');

        $(targettab)
            .closest('.js-tabs').children('.js-tabContent').hide();

        $(targettab).show();
        e.stopPropagation();
    },
    bindEvent: function(){
        if($('.js-tab').length && !App.common.isIE()){
            App.tabs.tabs();
            App.tabs.selectCurrentTab();
            $('.js-makeTabActive').on('click', function(){
                $($(this).data().targettab).click();
                return false;
            })
        }
    }
};