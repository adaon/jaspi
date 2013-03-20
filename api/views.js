var jaspi = jaspi || {};

(function (exports) {
    
    exports.View = function (view) {
        var self = view;
        
        self.init = self.init || function () {};
        self.handlers = {};
        
        self.on = function (name, handler) {
            self.handlers[name] = self.handlers[name] || [];
            self.handlers[name].push(handler);
        };
        
        self.emit = function (name) {
            var args = _.toArray(arguments).slice(1);
            _.each(self.handlers[name], function (handler) {
                handler.apply(self, args);
            });
        }
        
        if (self.templates) {
            _.each(self.templates, function (content, name) {
                if (content.slice(0, 1) === '#' ||
                    content.slice(0, 1) === '.') {
                    content = $(content).html();
                }
                if (!content) {
                    delete self.templates[name];
                    return;
                }
                self.templates[name] = Handlebars.compile(content.trim());
            });
        }
        
        $(_.bind(self.init, self));
        
        return self;
    };
    
}(jaspi));