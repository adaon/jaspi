var jaspi = require('jaspi'),
    List = require('jaspi').models.List;
    
jaspi.debug.logs.setLogger(new jaspi.debug.logs.ConsoleLogger());

var persons = new List('123', 'mongodb://localhost/test');

persons.get(45);