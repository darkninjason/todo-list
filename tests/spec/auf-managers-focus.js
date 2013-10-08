define(function(require, exports, module) {

// Imports

var FocusManager = require('auf/ui/managers/focus');

describe('FOcus Manager', function() {

    var $items, manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-focus.html');
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
        manager = new FocusManager({
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
        manager = new FocusManager({
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

    it('should select 1st option with click', function() {
        manager = new FocusManager({
            el: $items
        });

        spyOn(manager, 'select').andCallThrough();

        var $target = $items.eq(0);

        $target.trigger('click');

        expect(manager.collection.contains($target)).toEqual(true);
        expect(manager.select).toHaveBeenCalled();
    });

    it('should return selected elements', function() {
        manager = new FocusManager({
            el: $items
        });

        manager.selectIndex(1);
        var val = manager.val();

        expect(_.isArray(val)).toEqual(true);
        expect(val.length).toEqual(1);
        expect(val[0][0]).toEqual($items.eq(1)[0]);
    });

    it('should return null for selected elements', function() {
        manager = new FocusManager({
            el: $items
        });

        expect(manager.val().length).toEqual(0);
    });

    it('should deselect', function() {
        manager = new FocusManager({
            el: $items,
            allowsDeselect: true
        });

        var $target = $items.eq(1);

        manager.selectIndex(1);

        expect(manager.collection.contains($target)).toEqual(true);

        manager.selectIndex(1);
        expect(manager.collection.contains($target)).not.toEqual(true);
    });

    it('should not deselect', function() {
        manager = new FocusManager({
            el: $items
        });

        var $target = $items.eq(1);

        manager.selectIndex(1);
        expect(manager.collection.contains($target)).toEqual(true);

        manager.selectIndex(1);
        expect(manager.collection.contains($target)).toEqual(true);
    });

    it('should select all options with click', function() {
        manager = new FocusManager({
            el: $items
        });

        $items.trigger('click');

        expect(manager.collection.contains($items.eq(0))).toEqual(true);
        expect(manager.collection.contains($items.eq(1))).toEqual(true);
        expect(manager.collection.contains($items.eq(2))).toEqual(true);
    });

    it('should select index 1', function() {

        manager = new FocusManager({
            el: $items
        });

        manager.selectIndex(1);

        var $target = $items.eq(1);

        expect(manager.collection.contains($target)).toEqual(true);
    });

    it('should select all indexes', function() {

        manager = new FocusManager({
            el: $items
        });

        manager.selectIndex(0);
        manager.selectIndex(1);
        manager.selectIndex(2);

        expect(manager.collection.contains($items.eq(0))).toEqual(true);
        expect(manager.collection.contains($items.eq(1))).toEqual(true);
        expect(manager.collection.contains($items.eq(2))).toEqual(true);
    });

    it('should remove events', function() {
        // we want to test for onClose on this manager
        // specifically so don't use the module accessible
        // 'manager' var, as it is closed for us in 'afterEach'

        var scopedManager = new FocusManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(scopedManager, 'select').andCallThrough();
        scopedManager.close();

        $target.trigger('click');

        expect(scopedManager.select).not.toHaveBeenCalled();
        expect(scopedManager.collection.length).toEqual(0);
    });

}); // eof desribe
}); // eof define
