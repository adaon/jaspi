var Class = require('../classes').Class,
    Logger = require('./logger'),
    fs = require('fs');

module.exports = new Class({
    className: 'FileLogger',
    extends: Logger,
    
    // Interface ===============================================================
    
    init: function (filename) {
        var self = this;
        self.filename = filename || self.filename;
    },
    
    // Realization =============================================================
    
    filename: __dirname + '/logs.txt',
    
    write: function (text) {
        var self = this;
        fs.appendFileSync(self.filename, text + '\n', 'utf-8');
    }
});