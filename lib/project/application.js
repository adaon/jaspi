    // External dependencies
var _ = require('underscore'),
    // Internal dependencies
    classes = require('../classes'),
    // Shortcuts
    Class = classes.Class;

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (options) {
        var self = this;
        self.url = options.url || self.url;
        self.title = options.title || self.title;
        self.template = options.template || self.template;
        self.slots = options.slots || {};
    },
    
    addSlot: function (name, handler) {
        var self = this;
        self.slots[name] = handler;
    },
    
    removeSlot: function (name) {
        var self = this;
        delete self.slots[name];
    },
    
    // Realization =============================================================
    
    url: '/',
    title: '',
    template: '',
    slots: null
    
});