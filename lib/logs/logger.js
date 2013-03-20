var Class = require('../classes').Class,
    f = require('util').format;

module.exports = new Class({
    className: 'Logger',
    
    // Interface ===============================================================
    
    setLevel: function (level) {
        var self = this;
        self.level = level;
    },
    
    log: function (message, level) {
        var self = this,
            now = new Date();
        level = level || 0;
        if (level >= self.level) {
            self.write(self.format(message));
        }
    },
    
    // Realization =============================================================
    
    level: 0,
    
    format: function (message) {
        var self = this,
            now = new Date(),
            date = f('%d:%d:%d %d.%d.%d',
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate());
        return f('%s: %s', date, message);
    },
});