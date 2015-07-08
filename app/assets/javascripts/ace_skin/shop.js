/**
 *  用于实现门店选择的js
 */


!function ($) {

    var Shop = function (attr) {
        var self = this;

        self.setSelected = function (isSelected) {
            self.isSelected = isSelected;
        };

        $.each(attr, function (k, v) {
            self[k] = v
        });

        self.renderBtn = function () {
            var className = self.isSelected ? "btn btn-danger btn-minier " : "btn  btn-minier btn-info";
            return "<button class='row-action " + className + "' data-shop_id=" + self.shop_id +
                " data-is-selected=" + self.isSelected + " >" +
                (self.isSelected ? i18n.action('delete') : i18n.action('add')) + "</button>"
        };

        self.detail = function () {
            return {
                id: self.shop_id,
                shop_name: self.shop_name,
                shop_id: self.shop_id,
                address: self.address,
                longitude: self.longitude,
                latitude: self.latitude,
                isSelected: self.isSelected,
                shop_code: self.shop_code,
                operate: self.renderBtn()
            };
        }

    };

    var ShopSelect = function (element, options) {
        var self = this;
        self.$element = $(element);

        var defaultOptions = {
            maxSize: 10000
        };

        self.currentShops = [];

        self.options = $.extend({}, defaultOptions, options);

        self.selectedShopIds = function () {
            if (self.selectedShops == undefined) {
                return self.$element.val().split(',').map(function (shop_id) {
                    return Number(shop_id)
                });
            } else {
                var shopIds = [];
                $.each(self.selectedShops, function (i, shop) {
                    shopIds.push(shop.shop_id)
                });
                return shopIds;
            }
        };

        self.init = function () {
            self.modalView = new ModalView(self);
        };

        self.setValue = function () {
            self.$element.val(self.selectedShopIds().join(","));
            self.shopView.selectedTable.trigger('loadData', [self.selectedShops]);
        };

        self.showBox = function () {
            self.init();
        };

        self.initView = function () {
            self.$element.hide();
            self.shopView = new ShopView(self);
        };


        self.findConditions = function () {
            return self.modalView.getSearchCondition();
        };


        self.findShopByConditions = function (succCallback, errorCallback) {
            self.findShops(self.findConditions(), succCallback, errorCallback)
        };

        self.findShops = function (conditions, succCallback, errorCallback) {
            $.ajax({
                async: true,
                url: '/shops.json',
                type: 'POST',
                data: {
                    conditions: conditions,
                    selected_shop_ids: self.selectedShopIds().join(',')
                },
                error: function (req, err_info, e) {
                    errorCallback(err_info);
                },
                success: function (data) {
                    succCallback(data);
                }
            });
        };

        self.addShop = function (data) {
            data.isSelected = true;
            var shopData = (new Shop(data)).detail();
            self.modalView.selectedTable.jqGrid('addRowData', shopData.shop_id, shopData);
            self.modalView.selectTable.jqGrid('setRowData', shopData.shop_id, shopData);
            self.selectedShops.push(data);
            if (self.selectedShops.length > self.options.maxSize) {
                var popShop = self.selectedShops.shift();
                popShop.isSelected = false;
                self.modalView.selectTable.jqGrid('setRowData', popShop.shop_id, (new Shop(popShop)).detail());
                self.modalView.selectedTable.jqGrid('delRowData', popShop.shop_id);
            }
        };

        self.deleteShop = function (shop) {
            shop.isSelected = false;
            var index = self.selectedShops.indexOf(shop);
            self.modalView.selectedTable.jqGrid('delRowData', shop.shop_id);
            self.modalView.selectTable.jqGrid('setRowData', shop.shop_id, (new Shop(shop)).detail());
            self.selectedShops.splice(index, 1);
        };

        self.findSelectShopByShopId = function (shopId) {
            var result;
            $.each(self.currentShops, function (i, shop) {
                if (shop.shop_id == shopId) {
                    result = shop;
                }
            });
            return result;
        };


        self.findSelectedShopByShopId = function (shopId) {
            var result;
            $.each(self.selectedShops, function (i, shop) {
                if (shop.shop_id == shopId) {
                    result = shop;
                }
            });
            return result;
        };

        self.getSelectedShops = function () {
            return self.selectedShops.map(function (shop) {
                return (new Shop(shop)).detail()
            })
        };

        self.getCurrentShops = function () {
            return self.currentShops.map(function (shop) {
                return (new Shop(shop)).detail()
            })
        };

        self.btnClick = function (shopData) {
            if (shopData.isSelected) {
                self.deleteShop(shopData);
            } else {
                self.addShop(shopData);
            }
        };

        self.initView();

        return self;
    };

    var ModalView = function (select) {
        var self = this;
        self.select = select;
        self.intiFlag = true;

        self.initTemplate = function () {
            self.selectTable = self.container.find('#select_table');

            self.selectedTable = self.container.find('#selected_table');
            self.searchFrame = self.container.find('#search_frame');
            self.areaSelect = self.container.find('#area_select');
            self.mapFrame = self.container.find('#map_frame');
            self.mapPic = self.container.find('#map_pic');

            self.selectTable.on('init', function () {
                self.selectTable.defaultJqGrid({
                    jsonReader: {
                        id: 'shop_id',
                        userdata: 'rows'
                    },
                    url: '/shops/all.json',
                    width: 450,
                    height: 221,
                    colNames: ['标识符', '名称', '地址', '操作'],
                    colModel: [
                        {name: 'shop_code', width: 20, sorttype: "text"},
                        {name: 'shop_name', width: 40, sorttype: "text"},
                        {name: 'address', width: 70, sorttype: "text"},
                        {name: 'operate', width: 20, sorttype: "text"}
                    ],
                    onSelectRow: function (shop_id) {
                        self.mapFrame.trigger('loadData', self.findSelectShopByShopId(shop_id))
                    },
                    viewrecords: true,
                    beforeRequest: function() {
                        var postData =  self.selectTable.jqGrid('getGridParam', 'postData');
                        postData.selected_shops_ids = self.select.selectedShops.map(function(shop, i) {
                            return shop.shop_id
                        }).join(',');
                        self.selectTable.jqGrid('setGridParam', {postData: postData});
                    },
                    pager: self.container.find('#select_table_page'),
                    rowNum: 6,
                    altRows: true,
                    multiselect: false,
                    multiboxonly: false,
                    pagerpos: 'left',
                    recordpos: 'center'
//                    pginput: false
                });
            });

            self.selectedTable.on('init', function () {
                self.selectedTable.jqGrid({
                    jsonReader: {
                        id: 'shop_id'
                    },
                    datatype: "local",
                    data: self.select.selectedShops,
                    height: 100,
                    width: 450,
                    colNames: ['标识符', '名称', '地址', '操作'],
                    colModel: [
                        {name: 'shop_code', width: 20, sorttype: "text"},
                        {name: 'shop_name', width: 40, sorttype: "text"},
                        {name: 'address', width: 70, sorttype: "text"},
                        {name: 'operate', width: 20, sorttype: "text"}
                    ],
                    onSelectRow: function (shop_id) {
                        self.mapFrame.trigger('loadData', self.findSelectedShopByShopId(shop_id))
                    },
                    viewrecords: true,
                    rowNum: 1000,
                    altRows: true,
                    pgbuttons: false,
                    pginput: false,
                    hidegrid: false,
                    multiselect: false,
                    multiboxonly: false
                });
            });

            self.areaSelect.on('init', function () {
                self.provinceSelectDom = self.areaSelect.find('select[name=province_code]');
                self.citySelectDom = self.areaSelect.find('select[name=city_code]');
                self.areaSelectDom = self.areaSelect.find('select[name=area_code]');

                self.provinceSelectDom.on('loadData', function () {
                    self.findLocationInfo('/shops/provinces', function (provinces) {
                        $.each(provinces, function (i, province) {
                            var option = $("<option value='" + province.id + "'>" + province.name + "</option>");
                            self.provinceSelectDom.append(option);
                        });
                        self.provinceSelectDom.trigger("chosen:updated.chosen");
                    });
                });

                self.provinceSelectDom.on('change', function () {
                    var provinceId = self.provinceSelectDom.val();
                    if (provinceId != '') {
                        self.citySelectDom.trigger('loadData', provinceId)
                    } else {
                        self.citySelectDom.html('');
                        self.citySelectDom.trigger("chosen:updated.chosen");
                    }
                    self.areaSelectDom.html('');
                    self.areaSelectDom.trigger("chosen:updated.chosen");
                });

                self.citySelectDom.on('change', function () {
                    var cityId = self.citySelectDom.val();
                    if (cityId != '') {
                        self.areaSelectDom.trigger('loadData', cityId)
                    }
                });

                self.citySelectDom.on('loadData', function (e, province_id) {
                    self.findLocationInfo("/shops/cities?province_id=" + province_id, function (cities) {
                        var defaultOption = $("<option value=''>" + i18n.action('all') + "</option>");
                        self.citySelectDom.html('');
                        self.citySelectDom.append(defaultOption);
                        $.each(cities, function (i, city) {
                            var option = $("<option value='" + city.id + "'>" + city.name + "</option>");
                            self.citySelectDom.append(option);
                        });
                        self.citySelectDom.trigger("chosen:updated.chosen");
                    });
                });

                self.areaSelectDom.on('loadData', function (e, city_id) {
                    self.findLocationInfo("/shops/areas?city_id=" + city_id, function (areas) {
                        var defaultOption = $("<option value=''>" + i18n.action('all') + "</option>");
                        self.areaSelectDom.html('');
                        self.areaSelectDom.append(defaultOption);
                        $.each(areas, function (i, area) {
                            var option = $("<option value='" + area.id + "'>" + area.name + "</option>");
                            self.areaSelectDom.append(option);
                        });
                        self.areaSelectDom.trigger("chosen:updated.chosen");
                    });
                });

                self.areaSelect.find('select[data-toggle=choose]').chosen({
                    no_results_text: '未找到此选项!',
                    default_text: '市'
                });

                self.provinceSelectDom.trigger('loadData');

            });

            self.areaSelect.trigger('init');

            self.selectTable.on('loadData', function () {
                self.selectTable.jqGrid('clearGridData');
                self.selectTable.jqGrid('setGridParam', {data: self.select.getCurrentShops()}).trigger('reloadGrid');
            });

            self.selectTable.on('click', '.row-action', function (e) {
                var shop_id = $(e.target).data().shop_id;
                var shopData = self.findSelectShopByShopId(shop_id);
                self.select.btnClick(shopData);
            });

            self.selectedTable.on('click', '.row-action', function (e) {
                var shop_id = $(e.target).data().shop_id;
                var shopData = self.findSelectedShopByShopId(shop_id);
                self.select.btnClick(shopData);
            });

            self.searchFrame.find("#search_btn").on('click', function () {
//                self.selectTable.trigger('reloadGrid');
                self.selectTable.jqGrid('setGridParam', {page: 1});
                self.findSelectShopByCondition();
            });


            self.areaSelect.on('search', function () {
//                self.findAllShops();
                self.selectTable.trigger('refresh');
            });

            self.mapFrame.on('loadData', function (e, shop) {
//                var shop = self.select.findSelectedShopByShopId(shop_id) || self.select.findSelectShopByShopId(shop_id);
                if(shop.longitude == 0 || shop.latitude == 0) {
                    self.mapFrame.hide();
                    self.mapPic.show();
                }else{
                    self.mapFrame.show();
                    self.mapPic.hide();
                }
                var point = new BMap.Point(shop.longitude, shop.latitude);    // 创建点坐标
                BMap.Convertor.translate(point, 0, function (newPoint) {
                    self.map.clearOverlays();                                       // 清除地图上所有覆盖物
                    var marker = new BMap.Marker(newPoint, {label: shop.shop_name, title: shop.address});                    // 标记
//                    marker.setIcon(mark_icon);                                 // 设置mark的图标
                    self.map.panTo(newPoint);                                       // 更换地图中心店
                    self.map.addOverlay(marker);                               //标记地图
                });
            });

            self.mapFrame.on('init', function (longitude, latitude) {
                self.map = new BMap.Map("map_frame");                    // 创建地图实例
                var point = new BMap.Point(0, 0);   // 创建点坐标
                self.map.addControl(new BMap.NavigationControl());         //左上角控件
                self.map.enableScrollWheelZoom();                          //滚动放大
                self.map.enableKeyboard();                                 //键盘放大
                BMap.Convertor.translate(point, 0, function (newPoint) {
                    var marker = new BMap.Marker(newPoint);                  // 标记
                    self.map.centerAndZoom(newPoint, 15);                         // 初始化地图，设置中心点坐标和地图级别
                    self.map.addOverlay(marker);                               //标记地图
                });                                                    // 将GPS坐标转化为百度地图的坐标
            });

            self.mapFrame.hide();

            var triggerName = self.intiFlag ? 'init' : 'loadData';
            self.selectTable.trigger(triggerName);
            self.selectedTable.trigger(triggerName);
            self.mapFrame.trigger(triggerName);
            self.intiFlag = false;

        };

        self.findSelectShopByCondition = function() {
            self.selectTable.jqGrid('setGridParam', {postData: {conditions: self.getSearchCondition()}});
            self.selectTable.trigger('reloadGrid');
            self.mapFrame.hide();
            self.mapPic.show();
        };


        self.findSelectShopByShopId = function (shop_id) {
            var shop;
            $.each(self.selectTable.getGridParam('userData'), function(i, shopData) {
                if(shopData.shop_id == shop_id) {shop = shopData}
            });
            return shop;
        };

        self.findSelectedShopByShopId = function (shop_id) {
            var shop;
            $.each(self.select.selectedShops, function(i, shopData) {
                if(shopData.shop_id == shop_id) {shop = shopData}
            });
            return shop;
        };

        self.getTemplate = function () {
            var result;
            $.ajax({
                async: false,
                url: '/shops/select_template',
                type: 'GET',
                data: null,
                error: function (req, err_info, e) {
                    showInfo(err_info);
                },
                success: function (data) {
                    result = data;
                }
            });
            self.container = $(result);
        };

        self.renderTemplate = function () {
            if (self.intiFlag) { self.getTemplate() }
            var dialog = bootbox.dialog({
                className: 'shop_select_box',
                message: self.container,
                title: i18n.view('shop_select', 'title'),
                buttons: {
                    "save": {
                        "label": "<i class='icon-ok'></i>" + i18n.action('save'),
                        "className": "btn btn-sm btn-success",
                        "callback": function (e) {
                            self.select.setValue();
                        }
                    },
                    "close": {
                        "label": "<i class='icon-reply'></i>" + i18n.action('cancel'),
                        "className": "btn-sm btn-primary"
                    }
                }
            });

            dialog.on("shown.bs.modal", function () {
                self.initTemplate();
            })
        };

        self.getSearchCondition = function () {
            var conditions = {};
            self.container.find('input[name],select[name]').each(function (i, ele) {
                var $ele = $(ele);
                conditions[$ele.attr('name')] = $ele.val()
            });
            return conditions;
        };

        self.findLocationInfo = function (url, callback) {
            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                error: function (req, err_info, e) {
                    showInfo(err_info);
                },
                success: function (data) {
                    callback(data);
                }
            });
        };
        self.renderTemplate();
    };


    var ShopView = function (select) {
        var self = this;

        self.select = select;
        self.selectedBtn = $("<button class='btn  btn-xs btn-info'>" + i18n.action('select') + "</button>");
        self.selectedTable = $("<table class='col-sm-12' id='only_table'></table>");
        self.selectedShops = [];

        self.select.$element.after(self.selectedTable);

        if(select.$element.attr('disabled') != 'disabled') {
            self.select.$element.after(self.selectedBtn);
        }

        self.selectedBtn.on('click', function () {
            self.select.showBox();
            return false;
        });

        self.selectedTable.jqGrid({
            jsonReader: {id: 'shop_id'},
            datatype: "local",
            height: 100,
            width: 300,
            data: [],
            colNames: ['标识符', '名称', '地址'],
            colModel: [
                {name: 'shop_code', width: 40},
                {name: 'shop_name', width: 40},
                {name: 'address', width: 70}
            ],
            viewrecords: true,
            rowNum: 1000,
            altRows: true,
            pgbuttons: false,
            pginput: false,
            hidegrid: false,

            multiselect: false,
            multiboxonly: false
        });

        self.refreshView = function() {
            if(self.select.$element.val() == "") {
                self.selectedBtn.next().hide();
            }else {
                self.selectedBtn.next().show();
            }
        };

        self.selectedTable.on('loadData', function (e, shops) {
            self.selectedShops = shops.map(function(shop, i) {
                shop.isSelected = true;
                return (new Shop(shop)).detail();
            });
            self.select.selectedShops = shops.map(function(shop, i) {
                shop.isSelected = true;
                return (new Shop(shop)).detail();
            });
            self.selectedTable.jqGrid('clearGridData');
            self.selectedTable.jqGrid('setGridParam', {data: shops});
            self.selectedTable.jqGrid().trigger('reloadGrid');
            self.refreshView();
        });

        if (self.select.$element.val() != "") {
            self.select.findShops({shop_ids: self.select.$element.val()}, function (shops) {
                self.selectedTable.trigger('loadData', [shops])
            }, function () {
            });
        }else {
            self.selectedTable.trigger('loadData', [[]])
        }

        self.select.$element.hide();
        self.refreshView();
    };


    $.fn.shopSelect = function (options) {
        this.each(function () {
            var $this = $(this);
            $this.data('shopSelect', new ShopSelect(this, $.extend({}, options, $this.data())));
        });
        return this;
    }

}(window.jQuery);