var jaspi = require('./lib');

jaspi.debug.logs.setLogger(new jaspi.debug.logs.ConsoleLogger());

var project = new jaspi.project.Project();

var chat = new jaspi.project.Application({
    url: '/chat/',
    handler: './index.html'
});

chat.addSlot('sum', function (request, callback) {
    callback(request.a + request.b);
});

project.addApplication(chat);

project.start();