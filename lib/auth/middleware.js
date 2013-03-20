var _ = require('underscore'),
    Sessions = require('./sessions');

exports.sessions = function (url) {
    return function (request, callback) {
        var sessions = new Sessions(url),
            key = request.sessionKey;
        if (!key) {
            request.user = null;
            callback(request);
        }
        sessions.getUser(key, function (user) {
            request.user = user;
            callback(request);
        });
    }
};
