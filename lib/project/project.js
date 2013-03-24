    // External dependencies
var _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    wrench = require('wrench'),
    // Internal dependencies
    classes = require('../classes'),
    server = require('../server'),
    debug = require('../debug'),
    auth = require('../auth'),
    Application = require('./application'),
    // Shortcuts
    Class = classes.Class,
    Server = server.Server,
    logs = debug.logs;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (settings) {
        var self = this;
        settings = settings || {};
        
        // Settings
        self.staticDir = settings.staticDir || self.staticDir;
        self.dbURL = settings.dbURL || self.dbURL;
        self.port = settings.port || self.port;
        
        self.server = new Server({
            staticDir: settings.staticDir,
            port: self.port
        });
        
        self.apps = {};
        self.middleware = [];
    },
    
    addApplication: function (app) {
        var self = this,
            info = {Method: 'Project.addApplcation'};
        
        // Params Check
        if (!(app instanceof Application)) {
            logs.error('app must to be an Application instance');
            return;
        }
        
        self.apps[app.url] = app;
    },
    
    start: function () {
        var self = this;
        self._addPages();
        self.server.listen();
    },
    
    // Realization =============================================================
    
    _addPages: function () {
        var self = this;
        _.each(self.apps, function (app) {
            self.server.addPage(app.url, app.handler);
        });
    },
    
    /*
    compileStatic: function (dirs) {
        var self = this,
            types = ['css', 'js', 'images'];
        _.each(dirs, function (dir) {
            var rootDir = path.dirname(require.main.filename),
                pathname = rootDir + '/' + dir;
            _.each(types, function (type) {
                var d = pathname + '/' + type;
                if (fs.existsSync(d)) {
                    try {
                        fs.mkdirSync(self.staticDir);
                    } catch(err) {}
                    try {
                        fs.mkdirSync(self.staticDir + '/' + dir);
                    } catch(err) {}
                    try {
                        fs.mkdirSync(self.staticDir + '/' + dir + '/' + type);
                    } catch(err) {}
                    wrench.copyDirSyncRecursive(d, self.staticDir + '/' + dir + '/' + type);
                }
            });
        });
    },
    
    loadProjectsFromDirs: function (dirs) {
        var self = this;
        self.compileStatic(dirs);
    },
    */
    
    // Settings
    staticDir: path.dirname(require.main.filename) + '/static',
    dbURL: null,
    port: 8000,
    
    apps: null,
    server: null,    
    middleware: null,
});