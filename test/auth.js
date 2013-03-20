var test = require('tap').test,
    _ = require('underscore'),
    auth = require('../lib/auth'),
    User = auth.User,
    Users = auth.Users, 
    props = {username: 'teu', password: '123456'},
    url = 'mongodb://localhost/jaspid54g4sdg31auth',
    sha1 = require('sha1');

test('User', function (t) {
    var me = new User(props);
    t.equal(me.username, props.username);
    t.equal(me.password, props.password);
    me.setPassword('456789');
    t.equal(me.password, sha1('456789'));
    t.ok(me.checkPassword('456789'));
    t.notOk(me.checkPassword('123456'));
    t.end();
});

test('Users', function (t) {
    var users = new Users(url);
    users.empty(function () {
        users.register({username:'user1', password1:'pass1', password2:'pass1'}, function (err) {
            t.equivalent(err, []);
            users.getUser('user1', 'pass1', function (user) {
                t.equal(user.username, 'user1');
                users.empty(function () {
                    users.db.dropDatabase(function () {
                        t.end();
                    });
                });
            });
        });
    });
});