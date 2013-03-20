    // External Dependencies
var mongodb = require('mongodb'),
    _ = require('underscore'),
    // Internal Dependencies
    classes = require('../classes'),
    logs = require('../logs'),
    ListItem = require('./listitem'),
    // Shortcuts
    Class = classes.Class,
    MongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID,
    logger = console,
    // Module vars
    handlers = {};

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (name, url) {
        var self = this;
        self.name = name || self.name;
        self.url = url || self.url;
    },
    
    on: function (event, handler) {
        var self = this;
        handlers[self.name] = handlers[self.name] || {};
        handlers[self.name][event] = handlers[self.name][event] || [];
        handlers[self.name][event].push(handler);
    },
    
    setName: function (name) {
        var self = this;
        self.name = name;
        if (self.db) {
            self.coll = self.db.collection(self.name);
        }
    },
    
    add: function (item, callback) {
        var self = this;
        callback = callback || function () {};
        self.connect(function () {
            if (Array.isArray(item)) {
                self.addItems(item, callback);
                return;
            }
            self.coll.insert(item, function (err, item) {
                if (err) {
                    logger.log(err);
                    return;
                }
                item = new ListItem(item[0], self);
                callback(item);
                self.emit('add', item);
            });
        });
    },
    
    get: function (options, callback) {
        var self = this;
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
        var self = this;
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
        var self = this;
        self.filter(callback);
    },
    
    each: function (options, callback) {
        var self = this;
        callback = callback || function () {};
        if (typeof options === 'function') {
            callback = options;
            options = {};
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
        var self = this;
        if (self.db) {
            callback();
            return;
        }
        MongoClient.connect(self.url, function(err, db) {
            if (err) {
                logger.log(err);
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