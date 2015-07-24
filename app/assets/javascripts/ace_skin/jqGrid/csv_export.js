CsvPlugin = function(table) {
    var self = this;
    self.$table = $(table);

    self.rowConfig = {};
    var gridParams = self.$table.jqGrid('getGridParam');
    $.each(gridParams.colModel, function(i, model) {
        if(model.name != 'cb') {
            self.rowConfig[model.name] = model.zh_name;
        }
    });

    self.init = function() {
        self.$table.parents('.ui-jqgrid').find('.ui-jqgrid-pager #export-btn').on('click', function() {
            self.export();
        })
        var $link = $('<a id="download" class="hide"></a>');
        self.$table.parents('.ui-jqgrid').find('.ui-jqgrid-pager #export-btn').after($link)

    };

    self.export = function() {
        self.getGridData(function(data) {
            var $link = $('#download');
            $link.attr('href', Csv.getUri(data));
            $link.attr('download', self.fileName());
            $link[0].click();
        });
    };

    self.fileName = function() {
        var gridParam = self.$table.jqGrid('getGridParam');
        return gridParam.caption + '_' +  (new Date()).getTime(); + '.csv'
    }

    self.getGridData = function(callback) {
        var gridParam = self.$table.jqGrid('getGridParam');
        var postData = gridParam.postData;
        postData.rows = 1000000;
        postData.page = 1;
        $.ajax({
            url: gridParam.url,
            data: postData,
            success: function(data) {
                callback(self.formatGridData(data));
            }
        })
    };

    self.formatGridData = function(jqGridData) {
        var csvArray = [];
        var $dom = $('<div></div>');
        csvArray.push($.map(self.rowConfig, function(name, index) {return name}));
        $.each(jqGridData.rows, function(i, row) {
            csvArray.push($.map(self.rowConfig, function(name, index) {return $dom.html(row[index]).text()}));
        });
        csvArray.push([], ['共计: ' + jqGridData.rows.length +' 条']);
        return csvArray;
    };
    self.init();

};
