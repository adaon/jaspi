var jaspi = jaspi || {};
jaspi.css = {};

(function (exports, $) {
    
    exports.load = function (url, callback) {
        callback = callback || function () {};
        $.get(url, function (content) {
            var elem = $('<style>');
            elem.html(content);
            $('head').append(elem);
            callback();
        });
    };
    
}(jaspi.css, jQuery));