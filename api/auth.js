var jaspi = jaspi || {};
jaspi.auth = {};

(function (exports) {
    
    var slots = jaspi.slots;
    
    exports.getSessionKey = function () {
        return localStorage.getItem('jaspi.auth.sessionKey');
    };
    
    exports.setSessionKey = function (sessionKey) {
        localStorage.setItem('jaspi.auth.sessionKey', sessionKey);
    };
    
    exports.removeSessionKey = function (sessionKey) {
        localStorage.removeItem('jaspi.auth.sessionKey');
    };
        
    exports.login = function (username, password, callback) {
        slots.call('auth.login', {
            username: username,
            password: password
        }, function (user, sessionKey) {
            if (user && sessionKey) {
                exports.setSessionKey(sessionKey);
                callback(user);
            }
        });
    };
    
    exports.logout = function (callback) {
        var sessionKey = exports.getSessionKey();
        if (!sessionKey) {
            callback();
            return;
        }
        exports.removeSessionKey();
        slots.call('auth.logout', {sessionKey: sessionKey}, callback);
    };
    
    exports.auth = function (callback) {
        var sessionKey = exports.getSessionKey();
        if (!sessionKey) {
            callback(null);
        }
        slots.call('auth.auth', {sessionKey: sessionKey}, callback);
    };
    
    exports.register = function (user, callback) {
        slots.call('auth.register', {data: user}, callback);
    };
    
}(jaspi.auth));