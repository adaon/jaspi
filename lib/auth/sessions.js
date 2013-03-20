var _ = require('underscore'),
    sha1 = require('sha1');
    Class = require('../classes').Class,
    List = require('../models/list'),
    Users = require('./users');

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (url) {
        var self = this;
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
            };
        self.add(session, callback);
    },
    
    getUser: function (key, callback) {
        var self = this,
            users = new Users(self.url);
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
        var self = this;
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