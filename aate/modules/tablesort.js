App.tablesort = {
    getColspanItemsFromTable: function(elem, number){
        return elem.closest('thead').find('th[colspan]:lt(' + number + ')')
    },
    getColspanItemsFromDivTable: function(elem){
        return elem.closest('.js-table--sort__th > div[colspan]');
    },

    getItemByIndexFromTable: function(table, number){
        return table.find('td:eq(' + number + ')')
    },
    getItemByIndexFromDivTable: function(table, number){
        return $(table.find('.js-table--sort__tr > div')[number]);
    },

    getRowByIndexFromTable: function(table, number){
        return table.find('tr:eq(' + number + ')')
    },
    getRowByIndexFromDivTable: function(table, number){
        return $(table.find('.js-table--sort__tr')[number]);
    },
    sortClick: function(){
        var option = $(this).data("option"),
            table, tdCount,
            tdArr = [],
            start = 0,
            sortFunction,
            invert = false,
            trLength = 0,
            searchColspanItemFunc, searchItemByIndexFunc, searchRowByIndexFunc, appendFunc;

        if($(this).is('th')){
            table = $(this).closest('table').find('tbody');
            tdCount = table.find('tr:first td').length;
            trLength = table.find('tr').length;
            searchColspanItemFunc = App.tablesort.getColspanItemsFromTable;
            searchItemByIndexFunc = App.tablesort.getItemByIndexFromTable;
            searchRowByIndexFunc = App.tablesort.getRowByIndexFromTable;
        }
        else if($(this).is('div')){
            table = $(this).closest('.js-table--sort__table');
            tdCount = table.find('.js-table--sort__tr:first').children('div').length;
            trLength = table.find('.js-table--sort__tr').length;
            searchColspanItemFunc = App.tablesort.getColspanItemsFromDivTable;
            searchItemByIndexFunc = App.tablesort.getItemByIndexFromDivTable;
            searchRowByIndexFunc = App.tablesort.getRowByIndexFromDivTable;
        }
        else return;

        if(option == undefined || option.length == 0)
        {
            option={};
        }

        if(option.row == undefined)
        {
            option.row = $(this).index() + 1;
            searchColspanItemFunc($(this), option).each(function(){
                option.row += Number($(this).attr('colspan'))-1;
            })
        }

        option.type = option.type == undefined ? "string" : option.type;

        for(var i = 0, len = trLength; i < len; i++)
        {
            start = i*tdCount + parseInt(option.row) - 1;
            tdArr[tdArr.length] = {idx: i, elem: searchItemByIndexFunc(table, start).text()};
        }
        if($(this).find('.js-table--sort__elem').hasClass('invert'))
            invert = true;

        switch(option.type){
            case "digits":
                if(invert)
                    sortFunction = function(a, b){
                        a.elem = a.elem.replace(/[^\d\.,]/g,'').replace(/[,]/g,'.').replace(/[.]/,'*').replace(/[.]/g,'').replace(/[*]/,'.');
                        b.elem = b.elem.replace(/[^\d\.,]/g,'').replace(/[,]/g,'.').replace(/[.]/,'*').replace(/[.]/g,'').replace(/[*]/,'.');

                        return Number(a.elem) - Number(b.elem);
                    };
                else
                    sortFunction = function(a, b){
                        a.elem = a.elem.replace(/[^\d\.,]/g,'').replace(/[,]/g,'.').replace(/[.]/,'*').replace(/[.]/g,'').replace(/[*]/,'.');
                        b.elem = b.elem.replace(/[^\d\.,]/g,'').replace(/[,]/g,'.').replace(/[.]/,'*').replace(/[.]/g,'').replace(/[*]/,'.');

                        return Number(b.elem) - Number(a.elem);
                    };
                break;
            case "date":
                if(invert)
                    sortFunction = function(a, b){
                        var ae = new Date(a.elem.replace(/(\d+).(\d+).(\d+)/, '20$3/$2/$1'));
                        var be = new Date(b.elem.replace(/(\d+).(\d+).(\d+)/, '20$3/$2/$1'));
                        return Number(ae.getTime()) - Number(be.getTime());
                    };
                else
                    sortFunction = function(a, b){
                        var ae = new Date(a.elem.replace(/(\d+).(\d+).(\d+)/, '20$3/$2/$1'));
                        var be = new Date(b.elem.replace(/(\d+).(\d+).(\d+)/, '20$3/$2/$1'));
                        return Number(be.getTime()) - Number(ae.getTime());
                    };
                break;
            default :
                if(invert)
                    sortFunction = function(a, b){
                        if(a.elem >= b.elem) return 1;
                        return -1;
                    };
                else
                    sortFunction = function(a, b){
                        if(a.elem <= b.elem) return 1;
                        return -1;
                    }
        }

        Array.prototype.sort.call(tdArr, sortFunction);
        if($(this).find('.js-table--sort__elem').hasClass('invert'))
        {
            $(this).find('.js-table--sort__elem').removeClass('invert');
        }
        else{
            $(this).find('.js-table--sort__elem').addClass('invert');
        }

        var trArr = [];

        $.each(tdArr, function(key, value){
            trArr[trArr.length] = searchRowByIndexFunc(table, value.idx);
        });

        $.each(trArr, function(key, value){
            table.append(value);
        });

        $(this).data("option", option);
        return false;
    },
    bindEvent: function(){
        $('.js-table--sort').on('click', App.tablesort.sortClick);
    }
};