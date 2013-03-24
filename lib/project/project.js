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
        self.staticDir = settings.staticDir || path.dirname(require.main.filename) + '/static';
        self.dbURL = settings.dbURL || self.dbURL;
        
        self.server = new Server({
            statisDir: settings.staticDir
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
    
    // Realization =============================================================
    
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
    staticDir: null,
    dbURL: null,
    
    apps: null,
    server: null,    
    middleware: null,
});