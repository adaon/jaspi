var _ = require('underscore'),
    sha1 = require('sha1'),
    Class = require('../classes').Class,
    List = require('../models').List,
    User = require('./user'),
    auth_errors = require('./errors');

module.exports = new Class({
    
    // Interface ===============================================================
    
    register: function (user, callback) {
        var self = this;
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
        var self = this;
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
    
    init: function (url) {
        var self = this;
        self.name = 'auth_users';
        self.url = url;
    },
    
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