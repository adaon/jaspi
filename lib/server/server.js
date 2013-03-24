    // External Dependencies
var _ = require('underscore'),
    http = require('http'),
    connect = require('connect'),
    socketio = require('socket.io'),
    path = require('path'),
    fs = require('fs'),
    compressor = require('node-minify'),
    lessMiddleware = require('less-middleware'),
    // Internal Dependencies
    classes = require('../classes'),
    // Shortcuts
    Class = classes.Class,
    // Declarations
    Server,
    // Variables
    apiFiles = [
        '/api/lib/jquery.js',
        '/api/lib/underscore.js',
        '/api/lib/handlebars.js',
        '/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js',
        '/api/classes.js',
        '/api/eventemitter.js',
        '/api/views/views.js',
        '/api/views/auth.js',
        '/api/views/contextmenu.js',
        '/api/auth.js',
        '/api/templates.js',
        '/api/css.js',
        '/api/project.js',
    ];

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (options) {
        var self = this;
        options = options || {};
        
        self.staticDir = options.staticDir || self.staticDir;
        self.useLess = options.useLess || true;
        self.port = options.port || self.port;
        
        self.pages = {};
        self.middleware = [];
    },
    
    addPage: function (url, template) {
        var self = this,
            content = '',
            info = {Method: 'Server.addPage'};
        
        // Params check
        if (!(typeof url === 'string' && url.length > 0)) {
            logs.error('URL is undefined or null', info);
            return;
        }
        if (!template) {
            logs.error('Template is undefined or null', info);
            return;
        }
        
        if (typeof template !== 'function') {
            content = template;
            template = function (request, response, callback) {
                if (typeof content === 'string' &&
                    (content.slice(-5) === '.html' ||
                        content.slice(-4) === '.htm')) {
                    content = fs.readFileSync(content) + '';
                }
                callback(content);
            };
        }
        self.pages[url] = template;
    },
    
    use: function (handler) {
        var self = this,
            info = {Method: 'Server.use'};
        if (!(typeof handler === 'function')) {
            logs.log('Middleware function is undefined or null', info);
        }
        self.connectMiddleware.push(handler);
    },
    
    listen: function (port) {
        var self = this;
        self.port = port || self.port;
        
        self.setServers();
        self.compileJS();
        self.setConnectMiddleware();
        self.httpServer.listen(self.port);
        
        logs.info('Server started.');
    },
    
    // Realization =============================================================
    
    compileJS: function () {
        var self = this,
            files = [];
        _.each(apiFiles, function (file) {
            files.push(__dirname + '../../..' + file);
        });
        new compressor.minify({
            type: 'uglifyjs',
            fileIn: files,
            fileOut: __dirname + '../../../static/jaspi/js/jaspi.js',
            callback: function(err){
                if (err) {
                    logs.log(err.toString(), {Method: 'Server.compileJS'});
                }
            }
        });
    },
    
    setServers: function () {
        var self = this;
        self.connectServer = connect();
        self.httpServer = http.createServer(self.connectServer);
        self.io = socketio.listen(self.httpServer);
        self.io.set('log level', 0);
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
                fs.readFile(filename, function (err, data) {
                    callback(err || data + '');
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
    
    className: 'Server',
    
    pages: null,
    middleware: null,
    
    staticDir: null,
    port: 8000,
    
    connectServer: null,
    httpServer: null,
    io: null,
    
});