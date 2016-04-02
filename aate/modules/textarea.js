App.textarea = {
    textCount: 0,
    textareaInputEvent: function (e) {
        var maxLength = $(this).attr('maxLength'),
            count = $(this).val().length,
            countField = $('.js-cart--textarea__count');

        if (maxLength - count <= 0) {
            countField.html(0);
            return false;
        }

        countField.html(maxLength - count);
    },
    textareaChangeEvent: function () {
        var maxLength = $(this).data().maxLength,
            countField = $($(this).data().countfield),
            text = $(this)[0].value,
            count = $(this).val().length;

        if(count > maxLength){
            $(this).val(text.substring(0, maxLength));
            text = $(this)[0].value;
            count = $(this).val().length;
            $(this).attr("maxlength", Number(maxLength) + text.split(/\n/).length + text.split(/\r/).length - 2);
            countField.html(0);
            return;
        }
        countField.html(maxLength - count);
    },
    textareaKeyInputEvent: function (e) {
        var maxLength = $(this).data().maxLength,
            countField = $($(this).data().countfield),
            text = $(this)[0].value,
            str = String.fromCharCode(e.keyCode),
            count = $(this).val().length;

        if(e.keyCode == 13){
            $(this).attr("maxlength", Number(maxLength) + text.split(/\n/).length + text.split(/\r/).length - 2);
        }

        if (maxLength - count <= 0 && str.length > 0) {
            countField.html(0);
            return false;
        }

        countField.html(maxLength - count);
    },
    textareaKeyCountInputEvent: function () {
        var maxLength = $(this).data().maxLength,
            countField = $($(this).data().countfield),
            text = $(this)[0].value,
            count = $(this).val().length;

        $(this).attr("maxlength", Number(maxLength) + text.split(/\n/).length + text.split(/\r/).length - 2);
        countField.html(maxLength - count);
    },
    bindItem: function(){
        //debugger;
        App.textarea.textCount++;
        var $this = $(this),
            $field = $this.find('.js-cart--textarea__field'),
            $count = $this.find('.js-cart--textarea__count');
        $field.attr("maxLength","1000")
            .data("maxLength","500")
            .data("countfield", ".js-cart--textarea__count" + App.textarea.textCount);
        $count.addClass("js-cart--textarea__count" + App.textarea.textCount)
            .html(500 - $field.val().length);

        $("<span>" + ACC.text.textareaCounter + "</span>").insertBefore($count);

        $field.on('input change', App.textarea.textareaChangeEvent)
            .on('keypress', App.textarea.textareaKeyInputEvent)
            .on('keyup', App.textarea.textareaKeyCountInputEvent);
    },
    bindEvent:function(){
        $('.js-cart--textarea:visible').removeClass("asyncload")
            .each(this.bindItem);

        $(".js-textarea--trigger").on("change", function(){
            if($(this).is(":checked") && $(this).data() != undefined && $(this).data().textarea && $($(this).data().textarea).hasClass("asyncload"))
            {
                $($(this).data().textarea).each(App.textarea.bindItem);
            }
        });

        var $elements = $('.js-cart--textarea').not(".asyncload").not(":visible").addClass("invisible");
        if($elements.length){
            var t = setInterval(function(){
                if($elements.filter(":visible").length){
                    var el = $elements.filter(":visible");
                    el.removeClass("invisible");
                    el.each(App.textarea.bindItem);
                    $elements = $('.js-cart--textarea.invisible');
                }
                if($elements.length == 0){
                    clearTimeout(t);
                    return;
                }
            }, 300);
        }
    }
};

