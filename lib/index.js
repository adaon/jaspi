var self = exports;

self.classes = require('./classes');
self.debug = require('./debug');
self.models = require('./models');
self.auth = require('./auth');
self.server = require('./server');
self.project = require('./project');
//self.images = require('./images');
self.email = require('./email');

self.createApplication = self.project.createApplication;
self.createProject = self.project.createProject;

self.startProject = function (options) {
    var project = self.createProject(options);
    project.start();
    return project;
};

self.debug.logs.addLogger(new self.debug.logs.ConsoleLogger());