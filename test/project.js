var test = require('tap').test,
    _ = require('underscore'),
    Application = require('../lib/project/application'),
    Project = require('../lib/project/project'),
    app,
    project,
    slots = {
        'slot1': function () {},
        'slot2': function () {}
    };

test('Application.init()', function (t) {
    app = new Application({
        url: '/app/',
        title: 'App',
        template: 'appTemplate',
        slots: _.clone(slots)
    });
    t.equivalent(app.url, '/app/');
    t.equivalent(app.title, 'App');
    t.equivalent(app.template, 'appTemplate');
    t.equivalent(app.slots, slots);
    t.end();
});

test('Application.addSlot()', function (t) {
    var handler = function () {};
    app.addSlot('slot3', handler);
    slots.slot3 = handler;
    t.equivalent(app.slots, slots);
    t.end();
});

test('Application.removeSlot()', function (t) {
    app.removeSlot('slot3');
    delete slots.slot3;
    t.equivalent(app.slots, slots);
    t.end();
});

test('Project.init()', function (t) {
    project = new Project({
        dbURL: 'dbTest'
    });
    t.equal(project.dbURL, 'dbTest');
    t.end();
});

test('Project.setSettings()', function (t) {
    project.setSettings({dbURL: 'newURL'});
    t.equal(project.dbURL, 'newURL');
    t.end();
});