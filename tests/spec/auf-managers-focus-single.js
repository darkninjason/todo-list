define(function(require, exports, module) {

// Imports

var SingleFocusManager = require('auf/ui/managers/focus-single');

describe('Single Selection Manager', function() {

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

    it('should handle click events', function() {
        // we want to test for onClose on this manager
        // specifically so don't use the module accessible
        // 'manager' var, as it is closed for us in 'afterEach'

        var manager = new SingleFocusManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(manager.focusManager, 'focus');

        $target.trigger('click');
        expect(manager.focusManager.focus).toHaveBeenCalled();
    });

    it('should remove click events', function() {
        // we want to test for onClose on this manager
        // specifically so don't use the module accessible
        // 'manager' var, as it is closed for us in 'afterEach'

        var manager = new SingleFocusManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(manager.focusManager, 'focus');
        manager.close();

        $target.trigger('click');

        expect(manager.focusManager.focus).not.toHaveBeenCalled();
    });

    it('should trigger focus', function() {
        manager = new SingleFocusManager({
            el: $items
        });

        var focus = jasmine.createSpy('focus');
        var $target = $items.eq(0);

        manager.listenTo(manager, 'focus', focus);
        $target.trigger('click');
        $target.trigger('click');

        expect(focus).toHaveBeenCalled();
        expect(focus.calls.length).toEqual(1);
    });

    it('should trigger blur', function() {
        manager = new SingleFocusManager({
            el: $items,
            allowsDeselect: true
        });

        var blur = jasmine.createSpy('blur');
        var $target = $items.eq(0);

        manager.listenTo(manager, 'blur', blur);
        $target.trigger('click');
        $target.trigger('click');

        expect(blur).toHaveBeenCalled();
        expect(blur.calls.length).toEqual(1);
    });

    it('should select one option with click', function() {
        manager = new SingleFocusManager({
            el: $items
        });

        var $target1 = $items.eq(0);
        var $target2 = $items.eq(1);

        $target1.trigger('click');
        $target2.trigger('click');

        var collection = manager.focusManager.collection;

        expect(collection.length).toEqual(1);
        expect(collection.contains($target2)).toEqual(true);
        expect(collection.contains($target1)).toEqual(false);

    });


    it('should select one by index', function() {
        manager = new SingleFocusManager({
            el: $items
        });

        var $target1 = $items.eq(0);
        var $target2 = $items.eq(1);

        manager.focusIndex(0);
        manager.focusIndex(1);

        var collection = manager.focusManager.collection;

        expect(collection.length).toEqual(1);
        expect(collection.contains($target2)).toEqual(true);
        expect(collection.contains($target1)).toEqual(false);
    });


    it('should allow blur', function() {
        manager = new SingleFocusManager({
            el: $items,
            allowsDeselect: true
        });

        var $target1 = $items.eq(0);
        var collection = manager.focusManager.collection;

        $target1.trigger('click');

        expect(collection.length).toEqual(1);
        expect(collection.contains($target1)).toEqual(true);


        $target1.trigger('click');
        expect(collection.length).toEqual(0);
        expect(collection.contains($target1)).toEqual(false);
    });

    it('should return one selection', function() {
        manager = new SingleFocusManager({
            el: $items
        });

        manager.focusIndex(1);
        manager.focusIndex(2);
        expect(manager.val()[0]).toEqual($items.eq(2)[0]);
    });

}); // eof describe
}); // eof define
