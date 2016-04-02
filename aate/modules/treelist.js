App.treeList = {
    bindEvent: function (e) {
        $('.js-leafToggle').on("click", function (e) {
            var $this = $(e.target);
            e.stopPropagation();
            if($this.is('.b-treelist__leaf--closed')) {
                $this.removeClass('b-treelist__leaf--closed').addClass('b-treelist__leaf--opened');
            } else if($this.is('.b-treelist__leaf--opened')) {
                $this.removeClass('b-treelist__leaf--opened').addClass('b-treelist__leaf--closed');
            }
        });
    }
};