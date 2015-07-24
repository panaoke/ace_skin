var Csv = (function() {
    var self = this;
    self.getUri = function(data) {
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(infoArray, index){
            dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString+ "\n" : dataString;

        });
        return encodeURI(csvContent);
    };
    return self;
} ());