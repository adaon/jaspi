var jaspi = jaspi || {};
jaspi.templates = {};

(function (exports) {
    
    exports.get = function (url, callback) {
        callback = callback || function () {};
        $.get(url, function (content) {
            callback(Handlebars.compile(content));
        });
    };
    
}(jaspi.templates));