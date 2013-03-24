var jaspi = require('./lib');

jaspi.debug.logs.setLogger(new jaspi.debug.logs.ConsoleLogger());

var project = new jaspi.project.Project();

project.addApplication(new jaspi.project.Application({
    url: '/chat/',
    handler: function (request, response, callback) {
        callback('This is chat!');
    }
}));

console.log(project.apps);

project.start();