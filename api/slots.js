var jaspi = jaspi || {};
jaspi.slots = {};

(function (exports) {
    
    var Class = jaspi.classes.Class,
        socket = io.connect('/jaspi');
    
    exports.call = function (name, request, callback) {
        if (typeof request === 'function') {
            callback = request;
            request = {};
        }
        if (typeof name !== 'string') {
            throw new RuntimeError('Slot name must be a string!');
        }
        callback = callback || function () {};
        request = request || {};
        request.sessionKey = jaspi.auth.getSessionKey();
        socket.emit(name, request, callback);
    };
    
}(jaspi.slots));