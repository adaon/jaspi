var _ = require('underscore'),
    Class = require('../classes').Class,
    email = require("emailjs");

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (options) {
        var self = this;
        self.from = options.from || self.from;
        self.password = options.password || self.password;
        self.to = options.to || self.to;
        self.subject = options.subject || self.subject;
        self.content = options.content || self.content;
        self.host = options.host || self.host;
        self.user = options.user || self.user;
    },
    
    send: function (to, callback) {
        var self = this;
        if (typeof to === 'function') {
            callback = to;
            to = undefined;
        }
        self.to = to || self.to;
        self.setServer();
        self.server.send({
            text: self.content, 
            from: self.from, 
            to: self.to,
            subject: self.subject
        }, callback);
    },
    
    // Realization =============================================================
    
    setServer: function () {
        var self = this;
        self.server = email.server.connect({
            user: self.getUser(),
            password: self.password, 
            host: self.host || 'smtp.' + self.from.split('@')[1].split('>')[0], 
            ssl: true
        });
    },
    
    getUser: function () {
        var self = this,
            from = self.from,
            user;
        if (from.indexOf('<') >=0) {
            user = from.split('<')[1].slice(0, -1);
        } else {
            user = from;
        }
        return self.user || user;
    },
    
    className: 'Message',
   
    from: '',
    password: '',
    host: null,
    to: '',
    subject: '',
    user: null,
    content: '',
    server: null
});