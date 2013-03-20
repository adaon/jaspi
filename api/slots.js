var jaspi = jaspi || {};
jaspi.slots = {};

(function (exports) {
    
    var Class = jaspi.classes.Class,
        socket = io.connect('/slots');
        
    exports.Application = new Class({
        
        // Interface ===========================================================
        
        init: function (url) {
            var self = this;
            self.url = url;
        },
        
        call: function (name, request, callback) {
            var self = this;
            name = self.url + '.' + name;
            exports.call(name, request, callback);
        },
        
        on: function (name, handler) {
            socket.on(name, handler);
        },
        
        // Realization =========================================================
        
    });
    
    exports.call = function (name, request, callback) {
        if (typeof request === 'function') {
            callback = request;
            request = {};
        }
        if (typeof name !== 'string') {
            throw new RuntimeError('Slot name must be a string!');
        }
        callback = callback || function () {};
        socket.emit(name, request, callback);
    };
    
    exports.app = function () {
        var url = location.pathname;
        return new exports.Application(url);
    };
    
}(jaspi.slots));