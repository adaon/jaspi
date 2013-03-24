var jaspi = jaspi || {};
jaspi.views = {};

(function (exports, $) {
    
    var View = new jaspi.classes.Class({
        
        // Interface
        
        init: function (options) {
            var self = this;
            options = options || {};
            self.templates = {};
            
            if (options.templates) {
                _.each(options.templates, function (content, name) {
                    if (content.slice(0, 1) === '#' ||
                        content.slice(0, 1) === '.') {
                        content = $(content).html();
                    }
                    self.templates[name] = Handlebars.compile(content.trim());
                });
                delete options.templates;
            }
            
            if (options.starter) {
                $(_.bind(options.starter, self));
                delete options.starter;
            }
            
            _.each(options, function (value, name) {
                self[name] = value;
            });
        },
        
        // Realization
        
        templates: {},
        
        extends: jaspi.EventEmitter
        
    });

    exports.View = View;
    
}(jaspi.views, jQuery));