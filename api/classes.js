var jaspi = jaspi || {};
jaspi.classes = {};

(function (exports) {
    function ClassMaker(props) {
        var self = this;
        self.constructor = function () {},
        self.fields = {};
        self.methods = {};
        self.staticFields = {};
        self.staticMethods = {};
        self.parents = [];
        self.extendible = true;
        self.className = '';
        // Действия
        self.loadProps(props);
    }

    ClassMaker.fn = ClassMaker.prototype;

    ClassMaker.fn.addParent = function (parent) {
        var self = this;
        if (!(typeof parent === 'function' || parent instanceof ClassMaker)) {
            throw new Error('Parent must be constructor or ClassMaker object');
        }
        if (parent.extensible === false) {
            throw new Error('Class "' + parent.className + '" is not extensible');
        }
        if (parent instanceof ClassMaker) {
            parent = parent.getClass();
        }
        self.parents.push(parent);
    };

    ClassMaker.fn.addParents = function (parents) {
        var self = this;
        if (!Array.isArray(parents)) {
            self.addParent(parents);
            return;
        }
        _.each(parents, function (parent) {
            self.addParent(parent);
        });
    };

    ClassMaker.fn.loadProps = function (props) {
        var self = this;
        _.each(props, function (prop, name) {
            if (name === 'className') {
                self.className = prop;
            }
            else if (name === 'extensible') {
                self.extensible = prop;
            }
            else if (name === 'static') {
                self.addStaticProps(prop);
            }
            else if (name === 'extends') {
                self.addParents(prop);
            }
            else if (name === 'init' && typeof prop === 'function') {
                self.constructor = prop;
            }
            else if (typeof prop === 'function') {
                self.methods[name] = prop;
            } else {
                self.fields[name] = prop;
            }
        });
    };

    ClassMaker.fn.addStaticProps = function (props) {
        var self = this;
        _.each(props, function (prop, name) {
            if (typeof prop === 'function') {
                self.staticMethods[name] = prop;
            } else {
                self.staticFields[name] = prop;
            }
        });
    };

    ClassMaker.fn.getConstructor = function () {
        var self = this;
        function C() {
            var instance = this,
                args = arguments;
            instance.super = instance.super || {};
            Object.defineProperty(instance, 'super', { enumerable: false });
            _.each(self.parents, function(Parent) {
                Parent.apply(instance, args);
                _.each(Parent.prototype, function (method, name) {
                    instance.super[name] = _.bind(method, instance);
                });
            });
            _.each(self.fields, function (value, name) {
                instance[name] = value;
            });
            self.constructor.apply(instance, arguments);
        }
        // 
        _.each(self.staticFields, function (value, name) {
            C[name] = value;
        });
        C.extensible = self.extensible;
        C.className = self.className;
        return C;
    };

    ClassMaker.fn.insertMethods = function (C) {
        var self = this;
        _.each(self.methods, function (method, name) {
            C.prototype[name] = method;
        });
    };

    ClassMaker.fn.insertStaticMethods = function (C) {
        var self = this;
        _.each(self.staticMethods, function (method, name) {
            C[name] = method;
        });
    };

    ClassMaker.fn.insertExtendMethods = function (C) {
        var self = this;
        _.each(self.parents, function (Parent) {
            _.each(Parent.prototype, function (method, name) {
                if (typeof method === 'function') {
                    C.prototype[name] = method;
                }
            });
        });
    };

    ClassMaker.fn.getClass = function () {
        var self = this,
            C = self.getConstructor();
        
        self.insertExtendMethods(C);
        self.insertMethods(C);
        self.insertStaticMethods(C);
        
        return C;
    };

    exports.createClass = function (props) {
        var classMaker = new ClassMaker(props);
        return classMaker.getClass();
    };

    exports.Class = exports.createClass;

    exports.ClassMaker = ClassMaker;
}(jaspi.classes));