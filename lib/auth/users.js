    // Eternal Dependencies
var _ = require('underscore'),
    sha1 = require('sha1'),
    util = require('util');
    // Internal Dependencies
    classes = require('../classes'),
    User = require('./user'),
    models = require('../models'),
    auth_errors = require('./errors'),
    debug = require('../debug'),
    // Shortcuts
    Class = classes.Class,
    List = models.List,
    logs = debug.logs;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (url) {
        var self = this,
            info = {Method: 'Users.init'};
        
        // Params check
        if (!(typeof url === 'string' && url.length > 0)) {
            logs.error('URL is undefined or null', info);
            return;
        }
        
        self.name = 'auth_users';
        self.url = url;
    },
    
    register: function (user, callback) {
        var self = this,
            info = {Method: 'Users.register', User: user};
        // Params check
        if (!(typeof user.username === 'string' && user.username.length > 0)) {
            logs.error('Username is undefined or null', info);
            return
        }
        if (!(typeof user.password === 'string' ||
            (typeof user.password1 === 'string' &&
                typeof user.password2 === 'string'))) {
            logs.error('Password is undefined or null!', info);
            return;
        }
        
        callback = callback || function () {};
        self.checkUser(user, function (errors) {
            if (errors.length === 0) {
                user = new User(user);
                user.setPassword(user.password || user.password1);
                delete user.password1;
                delete user.password2;
                self.add(user, function (user) {
                    callback([], user);
                });
            } else {
                callback(errors);
            }
        });
    },
    
    getUser: function (username, password, callback) {
        var self = this,
            info = {Method: 'Users.getUser'};
        
        // Params check
        if (!(typeof username === 'string' && username.length > 0)) {
            logs.error('Username is undefined or null', info);
            return;
        }
        if (!(typeof password === 'string')) {
            logs.error('Password is undefined or null', info);
            return;
        }
        
        callback = callback || function () {};
        self.get({username: username}, function (user) {
            if (!user) {
                callback(null);
                return;
            }
            user = new User(user);
            if (user.checkPassword(password)) {
                callback(user);
            } else {
                callback(null);
            }
        });
    },
    
    // Realization =============================================================
    
    className: 'Users',
    extends: List,
    
    checkUser: function (user, callback) {
        var self = this,
            errors = [],
            username = user.username,
            password1 = user.password1 || user.password,
            password2 = user.password2 || user.password,
            email = user.email;
        if (username.length < 3) {
            errors.push(auth_errors.USERNAME_SHORT);
        }
        if (username.length > 30) {
            errors.push(auth_errors.USERNAME_LONG);
        }
        if (password1 !== password2) {
            errors.push(auth_errors.PASSWORDS_DIFF);
        }
        if (password1.length < 5) {
            errors.push(auth_errors.PASSWORD_SHORT);
        }
        if (password1.length > 30) {
            errors.push(auth_errors.PASSWORD_LONG);
        }
        self.get({username:username}, function (user) {
            if (user) {
                errors.push(auth_errors.USER_EXISTS);
            }
            if (email) {
                self.get({email:email}, function (user) {
                    if (user) {
                        errors.push(auth_errors.EMAIL_EXISTS);
                    }
                    callback(errors);
                });
            } else {
                callback(errors);
            }
        });
    },
});