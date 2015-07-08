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

            $.each(self.contentValues(), function(i, content) {

                var url = Content.accessibleUrl(content);

                var $a = $("<a href=" + url + "  data-rel='colorbox'></a>");

                var $img = $("<img src=" + url + " class='input-image'>");

                $a.append($img);
                $div.append($a);
            });
            self.$element.parent().append($div);
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