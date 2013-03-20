var Class = require('../classes').Class,
    Logger = require('./logger');

module.exports = new Class({
    className: 'ConsoleLogger',
    extends: Logger,
    
    // Interface ===============================================================
    
    // Realization =============================================================
    
    write: function (text) {
        var self = this;
        console.log(text);
    },
});