exports.ClassMaker = require('./classmaker');

exports.createClass = function (props) {
    var classMaker = new exports.ClassMaker(props);
    return classMaker.getClass();
};

exports.Class = exports.createClass;