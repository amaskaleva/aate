/**
 * Parse data-options
 *
 */

App.parseDataOption = {
    parseIt: function() {
        $('.js-action').on('click mouseover', function(e){

            var targets = $(this).data('options').targets;

            $.each(targets, function(targetObjIndex, targetObj){

                // if fireAction === current action
                var fireAction = targetObj.fireAction;
                if ( fireAction !== e.type )
                    return false;

                var $target = $(targetObj.target),
                    targetAction = targetObj.targetAction,
                    targetToggleClassName = targetObj.className;

                App.actionsList[targetAction]($target, targetToggleClassName)

            });

        });
    }
};

