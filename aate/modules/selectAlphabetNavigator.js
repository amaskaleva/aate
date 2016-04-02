/*
* Plugin for navigating in Select alphabetically.
* Used only for jqueryui select (http://jqueryui.com/selectmenu/, http://api.jqueryui.com/selectmenu/)
* Select mast be one on the page!
* It is used to select the region when editing the address. 
*/

App.selectAlphabetNavigator = {

    // tag select (object)
    $select: null,
    // params
    options: {
        // tag select class
        selectClass: 'js-selectWithAlphabetNavigator', 
        // header class group in the dropdown list
        selectMenuOptgroupClass: 'ui-selectmenu-optgroup', 
        // the text that will be considered in the construction of the alphabetical list (for the regular expression)
        unnecessaryText: 'область|обл.|Республика|республика|край|автономный|округ|&nbsp;',
        // the first letter of the table of contents in alphabetical order
        startIndexLetter: 'А'
    },

    // inicialization
    bindEvent: function() {
        
        // tag select (object)
        this.$select = $('.' + this.options.selectClass);
                
        var _this = this;
        
        if ( this.$select.size() == 1 ) {                
            // add alphabet index optgroup in select
            this.addAlphabetIndexOptgroup(_this);
            // scroll the list until you press
            this.scrollListToPressKey(_this);
        };
    },

    // add alphabet index optgroup in select
    addAlphabetIndexOptgroup: function (_this) {
        
        var $select = _this.$select;

        if ($select.find("optgroup").size() == 0 && $select.find("option").size() > 0) {
           
            var $newSelect = $select.clone();
            var $oldOptions = $newSelect.find('option').remove();
            var currentIndexLetter = '';
            var currentFirstLetter = '';
            var isStartIndexed = false;

            $oldOptions.each(function() {
                
                var $currentOptionClone = $(this).clone();

                var textOption = $currentOptionClone.html();

                currentFirstLetter = _this.getFirstIndexLetter(_this, textOption);

                isStartIndexed = (currentFirstLetter == _this.options.startIndexLetter) ? true : isStartIndexed;

                if (isStartIndexed) {
                    
                    if (currentFirstLetter && currentFirstLetter != currentIndexLetter) {
                        currentIndexLetter = currentFirstLetter;                        
                        $newSelect.append('<optgroup label="'+ currentIndexLetter + '"></optgroup>');                            
                    }

                    var $currentOptgroup = (currentIndexLetter) ? $newSelect.find('optgroup[label='+currentIndexLetter+']') : null;

                    if ($currentOptgroup && $currentOptgroup.size() == 1) {
                        $currentOptgroup.append($currentOptionClone);
                    }
                    else {
                        $newSelect.append($currentOptionClone);
                    }
                }
                else {                    
                    $newSelect.append($currentOptionClone);
                }
            });

            // replace options in select
            var $newOptions = $newSelect.html();
            $select.find("option").remove();
            $select.prepend($newOptions);            
        }
    },

    // return the first indexable letter
    getFirstIndexLetter: function (_this, text) {

        if (! text) {
            return '';
        }

        var cleanText = text.replace( new RegExp(_this.options.unnecessaryText, 'g'), '' );
        cleanText = cleanText.replace(/^\s+|\s+$/g, '');

        var firstLetter = cleanText.charAt(0);

        var indexLetter = firstLetter.toUpperCase();

        return indexLetter;
    },

    // scroll the list until you press
    scrollListToPressKey: function (_this) {

        // when select in focus
        $(document).on("selectmenuopen", "." + _this.options.selectClass, function(event, ui) {
            
            var $selectMenuWidget = $("." + _this.options.selectClass).selectmenu("menuWidget");

            // user press key, when select in focus                
            $(document).on("keypress", function(eventKeyPress) {

                var letter = _this.getPressChar(eventKeyPress);
                
                if (letter && typeof(letter) == 'string') {
                    
                    var indexLetter = letter.toUpperCase();
                                            
                    var $selectMenuOptgroup = $selectMenuWidget.find('.' + _this.options.selectMenuOptgroupClass + ':contains(' + indexLetter + ')').eq(0);
                    
                    if ($selectMenuOptgroup.size() == 1) {
                        
                        $selectMenuWidget.scrollTop(0);
                        
                        var selectMenuOptgroupTop = $selectMenuOptgroup.position().top;
                        selectMenuOptgroupTop = selectMenuOptgroupTop*1;
                        selectMenuOptgroupTop = Math.round(selectMenuOptgroupTop);
                        
                        // console.log(indexLetter); console.log(selectMenuOptgroupTop);

                        if (selectMenuOptgroupTop != 0) {                            
                            $selectMenuWidget.scrollTop(selectMenuOptgroupTop);
                        }
                    }
                }
            });
        });
    },

    // returns the character of the pressed key
    getPressChar: function (event) {

        if (event.which == null) { // for IE
            if (event.keyCode < 32) return null; // special car
            return String.fromCharCode(event.keyCode);
        }

        if (event.which != 0 && event.charCode != 0) { // not IE
            if (event.which < 32) return null; // special car
            return String.fromCharCode(event.which); // overs
        }

        return null; // special car
    }
}