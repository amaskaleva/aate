App.catalogmenu = {

    bindEvent: function(){
        var $catalogCategories = $('.js-catalogList'),
            catalogCategoriesHeight = $catalogCategories.height() - 4 + 'px';
        $('.js-catalogList .js-catalogCategoriesSubmenu, .js-catalogList .js-catalogCategoriesSubmenu > *').css("minHeight", $catalogCategories.height() + 14 + 'px');

        var catalog = document.getElementById('catalogCategoriesPlaceholder');
        if(catalog != undefined)
            catalog.style.height = catalogCategoriesHeight;

        var $catalogList = $("#catalogList"),
            openTimer = null,
            $catalogButton = $(".b-topMenu__item--catalog").not(".b-topMenu__item--catalog__active"),
            timeDelay = 500,
            openCatalogTimerFnc = function(){
                if($catalogList.css("display") == "none")
                {
                    if(openTimer == null)
                        openTimer = setTimeout(openCatalogFnc, timeDelay);
                }
            },
            openCatalogFnc = function(){
                $catalogList.css("display", "block");
                clearTimeout(openTimer);
                openTimer = null;
            },
            closeCatalogFnc = function(){
                clearTimeout(openTimer);
                openTimer = null;
                $catalogList.css("display", "none");
            };
        $catalogButton.on("mouseenter", openCatalogTimerFnc)
            .on("mouseleave", closeCatalogFnc);
        if($catalogButton.length > 0){
            $catalogList.css("display", "none");
        }

        $catalogList.menuAim({
            activate: activateSubmenu,
            deactivate: deactivateSubmenu,
            exitMenu: exitMenu
        });

        function activateSubmenu(row) {
            var $row = $(row),
                $submenu = $row.children('.js-catalogCategoriesSubmenu');

            $submenu.css("marginTop", "auto")
                .show()
                .css("marginTop", -$(row).position().top + 'px');

            $row.addClass('b-menu__item--active');
        }

        function deactivateSubmenu(row) {
            var $row = $(row);

            $row.children('.js-catalogCategoriesSubmenu').hide();
            $row.removeClass('b-menu__item--active');
        }

        function exitMenu() {
            return true;
        }
    }
};

