    // External dependencies
var _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    wrench = require('wrench'),
    async = require('async'),
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
        self.slots = {};
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
    
    addMiddleware: function (mid) {
        var self = this,
            info = {Method: 'Project.addMiddleware'};
        
        // Params Check
        if (!(typeof mid === 'function')) {
            logs.error('Middleware is undefined or null', info);
            return;
        }
        
        self.middleware.push(mid);
    },
    
    start: function () {
        var self = this;
        self.addMiddleware(auth.middleware.sessions(self.dbURL));
        self._addPages();
        self.server.listen();
        self._setSlots();
    },
    
    addSlot: function (name, handler) {
        var self = this,
            info = {Method: 'Project.addSlot'};
        
        // Params Check
        if (!(typeof name === 'string' && name.length > 0)) {
            logs.error('Slot name is undefined or null', info);
            return;
        }
        if (!(typeof handler === 'function')) {
            logs.error('Slot handler is undefined or null', info);
            return;
        }
        
        self.slots[name] = handler;
    },
    
    // Realization =============================================================
    
    _addPages: function () {
        var self = this;
        _.each(self.apps, function (app) {
            self.server.addPage(app.url, app.handler);
        });
    },
    
    _setSlots: function () {
        var self = this;
        self.server.io.of('/jaspi').on('connection', function (socket) {
            
            _.each(self.apps, function (app) {
                _.each(app.slots, function (handler, name) {
                    name = app.url + '.slots.' + name;
                    socket.on(name, function (request, callback) {
                        request = request || {};
                        request.socket = socket;
                        self._applyMiddleware(request, function (request) {
                            handler(request, callback);
                        });
                    });
                });
                _.each(self.slots, function (handler, name) {
                    name = 'project.slots.' + name;
                    socket.on(name, function (request, callback) {
                        request = request || {};
                        request.socket = socket;
                        self._applyMiddleware(request, function (request) {
                            handler(request, callback);
                        });
                    });
                });
            });
        });
    },
    
    _applyMiddleware: function (request, callback) {
        var self = this,
            mids = [];
        _.each(self.middleware, function (mid) {
            mids.push(function (next) {
                mid(request, function (request) {
                    next(null, request);
                });
            });
        });
        async.series(mids, function (err) {
            if (err) { throw err; }
            callback(request);
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
    middleware: null,
    slots: null,
    
    server: null,    
});