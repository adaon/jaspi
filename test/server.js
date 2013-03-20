var test = require('tap').test,
    _ = require('underscore'),
    Server = require('../lib/server/server'),
    server,
    pages = {
        'page1': 'page1content',
        'page2': function () { return 'page2content'; },
    },
    staticDir = __dirname + '/static',
    port = 8080,
    middleware = [
        function (request, callback) {
            request.a = 1;
            callback(request);
        },
        function (request, callback) {
            request.b = 2;
            callback(request);
        }
    ],
    slots = {
        'slot1': function (request, callback) {
            callback(request.a);
        },
        'slot2': function (request, callback) {
            callback(request.b);
        }
    };

test('Server init', function (t) {
    server = new Server({
        pages: _.clone(pages),
        staticDir: staticDir,
        port: port,
        middleware: _.clone(middleware),
        slots: _.clone(slots)
    });
    t.equivalent(server.pages, pages);
    t.equivalent(server.staticDir, staticDir);
    t.equivalent(server.port, port);
    t.equivalent(server.middleware, middleware);
    t.equivalent(server.slots, slots);
    t.end();
});

test('Server.addPage()', function (t) {
    var page3 = 'page3content',
        page4 = function () { return 'page4content'; };
    pages.page3 = page3;
    pages.page4 = page4;
    server.addPage('page3', page3);
    server.addPage('page4', page4);
    t.equivalent(server.pages, pages);
    t.end();
});

test('Server.use()', function (t) {
    var mid = function () {};
    middleware.push(mid);
    server.use(mid);
    t.equivalent(server.middleware, middleware);
    t.end();
});

test('Server.addSlot()', function (t) {
    var slot = function () {};
    slots['slot3'] = slot;
    server.addSlot('slot3', slot);
    t.equivalent(server.slots, slots);
    t.end();
});