/**
 * Actions definition
 */

App.actionList = {
    // hide element
    jsHide: function($obj){
        $obj.hide();
    },

    // show element
    jsShow: function($obj){
        $obj.show();
    },

    // toggle element
    jsToggle: function($obj){
        $obj.toggle();
    },

    // toggle element class
    jsToggleClass: function($obj, className){
        $obj.toggleClass(className);
    }

};