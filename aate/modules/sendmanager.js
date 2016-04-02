 App.sendmanager = {
    sendMessage: function(form){
        if (!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/my-account/my-manager/send-aj";

        var successFunction = function (response)
        {
            $('.message').each(App.common.removeChild);

            if (response.status == 'FAIL') {
                $.each(response.errorMessageList, function(key, value){

                    var item = form.find('[name=' + value.field + ']');

                    if(item.parent('label').length>0){
                        item.parent().append('<label class="b-text--error message" for="' + item.attr('id') + '">' + value.defaultMessage + '</div>')
                    }
                    else
                        item.after($('<label class="b-text--error message" for="' + item.attr('id') + '">' + value.defaultMessage + '</div>'));
                    item.addClass('b-text--error');
                })
            } else {
                var url = ACC.config.contextPath + "/my-account/my-manager/send_success";
                window.location.replace(url);
            }
        };

        App.common.sendJsonForm(form, url, successFunction);
        return false;
    },

    changeCompany: function() {
        /*
        if(!App.common.isACC()) return false;

        var url = ACC.config.contextPath + "/my-account/my-manager/company";

        var successFunction = function(response){
            var url = ACC.config.contextPath + "/my-account/my-manager";
            window.location.replace(url);
        }

        App.common.sendForm($(this).closest('form'), url, successFunction, undefined, 'text');
        */

    },

    bindEvent: function(){
        $('.js-changecompany__form').find('select')
            .change(function(){
                $(this).closest('form').submit();
            });

        $('.js-sendmanager__form').each(function(){
            var obj = {
                submitHandler:
                    function(form){
                        App.common.formFilter($(form));
                        $(form)[0].submit();
                    }
            };
            $(this).validate(obj);
        })
    }
};
