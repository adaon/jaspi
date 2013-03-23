var logs = require('jaspi').debug.logs;

logs.addLogger(new logs.ConsoleLogger());

logs.error('Hello, world!', {File: 'server.js', Line: 45});
logs.warning('Hello, world!', {File: 'server.js', Line: 45});
logs.info('Hello, world!', {File: 'server.js', Line: 45});