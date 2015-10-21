!function ($) {
    $.jgrid = $.jgrid || {};
    $.extend($.jgrid, $.jgrid.locale[i18n.locale]);

    function jqGrid(grid, options) {
        var defaultOptions = {
            jsonReader: {id: "id"},
            datatype: "json",
            height: 350,
            forceFit: true,
            viewrecords: true,
            rowNum: 10,
            altRows: true,
            multiselect: true,
            multiboxonly: true,
            autowidth: true,
            searchBtn: false,
            loadtext: i18n.view('jg_grid', 'loadtext'),
            pagerBtns: [],
            export_btn: false,
            loadComplete: function (data) {
                var table = this;
                if($.trim(data.caption) != '') {
                    $(table).jqGrid("setCaption", data.caption);
                }
                setTimeout(function () {
                    updatePagerIcons(table);
                }, 0);
                $(this).extPlugins();
            }
        };
        if(options.filters != undefined) {
            options.postData = {filters: options.filters};
            options.search = true;
            options.showSearch = true;
        }
        options = $.extend({}, defaultOptions, options);
        if(options.export_btn) {
            options.pagerBtns.push(            {
                caption: i18n.view('jg_grid', 'export'),
                buttonicon: "icon-download-alt",
                onClickButton: function (e) {
                    var gridParam = $(grid).jqGrid('getGridParam');
                    var url = gridParam.url.replace('.json', '.xls');
                    var urlParams = [];
                    for(i in  gridParam.postData){ urlParams.push(i + '=' + gridParam.postData[i])};
                    urlParams = urlParams.join('&');
                    var real_url = [url, urlParams].join(url.indexOf('?') < 0  ? '?' : '&');
                    window.location.href = real_url;
                },
                title: i18n.action('export'),
                id: "download_btn"
            })
        }
        $(grid).jqGrid(options);
//        if(options.searchBtn) {
            navGrid(grid, options.pager, options);
//        }
        $(grid).on('ajaxSubmitComplete', function() {
            $(grid).trigger('reloadGrid');
        });

        if(options.filter != undefined) {
            try {
                window.search = new SearchPlugin($(grid), options.filter);
            }catch(e) {
                console.log('搜索插件加载失败, 请仔细检查配置');
            }
        }

        try {
            window.csv = new CsvPlugin($(grid));
        }catch(e) {
            console.log('csv导出插件加载失败, 请仔细检查配置');
        }

    }

    function navGrid(grid, pager, options) {
        $(grid).jqGrid('navGrid', pager,
            {
                edit: false,
                add: false,
                del: false,
                //search: (options.searchBtn || false),
                search: true,
                searchicon: 'icon-search orange',
                searchtext: location.query,
                refresh: false,
                view: false
            },
            {},
            {},
            {},
            {
                recreateForm: true,
                afterShowSearch: function (e) {
                    var form = $(e[0]);
                    form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
//                    style_search_form(form);
                },
                afterRedraw: function () {
//                    style_search_filters($(this));
                },
                multipleSearch: true,
                showOnLoad: options.showSearch
            },
            {},
            {}
        );
        $.each(options.pagerBtns, function(i, btnOption) {
            $(grid).navButtonAdd(pager, btnOption);
        })
    }

    function getSelecedIds(grid) {
        return $(grid).jqGrid("getGridParam", "selarrrow");
    }

    function updatePagerIcons(table) {
        var replacement =
        {
            'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev': 'icon-angle-left bigger-140',
            'ui-icon-seek-next': 'icon-angle-right bigger-140',
            'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        })
    }

    $.fn.defaultJqGrid = function (options) {
        this.each(function () {
            var $this = $(this);
            jqGrid($this, options);
        });
        return this;
    }

    $(document).on('reloadGrid', '.ui-jqgrid', function() {
        $(this).find('.ui-jqgrid-btable').trigger('reloadGrid');
    })



}(window.jQuery);