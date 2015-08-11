SearchPlugin = function(table, options) {
    var self = this;
    self.$table = $(table);
    self.$dom = $('<div class="search-panel" style="display: none"></div>');

    var supportSymbol = {
        '$eq': {
            label: '等于'
        },
        '$gt': {
            label: '大于'
        },
        '$gte': {
            label: '大于等于'
        },
        '$lt': {
            label: '小于'
        },
        '$lte': {
            label: '小于等于'
        },
        '$ne': {
            label: '不等于'
        },
        '$in': {
            label: '包含'
        },
        '$nin': {
            label: '不包含'
        },
        '$like': {
            label: '类似'
        },
        '$exists': {
            label: '存在'
        },
        '$nexists': {
            label: '不存在'
        }
    };

    var defaultSupportSymbol = {
        integer: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$exists', '$nexists'],
        float: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$exists', '$nexists'],
        text: ['$eq', '$like', '$ne', '$exists', '$nexists'],
        string: ['$eq', '$like', '$ne', '$exists', '$nexists'],
        date: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$exists', '$nexists'],
        time: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$exists', '$nexists'],
        datetime: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$exists', '$nexists'],
        choose: ['$in', '$nin', '$exists', '$nexists']
    }

    self.init = function() {


        var $btns = $('<div class="btn-group"></div>');

        var $addBtn = $('<div class="btn btn-success"><i class="icon-plus"></i>添加</div>');

        $addBtn.on('click', function() {
            self.filters.push(self.defaultFilter);
            self.refresh();
        });

        var $restBtn = $('<div class="btn btn-danger"><i class="icon-rotate-left"></i>重置</div>');

        $restBtn.on('click', function() {
            self.filters = [self.defaultFilter];
            self.refresh();
        });

        var $searchBtn = $('<div class="btn btn-info"><i class="icon-search"></i>搜索</div>');

        $searchBtn.on('click', function() {
            self.refreshRequestParams();
        });

        $btns.append($addBtn).append($restBtn).append($searchBtn);

        self.$filter = $('<div class="search-filter row"></div>');

        self.$dom.append($btns);
        self.$dom.append(self.$filter);
        self.$table.parents('.ui-jqgrid-view').before(self.$dom);

        self.refresh();

        self.$table.parents('.ui-jqgrid').find('.ui-jqgrid-pager #search-btn').on('click', function() {
            self.$dom.toggle(500)
        })

    };

    self.findSymbolsByCode = function(code) {
        var config = self.options.filterConfig[code];
        return self.options.filterConfig[code].symbols || defaultSupportSymbol[config.type];
    };

    options.filterConfig = options.filterConfig || {};

    self.options = options;

    var getDefaultFilter = false;
    $.each(self.options.filterConfig, function(code, config) {
        if(!getDefaultFilter) {
            self.defaultFilter = {
                code: code,
                symbol: self.findSymbolsByCode(code)[0]
            };
            getDefaultFilter = true;
        }
    })

    self.filters = self.options.filters || [self.defaultFilter];

    self.formatFilterKey = function(symbol, code) {
        if(code.indexOf('.') >= 0) {
            relationClass = code.split('.')[0];
            field = code.split('.')[1];
            return relationClass + '.' + symbol + '_' + field;
        }else {
            return symbol + '_' + code;
        }
    };

    self.refreshRequestParams = function() {
        var conditions = $.map(self.fetchFilters(), function(filter, i) {
            condition = {};
            condition[self.formatFilterKey(filter.symbol,filter.code)] = filter.value;
            return condition;
        });
        self.$table.jqGrid("setGridParam", {postData: {conditions: JSON.stringify(conditions)}}).trigger("reloadGrid", [{page:1}]);
    };

    self.fetchFilters = function() {
        self.filters = $.map(self.$filter.find('.filter'), function(filter, i) {
            var $filter = $(filter);
            var code = $filter.find('.filter-code select').val();
            var config = self.options.filterConfig[code];
            var value;
            if(config.type == 'choose') {
                value = $filter.find('.filter-value select').val()
            }else {
                value = $filter.find('.filter-value input').val()
            }
            return {
                code: code,
                symbol: $filter.find('.filter-symbol select').val(),
                value: value
            }
        });
        return self.filters;
    };

    self.refresh = function() {
        self.$filter.html('');
        $.each(self.filters, function(i, filter) {
            self.$filter.append(self.filterBuild(i, filter))
        });
        self.$filter.find('.filter-code').on('change', function() {
            self.fetchFilters();
            self.refresh();
        });
        self.$filter.find('.close').on('click', function() {
            if(self.filters.length > 1) {
                $(this).parents('.filter').remove();
                self.fetchFilters();
            }
        })
    };

    self.filterBuild = function(i, filter) {
        code = filter.code;
        var $filter = $('<div class="filter col-md-4"></div>');
        $filter.data('index', i);
        $filter.append(self.filterCodeBuild(code));
        $filter.append(self.filterSymbolBuild(code, filter.symbol));
        $filter.append(self.filterValueBuild(code, filter.value));

        $filter.append($('<div class="close"><i class=" icon-remove"></i></div>'));

        $filter.extPlugins();
        return $filter;
    };

    self.filterValueBuild = function(code, value) {
        var config = self.options.filterConfig[code];
        var $panel = $('<div class="filter-value col-md-4"></div>');
        if(config.type == 'choose') {
            return $panel.append(self.buildChoose(config.collection, value));
        }else {
            var $input = $('<input>');
            $input.attr('data-toggle', config.type);
            $input.val(value);
            return $panel.append($input)
        }
    };

    self.filterSymbolBuild = function(code, symbol) {
        var symbols = self.findSymbolsByCode(code);
        var $panel = $('<div class="filter-symbol col-md-3"></div>');
        var options = {};
        $.each(symbols, function(i, sym) {
            var config = supportSymbol[sym];
            if(config == undefined) { return; }

            options[sym] = config.label;
        });

        return $panel.append(self.buildChoose(options, symbol))
    };

    self.filterCodeBuild = function(code) {
        var $panel = $('<div class="filter-code col-md-5"></div>');
        var options = {};
        $.each(self.options.filterConfig, function(c, config) {
            options[c] = config.name;
        });

        var $selectPanel = self.buildChoose(options, code);
        return $panel.append($selectPanel)
    };

    self.buildChoose = function(options, value, type) {
        var $select = $('<select data-toggle="choose"></select>');
        $.each(options, function(key, code) {
            if(code == undefined) { return }
            var option = $('<option></option>');
            option.val(key);
            option.html(code);
            if(key == value) { option.attr('selected', 'selected')}
            $select.append(option)
        });
        return $select;
    }

    self.init();

};
