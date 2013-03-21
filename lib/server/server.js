    // External Dependencies
var _ = require('underscore'),
    http = require('http'),
    connect = require('connect'),
    socketio = require('socket.io'),
    path = require('path'),
    async = require('async'),
    fs = require('fs'),
    compressor = require('node-minify'),
    lessMiddleware = require('less-middleware'),
    // Internal Dependencies
    classes = require('../classes'),
    // Shortcuts
    Class = classes.Class,
    // Declarations
    Server;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (options) {
        var self = this;
        options = options || {};
        self.pages = options.pages || {};
        self.staticDir = options.staticDir || self.staticDir;
        self.useLess = options.useLess || true;
        self.port = options.port || self.port;
        self.middleware = options.middleware || [];
        self.slots = options.slots || {};
        self.connectMiddleware = [];
    },
    
    addPage: function (name, content) {
        var self = this;
        self.pages[name] = content;
    },
    
    use: function (func) {
        var self = this;
        self.middleware.push(func);
    },
    
    addSlot: function (name, handler) {
        var self = this;
        self.slots[name] = handler;
    },
    
    addSlots: function (slots) {
        var self = this;
        _.each(slots, function (slot, name) {
            self.addSlot(name, slot);
        });
    },
    
    listen: function (port) {
        var self = this;
        self.port = port || self.port;
        self.setServers();
        
        self.compileStatic();
        self.setConnectMiddleware();
        
        self.httpServer.listen(self.port);
        self.setSlots();
    },
    
    addConnectMiddleware: function (handler) {
        var self = this;
        self.connectMiddleware.push(handler);
    },
    
    // Realization =============================================================
    
    compileStatic: function () {
        var self = this;
        new compressor.minify({
            type: 'uglifyjs',
            fileIn: [
                __dirname + '../../../api/lib/jquery.js',
                __dirname + '../../../api/lib/underscore.js',
                __dirname + '../../../api/lib/handlebars.js',
                __dirname + '../../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js',
                __dirname + '../../../api/classes.js',
                __dirname + '../../../api/slots.js',
                __dirname + '../../../api/views.js',
                __dirname + '../../../api/auth.js',
            ],
            fileOut: __dirname + '../../../static/js/lib/jaspi.js',
            callback: function(err){
                if (err) {
                    console.log(err);
                }
            }
        });
    },
    
    setServers: function () {
        var self = this;
        self.connectServer = connect();
        self.httpServer = http.createServer(self.connectServer);
        self.ioServer = socketio.listen(self.httpServer);
        self.ioServer.set('log level', 0);
    },
    
    setConnectMiddleware: function () {
        var self = this;
        if (self.staticDir) {
            if (self.useLess) {
                self.connectServer.use(lessMiddleware({
                    src: self.staticDir,
                    compress: true
                }));
            }
            self.connectServer.use(connect.static(self.staticDir));
        }
        self.connectServer.use(connect.static(__dirname + '../../../static'));
        _.each(self.connectMiddleware, function (handler) {
            self.connectServer.use(handler);
        });
        self.connectServer.use(_.bind(self.handleHTTPRequest, self));
    },
    
    handleHTTPRequest: function (request, response) {
        var self = this,
            path = request.url.split('?')[0],
            content,
            filename,
            code = 200;
        if (!(path.slice(-1) === '/')) {
            path += '/';
        }
        handler = self.pages[path];
        if (typeof handler === 'string' &&
           (handler.slice(-5) === '.html' || handler.slice(-4) === '.htm')) {
            filename = handler;
            handler = function (request, response, callback) {
                fs.readFile(filename, {encoding:'utf-8'}, function (err, data) {
                    callback(err || data);
                });
            };
        }
        if (typeof handler !== 'function') {
            content = handler;
            handler = function (request, response, callback) {
                callback(content);
            };
        }
        handler.call(self, request, response, function (content) {
            if (!content) {
                content = self.pages['404'] || 'Page not found.';
                code = 404;
            }
            response.writeHead(code, {'Content-Type': 'text/html'});
            response.end(content);
        });
    },
    
    setSlots: function () {
        var self = this;
        self.ioServer.of('/slots').on('connection', function (socket) {
            _.each(self.slots, function (handler, name) {
                socket.on(name, function (request, callback) {
                    request = request || {};
                    request.socket = socket;
                    
                    self.applyMiddleware(request, function (request) {
                        handler(request, callback);
                    });
                });
            });
        });
    },
    
    applyMiddleware: function (request, callback) {
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
    
    className: 'Server',
    
    pages: null,
    staticDir: null,
    port: 8000,
    
    connectMiddleware: null,
    middleware: null,
    slots: null,
    
    connectServer: null,
    httpServer: null,
    ioServer: null,
    
});