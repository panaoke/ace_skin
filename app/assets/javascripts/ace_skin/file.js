!function ($) {
    var location = {
        no_results_text: '未找到此选项!',
        back: '返回'
    };

    var AceFile = function($ele, options) {
        var self = this;
        self.$element = $ele;
        self.options = options;

        self.contentValues = function() {
            return self.$element.val().split(';').delete_blank();
        };

        self.init = function() {
            var fileType = self.options.fileType;
            fileType = fileType.substring(0,1).toUpperCase() + fileType.substring(1);
            self['init'+ fileType]();
            self.$element.data('ace-file', self);
        };

        self.initPhoto = function() {
            var $div = $("<div class='ace-thumbnails'></div>");

            //$.each(self.contentValues(), function(i, url) {
            //
            //    var $a = $("<a href=" + url + "  data-rel='colorbox'></a>");
            //
            //    var $img = $("<img src=" + url + " class='input-image'>");
            //
            //    $a.append($img);
            //    $div.append($a);
            //});
            var fileInput = $('<input type="file" name="ace_file">');
            fileInput.data('urls', self.$element.val());
            self.$element.parent().append(fileInput);
            fileInput.ace_file_input({
                style:'well',
                btn_choose:'点击或拖动文件上传',
                btn_change: '点击或拖动文件上传',
                no_icon:'ace-icon fa fa-cloud-upload',
                droppable: true,
                thumbnail:'small'//large | fit
                //,icon_remove:null//set null, to hide remove/reset button
                /**,before_change:function(files, dropped) {
						//Check an example below
						//or examples/file-upload.html
						return true;
					}*/
                /**,before_remove : function() {
						return true;
					}*/
                ,
                preview_error : function(filename, error_code) {
                    //name of the file that failed
                    //error_code values
                    //1 = 'FILE_LOAD_FAILED',
                    //2 = 'IMAGE_LOAD_FAILED',
                    //3 = 'THUMBNAIL_FAILED'
                    //alert(error_code);
                }

            }).on('changeUrl', function(){
                self.$element.val(fileInput.data('urls'))
            });
            //self.$element.parent().append($div);

        };

        self.init();
    }

    $.fn.photoFile = function () {
        var defaultOptions = {
            fileType: 'photo'
        };
        new AceFile($(this),$.extend({}, defaultOptions, $(this).data()));
    };

}(window.jQuery);