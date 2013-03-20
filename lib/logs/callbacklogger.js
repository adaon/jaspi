var Class = require('../classes').Class,
    Logger = require('./logger');

module.exports = new Class({
    className: 'CallbackLogger',
    extends: Logger,
    
    // Interface ===============================================================
    
    init: function (callback) {
        var self = this;
        self.callback = callback || self.callback;
    },
    
    // Realization =============================================================
    
    callback: function () {},
    
    write: function (text) {
        var self = this;
        self.callback(text);
    },
});