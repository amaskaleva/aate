// products counter
App.counterNumber = {
    countMinusFunction: function(e){
            var $fieldCounter = $(this).closest('.js-counter__wrapper').find('.js-counter__number'),
                curVal = parseInt($fieldCounter.val()) || 1;

            curVal <= 1 ? $fieldCounter.val(1) : $fieldCounter.val(curVal-1);
            $fieldCounter.change();
        e.stopPropagation();
        return false;
    },

    countPlusFunction: function(e){
        var $fieldCounter = $(this).closest('.js-counter__wrapper').find('.js-counter__number'),
            curVal = parseInt($fieldCounter.val()) || 0;

        curVal < 1 ? $fieldCounter.val(1) : (curVal+1 > 9999 ? $fieldCounter.val(9999) : $fieldCounter.val(curVal+1));
        $fieldCounter.change();
        e.stopPropagation();
        return false;
    },

    countChangeFunction:function(){
        var $fieldCounter = $(this),
            curVal = parseInt($fieldCounter.val()) || 1;


        curVal < 1 || isNaN(curVal)? $fieldCounter.val(1) : (
            curVal > 9999 ? $fieldCounter.val(9999) : $fieldCounter.val(curVal)
        );
    },

    bindEvent: function(){
        $('.js-counter__minus').off('click', App.counterNumber.countMinusFunction)
            .on('click', App.counterNumber.countMinusFunction);

        $('.js-counter__plus').off('click', App.counterNumber.countPlusFunction)
            .on('click', App.counterNumber.countPlusFunction);

        $('.js-counter__number').off('change', App.counterNumber.countChangeFunction)
            .on('change', App.counterNumber.countChangeFunction);
    }
};