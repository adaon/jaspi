    // External Dependencies
var f = require('util').format,
    _ = require('underscore'),
    fs = require('fs'),
    // Internal Dependencies
    classes = require('../classes'),
    // Shortcuts
    Class = classes.Class,
    self = exports;

self.INFO = 1;
self.WARNING = 2;
self.ERROR = 3;

var loggers = [];

self.setLogger = function (logger) {
    if (!logger.write) {
        console.log('debug.logs.setLogger: logger must have "write" method.');
    }
    loggers = [logger];
};

self.addLogger = function (logger) {
    if (!logger.write) {
        console.log('debug.logs.addLogger: logger must have "write" method.');
    }
    loggers.push(logger);
};

self.log = function (message, options) {
    options = options || {};
    var date = new Date(),
        level = options.level || 1,
        dateStr = f('%d.%d.%d %d:%d:%d',
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()),
        types = ['', 'Info', 'Warning', 'Error'],
        content = f('%s: %s\nDate: %s',
            types[level],
            message,
            dateStr);
    delete options.level;
    _.each(options, function (value, name) {
        content = content + '\n' + name + ': ' + value;
    });
    options.level = level;
    options.message = message;
    options.date = date;
    options.dateStr = dateStr;
    options.text = content;
    _.each(loggers, function (logger) {
        logger.write(options);
    });
};

self.info = function (message, options) {
    options = options || {};
    options.level = 1;
    self.log(message, options);
};

self.warning = function (message, options) {
    options = options || {};
    options.level = 2;
    self.log(message, options);
};

self.error = function (message, options) {
    options = options || {};
    options.level = 3;
    self.log(message, options);
};

self.ConsoleLogger = new Class({
    write: function (log) {
        console.log('==================================\n' + log.text);
    }
});

self.FileLogger = new Class({
    init: function (filename) {
        var self = this;
        self.filename = filename;
    },
    write: function (log) {
        var self = this;
        fs.appendFileSync(self.filename, '=====================\n' + log.text);
    },
});

self.CallbackLogger = new Class({
    init: function (callback) {
        var self = this;
        self.callback = callback;
    },
    write: function (log) {
        var self = this;
        self.callback(log);
    },
});