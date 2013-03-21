var Users = require('./users'),
    Sessions = require('./sessions');

module.exports = {
    
    'auth.login': function (request, callback) {
        var users = new Users(request.dbURL),
            sessions = new Sessions(request.dbURL);
        users.getUser(request.username, request.password, function (user) {
            if (!user) {
                callback(null);
                return;
            }
            sessions.create(user.username, function (session) {
                callback(user, session.key);
            });
        });
    },
    
    'auth.logout': function (request, callback) {
        var sessions = new Sessions(request.dbURL);
        sessions.end(request.sessionKey, callback);
    },
    
    'auth.auth': function (request, callback) {
        var sessions = new Sessions(request.dbURL);
        sessions.getUser(request.sessionKey, function (user) {
            callback(user);
        });
    },
    
    'auth.register': function (request, callback) {
        var users = new Users(request.dbURL);
        users.register(request.data, callback);
    },
};