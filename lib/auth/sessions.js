    // External Dependencies
var _ = require('underscore'),
    sha1 = require('sha1'),
    // Internal Dependencies
    classes = require('../classes'),
    models = require('../models'),
    Users = require('./users'),
    debug = require('../debug'),
    // Shortcuts
    Class = classes.Class,
    List = models.List,
    logs = debug.logs;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (url) {
        var self = this,
            info = {Method: 'Sessions.init'};
        
        // Param check
        if (!(typeof url === 'string' && url.length > 0)) {
            logs.error('URL is undefined or null', info);
            return;
        }
        
        self.name = 'auth_sessions';
        self.url = url;
    },
    
    create: function (username, callback) {
        var self = this,
            now = new Date(),
            key = sha1(username + now.getTime()),
            session = {
                username: username,
                key: key,
                date: now
            },
            info = {Method: 'Sessions.create'};
        
        // Params check
        if (!(typeof username === 'string' && username.length > 0)) {
            logs.error('Username is undefined or null', info);
            return;
        }
        
        self.add(session, callback);
    },
    
    getUser: function (key, callback) {
        var self = this,
            users = new Users(self.url),
            info = {Method: 'Sessions.getUser'};
            
        // Params check
        if (!(typeof key === 'string' && key.length > 0)) {
            logs.error('Key is undefined or null', info);
            return;
        }
        if (!(typeof callback === 'function')) {
            logs.warning('Callback is missing', info);
        }
            
        self.get({key: key}, function (session) {
            if (!session) {
                callback(null);
                return;
            }
            if (session.username) {
                users.get({username: session.username}, callback);
            } else {
                callback(null);
            }
        });
    },
    
    end: function (key, callback) {
        var self = this,
            info = {Method: 'Sessions.end'};
        
        // Params check
        if(!(typeof key === 'string' && key.length > 0)) {
            logger.error('Key is undefined or null', info);
            return;
        }
        
        self.get({key: key}, function (session) {
            if (!session) {
                callback(null);
                return;
            }
            session.delete(callback);
        });
    },
    
    // Realization =============================================================
    
    className: 'Sessions',
    extends: List
    
});