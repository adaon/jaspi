    // External Dependencies
var mongodb = require('mongodb'),
    _ = require('underscore'),
    // Internal Dependencies
    classes = require('../classes'),
    debug = require('../debug')
    ListItem = require('./listitem'),
    // Shortcuts
    Class = classes.Class,
    MongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID,
    logs = debug.logs,
    // Module vars
    handlers = {};

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (name, url) {
        var self = this,
            info = {Method: 'List.init'};
            
        // Param check
        if (!(typeof name === 'string' && name.length > 0)) {
            logs.error('Name is undefined or null!', info);
        }
        
        self.name = name || self.name;
        self.url = url || self.url;
        
        if (!(self.url.slice(0, 10) === 'mongodb://')) {
            logs.warning('URL must starts with "mongodb://"', info);
        }
    },
    
    on: function (event, handler) {
        var self = this,
            info = {Method: 'List.on'};
        
        // Param check
        if (!(typeof event === 'string' && event.length > 0)) {
            logs.error('Event name is undefined or null!', info);
            return;
        }
        if (!handler) {
            logs.error('Handler is undefined or null', info);
            return;
        }
        if (!(typeof handler === 'function')) {
            logs.error('Event handler must be a function', info);
            return;
        }
        
        handlers[self.name] = handlers[self.name] || {};
        handlers[self.name][event] = handlers[self.name][event] || [];
        handlers[self.name][event].push(handler);
    },
    
    setName: function (name) {
        var self = this,
            info = {Method: 'List.setName'};
        
        // Param check
        if (!(typeof name === 'string' && name.length > 0)) {
            logs.error('List name is undefined or null', info);
            return;
        }
        
        self.name = name;
        if (self.db) {
            self.coll = self.db.collection(self.name);
        }
    },
    
    add: function (item, callback) {
        var self = this,
            info = {Method: 'List.add'};
        
        // Param check
        if (!(typeof item === 'object')) {
            logs.error('Item must be an array or object', info);
            return;
        }
        
        callback = callback || function () {};
        self.connect(function () {
            if (Array.isArray(item)) {
                self.addItems(item, callback);
                return;
            }
            self.coll.insert(item, function (err, item) {
                if (err) {
                    return;
                }
                item = new ListItem(item[0], self);
                callback(item);
                self.emit('add', item);
            });
        });
    },
    
    get: function (options, callback) {
        var self = this,
            info = {Method: 'List.get'};
        
        // Params check
        if (!(typeof options === 'object')) {
            logs.error('Options must be an array or object', info);
            return;
        }
        if (!callback) {
            logs.warning('Callback is missing', info);
        }
        
        callback = callback || function () {};
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        self.connect(function () {
            var stream = self.coll.find(options).stream(),
                count = 0;
            stream.on('data', function (item) {
                var item = new ListItem(item, self);
                stream.destroy();
                callback(item);
                self.emit(item);
                count++;
            });
            stream.on('end', function () {
                if (count === 0) {
                    callback(null);
                    self.emit(null);
                }
            });
        });
    },
    
    filter: function (options, callback) {
        var self = this,
            info = {Method: 'List.filter'};
            
        // Params check
        if (!(typeof options === 'object')) {
            logs.error('Options must be an array or object', info);
            return;
        }
        if (!callback) {
            logs.warning('Callback is missing', info);
        }
        
        callback = callback || function () {};
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        self.connect(function () {
            self.coll.find(options).toArray(function (err, items) {
                var resultItems = [];
                _.each(items, function (item) {
                    resultItems.push(new ListItem(item, self));
                });
                callback(resultItems);
                self.emit('filter', resultItems);
            });
        });
    },
    
    all: function (callback) {
        var self = this,
            info = {Method: 'List.all'};
        
        if (!callback) {
            logs.warning('Callback is missing', info);
        }
        
        self.filter(callback);
    },
    
    each: function (options, callback) {
        var self = this,
            info = {Method: 'List.each'};
        
        callback = callback || function () {};
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        
        // Params check
        if (!(typeof options === 'object')) {
            logs.error('Options must be an array or object', info);
            return;
        }
        if (!callback) {
            logs.warning('Callback is missing', info);
        }
        
        self.connect(function () {
            var stream = self.coll.find(options).stream();
            stream.on('data', function (item) {
                var item = new ListItem(item, self);
                callback(item);
                self.emit('each', item);
            });
        });
    },
    
    empty: function (callback) {
        var self = this;
        callback = callback || function () {};
        self.connect(function () {
            self.coll.remove(function () {
                callback();
                self.emit('empty');
            });
        });
    },
    
    remove: function (item, callback) {
        var self = this;
        if (!(item._id instanceof ObjectID) && item._id) {
            item._id = new ObjectID(item._id);
        }
        callback = callback || function () {};
        self.connect(function () {
            self.coll.remove(item, function () {
                callback(item);
                self.emit('remove', item);
            });
        });
    },
    
    save: function (item, callback) {
        var self = this;
        if (item._id && !(item._id instanceof ObjectID)) {
            item._id = new ObjectID(item._id);
        }
        callback = callback || function () {};
        self.connect(function () {
            self.coll.save(item, function () {
                callback(item);
                self.emit('save', item);
            });
        });
    },
    
    // Realization =============================================================
    
    className: 'List',
    
    name: '',
    db: null,
    coll: null,
    url: 'mongodb://localhost/test',
    
    emit: function (event) {
        var self = this,
            args = _.toArray(arguments).slice(1);
        if (handlers[self.name] && handlers[self.name][event]) {
            _.each(handlers[self.name][event], function (handler) {
                handler.apply(self, args);
            });
        }
    },
    
    
    connect: function (callback) {
        var self = this,
            info = {Method: 'List.connect'};
        if (self.db) {
            callback();
            return;
        }
        MongoClient.connect(self.url, function(err, db) {
            if (err) {
                logs.error('DB Connection error', info);
                return;
            }
            self.db = db;
            self.coll = db.collection(self.name);
            callback();
        });
    },
    
    /*
    * Добавляет все объекты из переданного массива в список.
    */
    addItems: function (items, callback) {
        var self = this;
        callback = callback || function () {};
        self.connect(function () {
            var insertItems = [];
            _.each(items, function (item) {
                insertItems.push(item);
            });
            self.coll.insert(items, function (err, items) {
                var resultItems = [];
                _.each(items, function (item) {
                    resultItems.push(new ListItem(item, self));
                });
                callback(resultItems);
                self.emit('addItems', resultItems);
            });
        });
    }
});