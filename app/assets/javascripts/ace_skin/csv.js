var Csv = (function() {
    var self = this;
    self.getUri = function(data) {
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(infoArray, index){
            dataString = infoArray.join(',');
            // 为了实现windows 系统下可以对表格进行正确地拆分, 需要在每行数据末尾添加一个','
            if(infoArray.length > 0) { dataString += ',' }
            csvContent += index < data.length ? dataString+ "\n" : dataString;

        });
        return encodeURI(csvContent);
    };
    return self;
} ());