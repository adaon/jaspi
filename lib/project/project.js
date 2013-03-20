    // External dependencies
var _ = require('underscore'),
    // Internal dependencies
    classes = require('../classes'),
    server = require('../server'),
    auth = require('../auth'),
    // Shortcuts
    Class = classes.Class,
    Server = server.Server;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (settings) {
        var self = this;
        settings = settings || {};
        self.setSettings(settings);
        self.server = new Server();
        self.server.staticDir = settings.staticDir || null;
        self.applications = {};
    },
    
    setSettings: function (settings) {
        var self = this;
        self.dbURL = settings.dbURL || self.dbURL;
    },
    
    start: function () {
        var self = this,
            server = self.server;
        _.each(self.applications, function (app, url) {
            server.addPage(url, app.template);
            _.each(app.slots, function (handler, name) {
                name = app.url + '.' + name;
                server.addSlot(name, handler);
            });
        });
        server.use(auth.middleware.sessions(self.dbURL));
        server.listen();
    },
    
    addApplication: function (application) {
        var self = this;
        self.applications[application.url] = application;
    },
    
    add: function (application) {
        this.addApplication(application);
    },
    
    // Realization =============================================================
    
    dbURL: 'mongodb://localhost/test',
    server: null,
    applications: null,
});