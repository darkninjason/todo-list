define(function(require, exports, module) {

// Imports

var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;
var focusEvents = require('built/core/events/focus');


describe('Single Focus Manager', function() {

    var $items, manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-focus-single.html');
        $items = $('.option');
    });

    afterEach(function() {
        if(manager){
            manager.close();
            manager = null;
        }
    });

    // Test Suite


    it('should trigger focus', function() {
        manager = new SingleFocusManager({
            list: $items.toArray()
        });

        var focus = jasmine.createSpy('focus');
        var blur = jasmine.createSpy('blur');

        manager.listenTo(manager, focusEvents.FOCUS, focus);
        manager.listenTo(manager, focusEvents.BLUR, blur);

        manager.focusIndex(0);

        expect(focus).toHaveBeenCalled();
        expect(blur).not.toHaveBeenCalled();
        expect(focus.calls.length).toEqual(1);
        expect(blur.calls.length).toEqual(0);
    });

    it('should trigger blur', function() {
        manager = new SingleFocusManager({
            list: $items.toArray(),
            allowsDeselect: true
        });

        var blur = jasmine.createSpy('blur');

        manager.listenTo(manager, focusEvents.BLUR, blur);

        manager.focusIndex(0);
        manager.focusIndex(0);

        expect(blur).toHaveBeenCalled();
        expect(blur.calls.length).toEqual(1);
    });

    it('should select one option', function() {
        manager = new SingleFocusManager({
            list: $items.toArray()
        });

        var $target1 = $items.eq(0);
        var $target2 = $items.eq(1);

        manager.focusIndex(0);
        manager.focusIndex(1);

        var obj = manager.getFocusedObject();
        var focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(1);
        expect(focused.indexOf($target1[0])).toEqual(-1);
        expect(focused.indexOf($target2[0])).toEqual(0);
        expect(obj).toEqual($target2[0]);
    });

    it('should focus one by jquery element', function() {
        manager = new SingleFocusManager({
            list: $items.toArray()
        });

        var $target1 = $items.eq(0);
        manager.focus($target1[0]);

        var obj = manager.getFocusedObject();
        var focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(1);
        expect(focused.indexOf($target1[0])).toEqual(0);
        expect(obj).toEqual($target1[0]);
    });

    it('should blur one by jquery element', function() {
        manager = new SingleFocusManager({
            list: $items.toArray()
        });

        var $target1 = $items.eq(0);
        manager.focus($target1[0]);

        var focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(1);
        expect(focused.indexOf($target1[0])).toEqual(0);

        manager.blur($target1[0]);
        focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(0);
        expect(focused.indexOf($target1[0])).toEqual(-1);
    });


    it('should return one selection', function() {
        manager = new SingleFocusManager({
            list: $items.toArray()
        });

        manager.focusIndex(1);

        var obj = manager.getFocusedObject();
        var focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(1);
        expect(focused[1]).toEqual(undefined);
        expect(manager.getFocusedIndex()).toEqual(1);
        expect(obj).toEqual($items.eq(1)[0]);

        manager.focusIndex(2);

        obj = manager.getFocusedObject();
        focused = manager.getFocusedObjects();

        expect(focused.length).toEqual(1);
        expect(focused[1]).toEqual(undefined);
        expect(manager.getFocusedIndex()).toEqual(2);
        expect(obj).toEqual($items.eq(2)[0]);
    });

}); // eof describe
}); // eof define
