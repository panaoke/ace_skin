_position_resource = {
    "failed": "Can't get position"
};

/*
 * 位置获取器
 *
 */

(function ($) {

    var PROP_NAME = 'position';

    var mapDiag;
    var map;

    function mapDialog(options) {
        if (!mapDiag) {
            mapDiag = $('<div class="map-dialog col-sm-12" style="height: 300px"></div>');
            map = new BMap.Map(mapDiag[0]);                    // 创建地图实例
            map.addControl(new BMap.NavigationControl());         //左上角控件
            map.enableScrollWheelZoom();                          //滚动放大
            map.enableKeyboard();                                 //键盘放大
        }

        var point = new BMap.Point(options.longitude, options.latitude);   // 创建点坐标

        BMap.Convertor.translate(point, 0, function (newPoint) {
            var marker = new BMap.Marker(newPoint);                  // 标记
            map.centerAndZoom(newPoint, 15);                         // 初始化地图，设置中心点坐标和地图级别
            map.addOverlay(marker);                               //标记地图
        });

        var div = bootbox.dialog({
            message: mapDiag,
            title: options.title || i18n.view('position', 'mapDialogTitle'),
            buttons: {
                "close": {
                    "label": "<i class='icon-reply'></i>" + i18n.action('back'),
                    "className": "btn-sm btn-primary"
//                    "callback": function (e) {
//                        map.destroy()
//                    }
                }
            }
        });
    }



    var CurrentPositionDiv = function (element, options) {
        var self = this;

        self.$element = $(element);

        self.$btn = $("<a href='#'><i class='icon-location-arrow'>"+ options['address'] +"</i></a>");

        self.getLocation = function () {
            return  {longitude: options['longitude'], latitude: options['latitude']};
        };

        self.$btn.on('click', function () {
            mapDialog(self.getLocation());
        });

        self.init = function (options) {
            options = $.extend({position_able: false}, options || {});

            self.$element.html(self.$btn);
        };

        self.init(options);

    };

    $.fn.acePosition = function (options) {
        options = $.extend($(this).data(), options || {});
        var current_position = $(this).data('current_position');
        if (!current_position) {
            $(this).data('current_position', current_position = new CurrentPosition(this, options));
        }
        return current_position;
    };

    $.fn.aceDivPosition = function (options) {
        options = $.extend($(this).data(), options || {});
        var current_position = $(this).data('current_position');
        if (!current_position) {
            $(this).data('current_position', current_position = new CurrentPositionDiv(this, options));
        }
        return current_position;
    };

})(jQuery);
