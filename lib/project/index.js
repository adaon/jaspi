var _ = require('underscore');

exports.Application = require('./application');
exports.Project = require('./project');

exports.load = function (options) {
    var project = new exports.Project(options);
    _.each(options.apps, function (app, url) {
        app.url = url;
        project.add(new exports.Application(app));
    });
    return project;
};