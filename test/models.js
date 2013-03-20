var test = require('tap').test,
    _ = require('underscore'),
    async = require('async'),
    models = require('../lib/models'),
    List = models.List,
    ListItem = models.ListItem,
    url = 'mongodb://localhost/jaspidgfhsd64d54',
    persons;

test('List.init()', function (t) {
    persons = new List('persons', url);
    t.equal(persons.name, 'persons', 'Init name');
    t.equal(persons.url, url, 'Init url');
    t.end();
});

test('List.on(), List.emit()', function (t) {
    var output = null,
        handler = function (arg) {
            output = arg;
        },
        otherPersons = new List('persons', url),
        users = new List('users', url);
    persons.on('testEvent', handler);
    persons.emit('testEvent', 1);
    t.equal(output, 1, 'Direct event emit');
    
    otherPersons.emit('testEvent', 2);
    t.equal(output, 2, 'Indirect event emit');
    
    users.emit('testEvent', 3);
    t.notEqual(output, 3, 'Other list emit');
    
    t.end();
});

test('List.setName()', function (t) {
    persons.setName('persons2');
    t.equal(persons.name, 'persons2');
    persons.setName('persons');
    t.end();
});

test('List.add(), List.all()', function (t) {
    persons.empty(function () {
        persons.add({name: 'MyName', age: 21}, function (item) {
            t.equal(item.name, 'MyName');
            t.equal(item.age, 21);
            persons.all(function (items) {
                t.type(items[0], ListItem);
                t.equal(items.length, 1);
                t.equal(items[0].name, 'MyName');
                t.equal(items[0].age, 21);
                t.end();
            });
        });
    });
});

test('List.add(array)', function (t) {
    persons.empty(function () {
        var items = [];
        _.each([1, 2, 3, 4, 5], function (index) {
            items.push({
                name: 'Name' + index,
                age: index
            });
        });
        persons.add(items, function (resultItems) {
            t.equal(items.length, resultItems.length);
            t.type(resultItems[0], ListItem);
            t.similar(resultItems, items);
            persons.all(function (allItems) {
                t.similar(allItems, items);
                t.end();
            });
        });
    });
});

test('List.get()', function (t) {
    persons.get({name: 'Name1'}, function (item) {
        t.type(item, ListItem);
        t.equal(item.name, 'Name1');
        t.equal(item.age, 1);
        t.ok(item._id);
        persons.db.dropDatabase(function (err, done) {
            t.notOk(err);
            t.end();
        });
    });
});