var jaspi = jaspi || {};
jaspi.project = {};

(function (exports, $) {
    
    var self = exports,
        socket = io.connect('/jaspi'),
        middleware = [];
    
    self.callSlot = function (name, request, callback) {
        applyMiddleware(request);
        socket.emit('project.slots.' + name, request, callback);
    };
    
    self.addMiddleware = function (mid) {
        middleware.push(mid);
    };
    
    self.app = {
        
        url: location.pathname,
        
        callSlot: function (name, request, callback) {
            applyMiddleware(request);
            socket.emit(this.url + '.slots.' + name, request, callback);
        },
    };
    
    exports.addMiddleware(jaspi.auth.middleware.sessions);
    
    function applyMiddleware(request) {
        _.each(middleware, function (mid) {
            mid(request);
        });
    }
    
}(jaspi.project, jQuery));