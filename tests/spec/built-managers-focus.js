define(function(require, exports, module) {

// Imports

var FocusManager = require('built/core/managers/focus').FocusManager;
var focus = require('built/core/events/focus');

describe('Focus Manager', function() {

    var $items, manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-focus.html');
        $items = $('.option');
    });

    afterEach(function() {
        if(manager){
            manager.destroy();
            manager = null;
        }
    });

    // Test Suite

    it('throws error when no non-array provided on set', function(){
        function badInit() {
            manager = new FocusManager({});
            manager.setArray($items);
        }

        expect(badInit).toThrow();
    });

    it('throws error when no non-array provided on init', function(){
        function badInit() {
            new FocusManager({list: $items});
        }

        expect(badInit).toThrow();
    });

    it('should trigger focus', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        var spy = jasmine.createSpy('focus');

        manager.listenTo(manager, focus.FOCUS, spy);
        manager.focusIndex(0);

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
    });

    it('should trigger blur', function() {
        manager = new FocusManager({
            list: $items.toArray(),
            allowsDeselect: true
        });

        var blur = jasmine.createSpy('blur');

        manager.listenTo(manager, focus.BLUR, blur);
        manager.focusIndex(0);
        manager.focusIndex(0);

        expect(blur).toHaveBeenCalled();
        expect(blur.calls.count()).toEqual(1);
    });

    it('should focus index 0', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        spyOn(manager, 'focus').and.callThrough();

        var $target = $items.eq(0);
        manager.focusIndex(0);

        var focused = manager.getFocusedObjects();

        expect(focused.indexOf($target[0])).toEqual(0);
        expect(manager.focus).toHaveBeenCalled();
    });

    it('should return focused elements', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        manager.focusIndex(1);
        var focused = manager.getFocusedObjects();

        expect(_.isArray(focused)).toEqual(true);
        expect(focused.length).toEqual(1);
        expect(focused[0]).toEqual($items.eq(1)[0]);
    });

    it('should return null for focused elements', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        expect(manager.getFocusedObjects().length).toEqual(0);
    });

    it('should blur', function() {
        manager = new FocusManager({
            list: $items.toArray(),
            allowsDeselect: true
        });

        var $target = $items.eq(1);

        manager.focusIndex(1);
        var focused = manager.getFocusedObjects();
        expect(focused.indexOf($target[0])).toEqual(0);

        manager.focusIndex(1);

        focused = manager.getFocusedObjects();
        expect(focused.indexOf($target[0])).toEqual(-1);
    });

    it('should not blur', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        var $target = $items.eq(1);

        manager.focusIndex(1);
        var focused = manager.getFocusedObjects();

        expect(focused.indexOf($target[0])).toEqual(0);

        manager.focusIndex(1);
        focused = manager.getFocusedObjects();
        expect(focused.indexOf($target[0])).toEqual(0);
    });

    it('should foucs all options', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        manager.focusIndex(0);
        manager.focusIndex(1);
        manager.focusIndex(2);

        var focused = manager.getFocusedObjects();
        expect(focused.length).toEqual(3);

        expect(focused.indexOf($items.eq(0)[0])).not.toEqual(-1);
        expect(focused.indexOf($items.eq(1)[0])).not.toEqual(-1);
        expect(focused.indexOf($items.eq(2)[0])).not.toEqual(-1);
    });

    it('should get focused indexes for focused objects', function() {
        manager = new FocusManager({
            list: $items.toArray()
        });

        manager.focusIndex(1);
        manager.focusIndex(2);

        var focused = manager.getFocusedIndexes();

        expect(focused.length).toEqual(2);
        expect(focused.indexOf(1)).not.toEqual(-1);
        expect(focused.indexOf(2)).not.toEqual(-1);
    });

}); // eof desribe
}); // eof define
