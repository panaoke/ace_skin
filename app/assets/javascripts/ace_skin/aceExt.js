!function ($) {
    function datePick(element, options){
        var defaultOptions = {
            autoclose: true,
            language: 'zh-CN',
            format: 'yyyy/mm/dd',
            forceParse: 'yyyy/mm/dd',
            todayHighlight: true,
            weekStart: 1
        };
        $(element).datepicker($.extend({}, options, defaultOptions)).next().on(ace.click_event, function(){
            $(this).prev().focus();
        });
    }

    function timePicker(element, options) {
        var defaultOptions = {
            minuteStep: 1,
            showSeconds: false,
            showMeridian: false,
            validations: {">": '08:00:00', "<": '18:00:00'}
        };
        $(element).timepicker($.extend({},defaultOptions,  options)).next().on(ace.click_event, function(){
            $(this).prev().focus();
        });
    }

    function choosen(element, options) {
        var defaultOptions = {
            no_results_text: i18n.view('choosen', 'no_results_text')
        };
        $(element).chosen($.extend({}, defaultOptions,  options));
    }

    function shopSelect(element, options) {
        $(element).shopSelect(options);
    }

    function aceSpinner(element, options) {
        var defaultOptions = {
            touch_spinner: false,
            icon_up: 'icon-caret-up',
            icon_down: 'icon-caret-down',
            step: 1,
            value: $(element).val()
        };
        return $(element).ace_spinner($.extend({}, defaultOptions, options));
    }

    function dialog(options, target) {
        var result = "";
        var buttons = {};
        if($.trim(options.submitBtn) != '') {
            buttons.create = {
                "label": "<i class='icon-ok'></i>" + i18n.action('create'),
                "className": "btn-sm btn-success",
                callback: function(e) {
                    $(e.target).parents('.modal-content').find('form.simple_list_form').trigger('submit', function() {
                        $(target).trigger('reloadGrid')
                    });
                    return false;
                }
            }
        }
        if($.trim(options.updateBtn) != '') {
            buttons.create = {
                "label": "<i class='icon-ok'></i>" + i18n.action('update'),
                "className": "btn-sm btn-success",
                callback: function(e) {
                    $(e.target).parents('.modal-content').find('form.simple_list_form').trigger('submit', function() {
                        $(target).trigger('reloadGrid');
                    });
                    return false;
                }
            }
        }
        buttons.close = {
            "label": "<i class='icon-reply'></i>" + i18n.action('back'),
            "className": "btn-sm btn-primary"
        };

        $.ajax({
            headers: {
              WITHOUT_LAYOUT: 'true'
            },
            async: false,
            url: options.url,
            type: options.type || 'GET',
            data: options.data,
            error: function (req, err_info, e) {
//                showInfo(err_info);
                console.log(err_info);
            },
            success: function (data) {
                result = data;
                var modalDiv = $(data);
                var dialog = bootbox.dialog({
                    message: modalDiv,
                    title: options.title,
                    buttons: buttons
                });
                $(dialog).on('submitSuccess', function() {
                    $(dialog).modal('hide')
                })
            }
        });
    }

    function confirmDialog(ele) {
        var href = ele.attr('href'),
            method = ele.data('method') || ele.data('aceMethod'),
            target = ele.attr('target'),
            csrf_token = $('meta[name=csrf-token]').attr('content'),
            csrf_param = $('meta[name=csrf-param]').attr('content'),
            form = $('<form method="post" action="' + href + '"></form>'),
            metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

        if (ele.data('aceRemote')) {
            form.data('remote', ele.data('aceRemote'))
        }

        if (csrf_param !== undefined && csrf_token !== undefined) {
            metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
        }

        if (target) { form.attr('target', target); }

        form.hide().append(metadata_input).appendTo('body');

        bootbox.confirm($(ele).data("ace-confirm"), function(result){
            if(result) {
                $(ele).trigger('confirm');
            }else{
                $(ele).trigger('cancel');
            }
        });
    }

    function ajaxSubmit($ele, successCallBack, errorCallBack) {
        var type, url, data;
        if($ele[0].tagName == 'FORM') {
            type = $ele.attr('method');
            url =  $ele.attr('action');
            data = $ele.serialize() || {};
        }else if($ele[0].tagName == 'A') {
            type = $ele.data('type');
            url =  $ele.data('url');
            data = $ele.data('data') || {};
        }else {
            type = $ele.data('method');
            url =  $ele.data('url');
            data = $ele.data('data') || {};
        }
        data.authenticity_token = $('[name="authenticity_token"]').val();
        $.ajax({
            type: type,
            url: url,
            data: data,
            async: false,
            error: function(request) {
                if(typeof(errorCallBack) == 'function') {
                    errorCallBack(request);
                }

            },
            success: function(data) {
                if(typeof(successCallBack) == 'function') {
                    successCallBack(data);
                }
            },
            complete: function() {
                $ele.trigger('ajaxSubmitComplete');
            }
        });
    }

    function aceTab(ele) {
        this.$ele = ele;
        this.$targer = $(ele.attr("href"));
        this.options = ele.data();
        var self = this;
        $.ajax({
            async: false,
            url: self.options.url,
            type: 'GET',
            error: function (req, err_info, e) {
//                showInfo(err_info);
                console.log(err_info);
            },
            success: function (data) {
                result = data;
                var modalDiv = $(data);
                self.$targer.trigger('shown.bs.tab');
                self.$targer.html(modalDiv);
                self.$targer.trigger('loaded.bs.tab');
            }
        });
    }

    function aceColorBox($ele, options) {
        var defaultOptions = {
            reposition: true,
            scalePhotos: true,
            scrolling: false,
            previous: '<i class="icon-arrow-left"></i>',
            next: '<i class="icon-arrow-right"></i>',
            close: '&times;',
            current: '{current} of {total}',
            maxWidth: '100%',
            maxHeight: '100%',
            photo: true,
            onOpen: function () {
                document.body.style.overflow = 'hidden';
            },
            onClosed: function () {
                document.body.style.overflow = 'auto';
            },
            onComplete: function () {
                $.colorbox.resize();
            }
        };

        $ele.colorbox($.extend({}, defaultOptions, options));
    }

    function extPlugins(container) {
        $(container).find('select[data-toggle=choose]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            choosen($this, options)
        });

        $(container).find('select[data-toggle=multiple_choose]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            choosen($this, options)
        });

        $(container).find('input[data-toggle=calculate]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            $this.calculate(options);
        });

        $(container).find('input[data-toggle=integer]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            if($this.data('plugin') == undefined) {
                $this.data('plugin', aceSpinner($this, options));
            }
        });

        $(container).find('input[data-toggle=float]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            aceSpinner($this, options)
        });

        $(container).find('input[data-toggle=time]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            timePicker($this, options)
        });

        $(container).find('input[data-toggle=date]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            datePick($this, options)
        });

        $(container).find('input[data-toggle=shop_select]').each(function() {
            var $this = $(this);
            var options = $this.data() || {};
            shopSelect($this, options)
        });

        $(container).find('input[data-toggle=photo]').each(function() {
            $(this).photoFile();
        });

        $(container).find('input[data-toggle=position]').each(function () {
            $(this).acePosition();
        });

        $(container).find('[data-toggle=position]').each(function () {
            $(this).aceDivPosition();
        });

        $(container).find('[data-rel="colorbox"]').each(function () {
            $(this).aceColorBox();
        });

        $(container).find('[data-toggle="rich_text"]').each(function () {
            $(this).ace_wysiwyg({
                toolbar: [
                    {name: 'font', title: i18n.view('rich_text', 'font')},
                    null,
                    {name: 'fontSize', title: i18n.view('rich_text', 'fontSize'), values: {5:' 5', 3:' 3', 1:' 1'}},
                    null,
                    {name: 'bold', className: 'btn-info',title: i18n.view('rich_text', 'bold') },
                    {name: 'italic', className: 'btn-info', title: i18n.view('rich_text', 'italic') },
                    {name: 'strikethrough', className: 'btn-info', title:i18n.view('rich_text', 'strikethrough') },
                    {name: 'underline', className: 'btn-info', title: i18n.view('rich_text', 'underline') },
                    null,
                    {name: 'insertunorderedlist', className: 'btn-success' , title: i18n.view('rich_text', 'insertunorderedlist') },
                    {name: 'insertorderedlist', className: 'btn-success', title: i18n.view('rich_text', 'insertorderedlist') },
                    {name: 'outdent', className: 'btn-purple', title: i18n.view('rich_text', 'outdent') },
                    {name: 'indent', className: 'btn-purple', title: i18n.view('rich_text', 'indent') },
                    null,
                    {name: 'justifyleft', className: 'btn-primary', title: i18n.view('rich_text', 'justifyleft') },
                    {name: 'justifycenter', className: 'btn-primary', title: i18n.view('rich_text', 'justifycenter') },
                    {name: 'justifyright', className: 'btn-primary', title: i18n.view('rich_text', 'justifyright') },
                    {name: 'justifyfull', className: 'btn-inverse', title: i18n.view('rich_text', 'justifyfull') },
                    null,
                    {name: 'foreColor',title: i18n.view('rich_text', 'foreColor') },
                    null,
                    {name: 'insertImage',
                        title: i18n.view('rich_text', 'insertImage'),
                        placeholder: i18n.view('rich_text', 'imageUrlPlaceholder'),
                        button_insert: i18n.view('rich_text', 'insertImage'),
                        button_text: i18n.view('rich_text', 'selectImage')
                    },
                    null,
                    {name: 'undo', className: 'btn-grey', title: i18n.view('rich_text', 'undo') },
                    {name: 'redo', className: 'btn-grey', title: i18n.view('rich_text', 'redo') },
                    null,
                    {name: 'viewSource', title: i18n.view('rich_text', 'viewSource') }
                ],
                'wysiwyg': {
                    fileUploadError: function () {
                    }
                }
            }).prev().addClass('wysiwyg-style2');
        });
    }


    $.fn.extPlugins = function () {
        extPlugins($(this));
    };

    $.fn.aceColorBox = function () {
        aceColorBox($(this), $(this).options);
    };

    $.fn.ajaxSubmit = function (successCallBack, errorCallBack) {
        ajaxSubmit($(this), successCallBack, errorCallBack);
    };


    $(document).on('click', '[data-toggle="dialog"]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $ele = $(e.target);
        var options = $.extend(
            {title: $ele.data('title'), url: $ele.data('url'), data: $ele.data('data'), type: $ele.data('type')},
            $ele.data());
        dialog(options, $ele);
        return false;
    });

    $(document).on('click', '[data-ace-confirm]', function (e) {
        e.preventDefault();
        var $ele = $(e.target);
        confirmDialog($ele);
        return false;
    });

    $(document).on('confirm', '[data-ace-confirm]', function (e) {
        e.preventDefault();
        var $ele = $(e.target);
        ajaxSubmit($ele)
    });


    $(document).on('click', '[data-toggle="ace_tab"]', function (e) {
        e.preventDefault();
        $(this).tab('show');
        var $ele = $(e.target);
        aceTab($ele);
//        $('#underling_plans').trigger('shown.bs.tab')`
    })

    $(document).on('click', '[data-toggle="colorbox"]', function (e) {
        e.stopPropagation();
        var $dom = $(e.target);
        var option = {close: 'x', maxWidth: '95%', maxHeight: '95%'};
        var url, title;
        if(e.target.tagName == 'IMG') {
            url = $dom.attr('src');
            option.photo = true;
        }else {
            url = $dom.data('url');
        }
        title =  $dom.data('title');
        option.href = url;
        option.title = title;
        $.colorbox(option);
    });

    AceExt = {
        dialog: dialog,
        confirmDialog: confirmDialog
    };

}(window.jQuery);