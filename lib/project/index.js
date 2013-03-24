var _ = require('underscore'),
    self = exports;

self.Application = require('./application');
self.Project = require('./project');

self.createApplication = function (options) {
    if (options instanceof self.Application) {
        return options;
    }
    var app = new self.Application({
        url: options.url,
        handler: options.handler
    });
    _.each(options.slots, function (handler, name) {
        addSlots(app, name, handler);
    });
    return app;
};

self.createProject = function (options) {
    if (options instanceof self.Project) {
        return options;
    }
    var project = new self.Project({
        staticDir: options.staticDir,
        dbURL: options.dbURL
    });
    _.each(options.apps, function (app, url) {
        if (url) {
            app.url = url;
        }
        project.addApplication(self.createApplication(app));
    });
    _.each(options.middleware, function (mid) {
        project.addMiddleware(mid);
    });
    _.each(options.slots, function (handler, name) {
        addSlots(project, name, handler);
    });
    return project;
};

function addSlots(app, name, handler) {
    if (typeof handler === 'function') {
        app.addSlot(name, handler);
        return;
    }
    if (typeof handler === 'object') {
        _.each(handler, function (h, n) {
            addSlots(app, name + '.' + n, h);
        });
    }
}