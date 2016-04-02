App.review={
    postCustomerReview: function(form){
        var url = '/p/'+ ACC.product.id + '/postReview',
            successFunction = function(response){
                form.find(".message").remove();
                var errors =[];
                if (response.status == 'FAIL') {
                    for (var i = 0; i < response.errorMessageList.length; i++) {
                        errors[errors.length] = response.errorMessageList[i].defaultMessage;
                    }
                    form.prepend($("#errorMessage").tmpl({errors: errors}));
                } else {
                    form.hide();
                    var html = $("#successMessage").tmpl({message: response.message});
                    $(html).insertBefore(form);
                }
            };
        App.common.sendForm(form, url, successFunction, undefined, "json");
    },

    getReviewsList: function(page){
        if (!page) {
            page = 1;
        }
        var url = '/p/' + ACC.product.id + '/reviews/' + page,
            successFunction = function (data) {
                $('#read_reviews').empty();
                data = JSON.parse(data);
                var arr = [],
                    pageArray=[];
                $.each(data.reviews, function(key, value){
                    if(value.comment.length > 132)
                    {
                        value.cutComment = value.comment.substr(0, 132);
                        value.commentMore = value.comment.substr(132, value.comment.length);
                    }
                    arr.push(value);
                });
                while(pageArray.length < data.totalPages)
                    pageArray.push({pageNumber:pageArray.length + 1});

                data.reviews = arr;
                data.pageArray = pageArray;

                $('#read_reviews').append($('#reviewTemplate').tmpl(data));
                $('#read_reviews').append($('#reviewPagesTemplate').tmpl(data));

                $('.js-review__pagination__item').off('click', App.review.bindPageEvent);
                $('.js-review__pagination__item').on('click', App.review.bindPageEvent);
                App.common.hideTitle(".read_reviews");

            },
            errorFunction = function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("Error: " + errorThrown);
            };

        App.common.sendAjaxData("", url, successFunction, errorFunction, "json", "get");
    },

    bindPageEvent: function(){
        var page = $(this).data().page;
        if($(this).hasClass("active"))
            return false;

        App.review.getReviewsList(page);

        $(".js-review__pagination__item").removeClass("active");
        $(".js-review__pagination__item[data-page=" + page + "]").not(".before, .next").addClass("active");

        $(".js-review__pagination__item.before").data("page", page > 2 ? page-1 : 1);
        $(".js-review__pagination__item.next").data("page", $(".js-review__pagination__item[data-page=" + (page + 1) + "]").not(".before, .next").length > 0 ? page + 1 : page);

        App.common.changeUrl($(this).attr("href"));
        App.scrollToDirection.scrollToTarget('.js-reviews',-50);
        return false;
    },
    showDetails: function () {
        $('.js-review__more').show();
        $('.js-review__show').addClass('i-dn');
        $('.js-review__hide').removeClass('i-dn');
    },
    hideDetails: function () {
        $('.js-review__more').hide();
        $('.js-review__show').removeClass('i-dn');
        $('.js-review__hide').addClass('i-dn');
    },
    bindEvent: function(){
        var $tabs = $('.js-toReviewTab'),
            $review = $('.js-reviews');

        if($tabs.length){
            $('.js-toReviewTab').on('click', function(){
                if(!$('.js-reviews').hasClass("b-tabs__tab--active"))
                {
                    $('.js-productReview__form .js-listHide').hide();
                    $('.js-reviews')[0].click();
                }
                App.scrollToDirection.scrollToTarget('.js-reviews',-50);
            });

            if($review.length){
                $review.find('.b-tabs__tab__inner').on("click", function(){
                    if(!$review.hasClass("b-tabs__tab--active"))
                        $('.js-productReview__form').find('.js-listHide').hide();
                });
            }

            var obj = {
                submitHandler:
                    function(form){
                        App.review.postCustomerReview($(form));
                        return false;
                    }
            };
            $('.js-productReview__form').validate(obj);
            $('.js-review__pagination__item').on('click', App.review.bindPageEvent);

            $('.js-review__show').on('click', App.review.showDetails);
            $('.js-review__hide').on('click', App.review.hideDetails);
        }
  }
};