var Users = require('./users'),
    Sessions = require('./sessions'),
    logs = require('../debug').logs;

module.exports = {
    
    'auth.login': function (request, callback) {
        var dbURL = request.dbURL,
            username = request.username,
            password = request.password,
            users = new Users(dbURL),
            sessions = new Sessions(dbURL),
            info = {Slot: 'auth.login'};
        
        // Params Check
        if (!(typeof dbURL === 'string' && dbURL.length > 0)) {
            logs.error('dbURL is undefined or null', info);
            return;
        }
        if (!(typeof username === 'string' && username.length > 0)) {
            logs.error('Username is undefined or null', info);
            return;
        }
        if (!(typeof password === 'string' && password.length > 0)) {
            logs.error('Password is undefined or null', info);
            return;
        }
                
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
        var dbURL = request.dbURL,
            sessionKey = request.sessionKey,
            sessions = new Sessions(request.dbURL),
            info = {Slot: 'auth.logout'};
        
        // Params Check
        if (!(typeof dbURL === 'string' && dbURL.length > 0)) {
            logs.error('dbURL is undefined or null', info);
            return;
        }
        if (!(typeof sessionKey === 'string' && sessionKey.length > 0)) {
            logs.error('SessionKey is undefined or null', info);
            return;
        }
        
        sessions.end(request.sessionKey, callback);
    },
    
    'auth.auth': function (request, callback) {
        var dbURL = request.dbURL,
            sessionKey = request.sessionKey,
            sessions = new Sessions(request.dbURL),
            info = {Slot: 'auth.auth'};
            
        // Params Check
        if (!(typeof dbURL === 'string' && dbURL.length > 0)) {
            logs.error('dbURL is undefined or null', info);
            return;
        }
        if (!(typeof sessionKey === 'string' && sessionKey.length > 0)) {
            logs.error('sessionKey is undefined or null', info);
            return;
        }
        
        sessions.getUser(request.sessionKey, function (user) {
            callback(user);
        });
    },
    
    'auth.register': function (request, callback) {
        var dbURL = request.dbURL,
            data = request.data,
            users = new Users(request.dbURL),
            info = {Slot: 'auth.register'};
        
        // Params Check
        if (!(typeof dbURL === 'string' && dbURL.length > 0)) {
            logs.error('dbURL is undefined or null', info);
            return;
        }
        if (!(typeof data === 'object')) {
            logs.error('Data is undefined or null', info);
            return;
        }
        
        users.register(request.data, callback);
    },
};