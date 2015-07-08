!function ($) {
    var i18n = function() {
        var self = this;

        self.set_config = function(config, locale) {
            self.config = config;
            self.locale = locale;
        };

        self.action = function(id) {
            var result;
            try{
               result =  self.config.actions[id]
            }catch(e){
                console.log("can't find the key: " + id + " in the actions")
            }
            return result
        };

        self.view = function(view, id) {
            var result;
            try{
                result =  self.config.views[view][id]
            }catch(e){
                console.log("can't find the key: " + id + " in the views :" + view)
            }
            return result
        };

    };

    window.i18n = new i18n()

}(window.jQuery);