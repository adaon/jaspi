    // External Dependencies
var _ = require('underscore'),
    // Internal Dependencies
    Class = require('../classes').Class;

module.exports = new Class({
    
    // Interface ===============================================================
    
    /*
    * item - Объект, отображающий имена полей на значения.
    * list - Родительский объект List.
    */
    init: function (item, list) {
        var self = this;
        self.getList = function () {
            return list;
        };
        _.each(item, function (value, name) {
            if (typeof value !== 'function') {
                self[name] = value;
            }
        });
    },
    
    /*
    * Сохраняет объект.
    */
    save: function (callback) {
        var self = this;
        self.getList().save(self, callback);
    },
    
    /*
    * Удаляет объект из списка.
    */
    delete: function (callback) {
        var self = this;
        self.getList().remove(self, callback);
    },
    
    // Realization =============================================================
    
    className: 'ListItem',
    
});