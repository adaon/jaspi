exports.classes = require('./classes');
exports.debug = require('./debug');
exports.models = require('./models');
exports.auth = require('./auth');
exports.server = require('./server');
exports.project = require('./project');
//exports.images = require('./images');
exports.email = require('./email');

exports.startProject = function (options) {
    var project = exports.project.load(options);
    project.start();
    return project;
};