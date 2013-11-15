define(function(require, exports, module) {

// Imports

var Container = require('auf/utils/ioc').Container;
var marionette = require('marionette');

describe('Dependency Injection', function() {

    var container;

    // Set Up

    beforeEach(function() {
        container = new Container();
    });

    afterEach(function() {
        container.close();
    });

    // Helpers

    var TestClass = marionette.Controller.extend({
        foo: null,
        bar: 1,
        baz: 'baz',
        initialize: function(options){
            _.extend(this, options);
        }
    });

    var ComplexClass = marionette.Controller.extend({
        chicken:'chicken',
        initialize: function(options){
            _.extend(this, options);
        }
    });

    // Test Suite
    it('initializes an object', function(){
        container.register('obj', Object);
        expect(container.resolve('obj')).toEqual({});
    });

    it('initializes an object with a case insensitive name', function(){
        container.register('oBj', Object);
        expect(container.resolve('ObJ')).toEqual({});
    });

    it('resolves a single dependency', function(){
        container.register('TestClass', TestClass).depends('foo', 1);
        
        var object = container.resolve('TestClass');
        expect(object.foo).toEqual(1);
        expect(object.bar).toEqual(1);
        expect(object.baz).toEqual('baz');
    });

    it('resolves a multiple dependency', function(){
        container.register('TestClass', TestClass)
        .depends('foo', 1)
        .depends('bar', 2)
        .depends('baz', 3);

        var object = container.resolve('TestClass');
        expect(object.foo).toEqual(1);
        expect(object.bar).toEqual(2);
        expect(object.baz).toEqual(3);
    });
    
    it('resolves complex dependencies', function(){
        container.register('TestClass', TestClass)
        .depends('foo',ComplexClass);

        var object = container.resolve('TestClass');
        expect(object.foo instanceof ComplexClass).toEqual(true);
        expect(object.foo.chicken).toEqual('chicken');
    });

    it('resolves complex dependencies with arguments', function(){
        container.register('TestClass', TestClass)
        .depends('foo',ComplexClass,{chicken:'turkey'});

        var object = container.resolve('TestClass');
        expect(object.foo.chicken).toEqual('turkey');
    });

}); // Eof describe
}); // Eof define
