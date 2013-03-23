    // External Deopendencies
var _ = require('underscore'),
    // Internal Dependencies
    Sessions = require('./sessions'),
    debug = require('../debug'),
    // Shortcuts
    logs = debug.logs;

exports.sessions = function (url) {
    var info = {Method: 'auth.middleware.sessions'};
    
    // Params Check
    if (!(typeof url === 'string' && url.length > 0)) {
        logs.error('URL is undefined or null', info);
        return;
    }
    
    return function (request, callback) {
        var sessions = new Sessions(url),
            key = request.sessionKey;
        if (!key) {
            request.user = null;
            callback(request);
            return;
        }
        sessions.getUser(key, function (user) {
            request.user = user;
            callback(request);
        });
    }
};
