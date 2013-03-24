var jaspi = jaspi || {};

(function (exports, $) {
    
    var EventEmitter = new jaspi.classes.Class({
        
        init: function () {
            var self = this;
            self.handlers = {};
        },
        
        on: function (name, handler) {
            var self = this;
            self.handlers[name] = self.handlers[name] || [];
            self.handlers[name].push(handler);
        },
        
        once: function (name, handler) {
            var self = this;
            self.handlers[name] = self.handlers[name] || [];
            self.handlers[name].push(function () {
                handler.apply(self, _.toArray(arguments));
                self.handlers[name].splice(self.handlers[name].indexOf(handler), 1);
            });
        },
        
        emit: function (name) {
            var self = this,
                args = _.toArray(arguments).slice(1);
            _.each(self.handlers[name], function (handler) {
                handler.apply(self, args);
            });
        },
        
        handlers: null,
        
    });
    
    exports.EventEmitter = EventEmitter;
    
}(jaspi, jQuery));