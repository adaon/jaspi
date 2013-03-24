    // External dependencies
var _ = require('underscore'),
    // Internal dependencies
    classes = require('../classes'),
    debug = require('../debug'),
    // Shortcuts
    Class = classes.Class,
    logs = debug.logs;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (settings) {
        var self = this;
        
        settings = settings || {};
        self.url = settings.url || '';
        self.handler = settings.handler || '';
        
        self.slots = {};
    },
    
    addSlot: function (name, handler) {
        var self = this,
            info = {Method: 'Application.addSlot'};
        // Params check
        if (!(typeof name === 'string' && name.length > 0)) {
            logs.error('Name is undefined or null', info);
            return;
        }
        if (!(typeof handler === 'function')) {
            logs.error('Handler must be a function', info);
        }
        self.slots[name] = handler;
    },
    
    // Realization =============================================================
    
    
    
});