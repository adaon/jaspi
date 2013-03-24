var jaspi = jaspi || {};
jaspi.auth = {};

(function (exports) {
    
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
        jaspi.project.callSlot('auth.login', {
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
        callback = callback || function () {};
        if (!sessionKey) {
            callback();
            return;
        }
        exports.removeSessionKey();
        jaspi.project.callSlot('auth.logout', {sessionKey: sessionKey}, callback);
    };
    
    exports.auth = function (callback) {
        var sessionKey = exports.getSessionKey();
        if (!sessionKey) {
            callback(null);
            return;
        }
        jaspi.project.callSlot('auth.auth', {sessionKey: sessionKey}, callback);
    };
    
    exports.register = function (user, callback) {
        jaspi.project.callSlot('auth.register', {data: user}, callback);
    };
    
    exports.middleware = {
        sessions: function (request) {
            request.sessionKey = exports.getSessionKey();
        }
    };
    
    /*exports.require = function (callback) {
        callback = callback || function () {};
        exports.auth(function (user) {
            if (user) {
                callback(user);
            } else {
                jaspi.views.auth.hidable = false;
                jaspi.views.auth.login();
                jaspi.views.auth.on('login', function (data) {
                    exports.login(data.username, data.password, function (user) {
                        if (user) {
                            jaspi.views.auth.hide(function () {
                                callback(user);
                            });
                        }
                    });
                });
            }
        });
    };*/
    
}(jaspi.auth));