var test = require('tap').test,
    fs = require('fs'),
    logs = require('../lib/logs'),
    Logger = logs.Logger,
    ConsoleLogger = logs.ConsoleLogger,
    FileLogger = logs.FileLogger,
    CallbackLogger = logs.CallbackLogger;

test('Logger', function (t) {
    var logger = new Logger(),
        output;
    logger.write = function (text) {
        output = text;
    };
    t.equal(logger.level, 0, 'Initial level');
    logger.setLevel(2);
    t.equal(logger.level, 2, 'setLevel(2)');
    logger.setLevel(0);
    logger.log('Hello, world!', 0);
    t.equal(output.slice(-13), 'Hello, world!', 'Info log');
    logger.setLevel(2);
    output = null;
    logger.log('Hello, world!');
    t.equal(output, null, 'Level restrict');
    t.end();
});

test('ConsoleLogger', function (t) {
    var logger = new ConsoleLogger();
    logger.log('Hello, world!');
    t.end();
});

test('FileLogger', function (t) {
    var filename = __dirname + '/5sd6gs4d6g54sddsg541d',
        logger = new FileLogger(filename),
        content;
    logger.log('Hello, world!');
    content = fs.readFileSync(filename, 'utf-8');
    t.equal(content.slice(-14, -1), 'Hello, world!', 'FileLogger log()');
    fs.unlinkSync(filename);
    t.end();
});

test('CallbackLogger', function (t) {
    var output,
        callback = function (text) { output = text; },
        logger = new CallbackLogger(callback);
    logger.log('Hello, world!');
    t.equal(output.slice(-13), 'Hello, world!', 'CallbackLogger log()');
    t.end();
});