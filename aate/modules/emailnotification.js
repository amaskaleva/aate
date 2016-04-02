App.emailnotification = {
    doEmailSubscribe: function () {

        var url = ACC.config.contextPath + "/my-account/mailing-lists/email-subscribe-aj",
            form = $(this),
            json = { 'mailingLists': []},
            successFunction = function (response) {
                if(response.status == "SUCCESS")
                {
                    form.find('[type=checkbox]:checked').each(function () {
                        form.find(".active" + $(this).parent().data().index).show();
                        form.find(".error" + $(this).parent().data().index).hide();
                    });
                    form.find('[type=checkbox]').not(':checked').each(function () {
                        form.find(".active" + $(this).parent().data().index).hide();
                        form.find(".error" + $(this).parent().data().index).show();
                    });
                }
            };

        form.find('[type=checkbox]:checked').each(function () {
            json['mailingLists'].push($(this).val());
        });

        App.common.sendAjaxData(json, url, successFunction, undefined, "json", "POST");
        return false;
    },

    bindEvent: function () {
        $('.js-form__email--notification').submit(App.emailnotification.doEmailSubscribe);
    }
};

