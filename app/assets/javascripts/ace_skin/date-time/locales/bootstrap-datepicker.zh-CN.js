/**
 * Simplified Chinese translation for bootstrap-datepicker
 * Yuan Cheung <advanimal@gmail.com>
 */
;(function($){
    var local = i18n.config.views.date ;
    moment()._lang.set(local);
	$.fn.datepicker.dates['zh-CN'] = local;
}(jQuery));
