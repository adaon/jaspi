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