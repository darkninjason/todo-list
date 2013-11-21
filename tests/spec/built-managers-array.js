define(function(require, exports, module) {

// Imports

var array = require('built/core/managers/array');
var events = require('built/core/events/event');

describe('Array Manager', function() {


    // Set Up

    beforeEach(function() {
    });

    afterEach(function() {
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new array.ArrayManager(getOptions(augments));
    }

    // Test Suite

    it('throws error when no non-array provided on init', function(){
        function badInit() {
            new array.ArrayManager({list: $items});
        }

        expect(badInit).toThrow();
    });

    it('throws error when no non-array provided on set', function(){
        function badInit() {
            manager = new array.ArrayManager();
            manager.setArray(123);
        }

        expect(badInit).toThrow();
    });

    it('inserts object', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);
        manager.insertObject(9);


        var target = manager.getArray();
        expect(target.length).toEqual(5);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(4);
        expect(target[4]).toEqual(9);
    });

    it('inserts object at position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);
        manager.insertObjectAt(2, 9);

        var target = manager.getArray();
        expect(target.length).toEqual(5);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(9);
        expect(target[3]).toEqual(3);
        expect(target[4]).toEqual(4);
    });

    it('removes object at position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.insertObjectAt(2, 9);
        manager.removeObjectAt(2);

        var target = manager.getArray();
        expect(target.length).toEqual(4);

        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy.calls.length).toEqual(2);

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(4);
    });

    it('swaps positions of 2 indexes in the middle', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.swap(1, 2);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

    it('does not swap positions of 2 indexes in the middle', function(){

        // target swap indexs are the same
        // in this case
        var list = [1,2,2,4];


        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.swap(1, 2);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).not.toHaveBeenCalled();
    });

    it('swaps positions of 2 indexes from the beginning <-> end', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.swap(0, 3);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(1);
    });

    it('swaps using commutative from <-> to', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        // our from value is larger than our to value
        // should still work just fine.
        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.swap(3, 0);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(1);
    });

    it('replaces item at the first position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.replaceAt(0, 9);

        var target = manager.getArray();

        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(9);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(4);
    });

    it('replaces item at the last position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setArray(list);

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.replaceAt(3, 9);

        var target = manager.getArray();

        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(9);
    });

    it('replaces item in a middle position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.replaceAt(2, 9);

        var target = manager.getArray();

        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(9);
        expect(target[3]).toEqual(4);
    });

    it('moves item from the last position to the first position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.moveObjectFromTo(3, 0);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(1);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(3);
    });

    it('moves item from the first position to the last position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.moveObjectFromTo(0, 3);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(2);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(4);
        expect(target[3]).toEqual(1);
    });

    it('moves item from the 3rd position to the 2nd position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.moveObjectFromTo(2, 1);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

    it('moves item from the 2nd position to the last position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.moveObjectFromTo(1, 3);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(4);
        expect(target[3]).toEqual(2);
    });

    it('moves item from the 3rd position to the first position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});

        var eventSpy = jasmine.createSpy('eventSpy');
        manager.on(events.CHANGE, eventSpy);

        manager.moveObjectFromTo(2, 0);

        var target = manager.getArray();
        expect(target.length).toEqual(4);
        expect(eventSpy).toHaveBeenCalled();

        expect(target[0]).toEqual(3);
        expect(target[1]).toEqual(1);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

}); // Eof describe
}); // Eof define
