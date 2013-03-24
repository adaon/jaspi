(function (exports, $) {
    
    exports.auth = new jaspi.views.View({
        
        // Interface
        
        login: function (callback) {
            var self = this;
            self.show('login');
            if (callback) {
                self.once('login', callback);
            }
        },
        
        register: function (callback) {
            var self = this;
            self.show('register');
            if (callback) {
                self.once('register', callback);
            }
        },
        
        hide: function (callback) {
            var self = this;
            callback = callback || function () {};
            $('.jaspi_auth_block').animate({
                top: -1000
            }, {
                duration: 700
            });
            $('.jaspi_auth_black').animate({
                opacity: 0
            }, {
                duration: 300,
                complete: function () {
                    self.elem.remove();
                    delete self.elem;
                    callback();
                }
            });
        },
        
        fields: [
            {
                name: 'username',
                label: 'Имя пользователя',
                type: 'text',
                example: 'example'
            },
            {
                name: 'email',
                label: 'E-mail',
                type: 'email',
                example: 'example@example.com'
            },
            {
                name: 'password1',
                label: 'Пароль',
                type: 'password',
                example: ''
            },
            {
                name: 'password2',
                label: 'Пароль (еще раз)',
                type: 'password',
                example: ''
            },
        ],
        
        // Realization
        
        hidable: true,
        
        centerBlock: function () {
            $('.jaspi_auth_block').css({
                left: ($(window).width() -
                    $('.jaspi_auth_block').width()) / 2 + 'px'
            });
        },
        
        show: function (type, callback) {
            var self = this,
                context = {};
            if (self.elem) {
                self.hide(function () {
                    self.show(type, callback);
                });
                return;
            }
            callback = callback || function () {};
            type = type || 'login';
            if (type === 'register') {
                context = {fields: self.fields};
            }
            jaspi.templates.get('/jaspi/templates/auth/' + type + '.html', function (t) {
                var elem = $(t(context));
                elem.hide();
                // Render
                $('.jaspi_auth_block').hide();
                $('.jaspi_auth_black').hide();
                $('body').append(elem);
                // CSS
                jaspi.css.load('/jaspi/css/auth.css', function (cssElem) {
                    self.centerBlock();
                    $('.jaspi_auth_black').fadeIn('fast');
                    $('.jaspi_auth_block').css({
                        position: 'relative',
                        top: '-1000px'
                    }).show().animate({
                        top: 50
                    }, {
                        duration: 700,
                        complete: function () {
                            callback();
                        }
                    });
                });
                // State
                self.elem = elem;
                // Events
                if (self.hidable) {
                    $('.jaspi_auth_block img').show();
                    $('.jaspi_auth_black').add('.jaspi_auth_block img').click(function () {
                        self.hide();
                    });
                } else {
                    $('.jaspi_auth_block img').hide();
                }
                $('.jaspi_auth_block .button').click(function () {
                    if (type === 'login') {
                        self.emit('login', {
                            username: $('.jaspi_auth_block .username_input').val(),
                            password: $('.jaspi_auth_block .password_input').val(),
                        });
                    }
                    if (type === 'register') {
                        var data = {};
                        _.each(self.fields, function (field) {
                            data[field.name] = $('.jaspi_auth_block .' + field.name + '_input').val();
                        });
                        self.emit('register', data);
                    }
                });
                $('.jaspi_auth_block input').keyup(function (event) {
                    if (event.which === 13) {
                        $('.jaspi_auth_block .button').click();
                    }
                });
                $(window).resize(function () {
                    self.centerBlock();
                });
            });
        }
        
    });
    
}(jaspi.views, jQuery));