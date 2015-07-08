!function ($) {
    Array.prototype.delete_blank = function() {
        var arr = [];
        for (var i = 0; i < this.length; i ++) {
            if (this[i] && this[i].trim().length > 0)
                arr.push(this[i].trim());
        }
        return arr;
    };

    var calculate = {};

    calculate.integerCalculate = function (element, options) {
        var $element = $(element);
        var span = $('<span />', {}), $form = $element.parents('form');
        $element.after(span);
        var object = $element.attr('name').replace(/\[[\w]+\]/, ''), formula = $element.data('formula').replace(/[ ]/g, '');
        span.html($element.val() || 0);
        $form.on('change', 'input, select', function () {
            var hash = {}, vs = $form.serializeArray();
            for (var i = 0; i < vs.length; i++) {
                var name = vs[i]['name'].split(/[\[\]]/).delete_blank().join('_');
                hash[name] = vs[i]['value']/1 > 0 ? vs[i]['value']/1 : 0;
            }
            var res = formatInteger(eval(formula.replace(/([a-zA-Z_]+[a-zA-z\d\.]*)/g, "Number(hash['" + object + "_$1'] || 0)")));
            $element.val(res);
            span.html(res);
        }); 
    }

    calculate.timeCalculate = function(element, options) {
        var $element = $(element);
        var span = $('<span />', {}), $form = $element.parents('form');
        $element.after(span);
        var object = $element.attr('name').replace(/\[[\w]+\]/, ''), formula = $element.data('formula').replace(/[ ]/g, '');
        span.html($element.val());
        $form.on('change', 'input, select', function () {
            var hash = {}, vs = $form.serializeArray();
            for (var i = 0; i < vs.length; i++) {
                var name = vs[i]['name'].split(/[\[\]]/).delete_blank().join('_');
                if (typeof vs[i]['value'] == "string") {
                    var times = vs[i]['value'].split(/\:/).delete_blank();
                    switch(times.length) {
                        case 3:
                            hash[name] = Number(times[0]) * 60 * 60 + Number(times[1]) * 60 + Number(times[2]);
                            break;
                        case 2:
                            hash[name] = Number(times[0]) * 60 * 60 + Number(times[1]) * 60;
                            break;
                        case 1:
                            hash[name] = Number(times[0]) * 60 * 60;
                            break;
                    }
                }
            }
            var res = eval(formula.replace(/([a-zA-Z_\d\.]+)/g, "Number(hash['" + object + "_$1'] || 0)"));
            $element.val(res);
            res = (Math.floor(res / 3600)) + ":" + (Math.floor((res % 3600) / 60)) + ":" + ((res % 3600) % 60);
            span.html(res);
        });
    };

    function formatInteger(value) {
        if(value == Infinity || isNaN(value)){
            return '';
        }else{
            return Math.round(value*10)/10;
        }
    }


    $.fn.calculate = function (options) {
        var calculateType = this.data('value-format') || 'integer';
        calculate[calculateType + 'Calculate'](this, options);
    };

}(window.jQuery);