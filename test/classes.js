var test = require('tap').test,
    Class = require('../lib/classes').Class;

test('Classes test', function (t) {
    var Person = new Class({
        name: 'defaultName',
        age: -1,
        
        init: function (name, age) {
            this.name = name;
            this.age = age;
        },
        
        info: function () {
            return this.name + ' ' + this.age;
        },
    });
    
    var Programmer = new Class({
        extends: Person,
        language: 'defaultLanguage',
        
        init: function (name, age, language) {
            this.language = language;
        },
        
        info: function () {
            return this.super.info() + ' ' + this.language;
        },
        
        static: {
            languages: ['JavaScript', 'Python'],
            getLanguage: function (index) {
                return this.languages[index];
            }
        }
    });
    
    var me = new Programmer('Denis Ivanov', 21, 'JavaScript');
    
    t.equal(me.name, 'Denis Ivanov', 'Name init');
    t.equal(me.age, 21, 'Age init');
    t.equal(me.info(), 'Denis Ivanov 21 JavaScript', 'info() method');
    
    t.equivalent(Programmer.languages, ['JavaScript', 'Python'], 'Static object');
    t.equal(Programmer.getLanguage(1), 'Python', 'Static method');
    
    t.end();
});