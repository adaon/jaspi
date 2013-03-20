var _ = require('underscore'),
    sha1 = require('sha1'),
    Class = require('../classes').Class,
    ListItem = require('../models').ListItem;

module.exports = new Class({
    
    // Interface ===============================================================
    
    setPassword: function (password) {
        var self = this;
        self.password = sha1(password);
    },
    
    checkPassword: function (password) {
        var self = this,
            password = sha1(password);
        return self.password === password;
    },
    
    // Realization =============================================================
    
    className: 'User',
    extends: ListItem,
});