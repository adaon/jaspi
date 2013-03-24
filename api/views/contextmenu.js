(function (exports, $) {
    
    var ContextMenu = new jaspi.classes.Class({
        
        init: function () {
            var self = this;
            $(document).click(function () {
                _.defer(function () {
                    if (self.elem) {
                        self.elem.remove();
                        delete self.elem;
                    }
                });
            });
        },
        
        show: function (items, x, y) {
            var self = this;
            jaspi.templates.get('/jaspi/templates/contextmenu.html', function (t) {
                var elem = $(t({items: items}));
                elem.css({
                    left: x + 'px',
                    top: y + 'px'
                });
                jaspi.css.load('/jaspi/css/contextmenu.css', function () {
                    $('body').append(elem);
                });
                // State
                self.elem = elem;
                // Events
                self.elem.find('.item_block').click(function (event) {
                    var name = this.dataset.name;
                    _.each(items, function (item) {
                        if (name === item.name) {
                            item.callback = item.callback || item.handler || function () {};
                            item.callback();
                        }
                    });
                });
            });
        },
        
        extends: jaspi.views.View
        
    });

    exports.ContextMenu = ContextMenu;
    exports.contextMenu = new ContextMenu();
    
}(jaspi.views, jQuery));