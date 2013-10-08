define(function(require, exports, module) {

// Imports

var SelectionManager = require('auf/ui/managers/selection');

describe('Selection Manager', function() {

    var $items, manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-selection.html');
        $items = $('.option');
    });

    afterEach(function() {
        if(manager){
            manager.close();
            manager = null;
        }
    });

    // Test Suite

    it('should trigger before:select', function() {
        manager = new SelectionManager({
            el: $items
        });

        var beforeSelect = jasmine.createSpy('beforeSelect');
        var $target      = $items.eq(0);

        $target.trigger('click');

        expect(beforeSelect).not.toHaveBeenCalled();

        manager.listenTo(manager, 'before:select', beforeSelect);
        $target.trigger('click');

        expect(beforeSelect).toHaveBeenCalled();
    });

    it('should trigger after:select', function() {
        manager = new SelectionManager({
            el: $items
        });

        var afterSelect = jasmine.createSpy('afterSelect');
        var $target     = $items.eq(0);

        $target.trigger('click');

        expect(afterSelect).not.toHaveBeenCalled();

        manager.listenTo(manager, 'after:select', afterSelect);
        $target.trigger('click');

        expect(afterSelect).toHaveBeenCalled();
    });

    it('should select 1st option with click', function() {
        manager = new SelectionManager({
            el: $items
        });

        spyOn(manager, '_selectElement').andCallThrough();

        var $target = $items.eq(0);

        $target.trigger('click');

        expect(manager.collection.contains($target)).toEqual(true);
        expect(manager._selectElement).toHaveBeenCalled();
    });

    it('should select option with value', function() {
        manager = new SelectionManager({
            el: $items
        });

        var $target = $items.eq(1);

        manager.selectValue('two');
        expect(manager.collection.contains($target)).toEqual(true);
    });

    it('should return selected value', function() {
        manager = new SelectionManager({
            el: $items
        });

        manager.selectIndex(1);
        var val = manager.val();

        expect(_.isArray(val)).toEqual(true);
        expect(val[0]).toEqual('two');
    });

    it('should return null for selected value', function() {
        manager = new SelectionManager({
            el: $items
        });

        expect(manager.val().length).toEqual(0);
    });

    it('should deselect', function() {
        manager = new SelectionManager({
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
        manager = new SelectionManager({
            el: $items
        });

        var $target = $items.eq(1);

        manager.selectIndex(1);
        expect(manager.collection.contains($target)).toEqual(true);

        manager.selectIndex(1);
        expect(manager.collection.contains($target)).toEqual(true);
    });

    it('should select all options with click', function() {
        manager = new SelectionManager({
            el: $items
        });

        $items.trigger('click');

        expect(manager.collection.contains($items.eq(0))).toEqual(true);
        expect(manager.collection.contains($items.eq(1))).toEqual(true);
        expect(manager.collection.contains($items.eq(2))).toEqual(true);
    });


    it('should set call selection delegate', function() {
        var delegate = jasmine.createSpyObj('delegate', ['selectionManagerShouldSelect']);
        manager = new SelectionManager({
            el: $items,
            delegate: delegate
        });

        var $target = $items.eq(0);

        $target.trigger('click');

        expect(delegate.selectionManagerShouldSelect).toHaveBeenCalled();
        expect(delegate.selectionManagerShouldSelect).toHaveBeenCalledWith($target);
    });

    it('should select index 1', function() {

        manager = new SelectionManager({
            el: $items
        });

        manager.selectIndex(1);

        var $target = $items.eq(1);

        expect(manager.collection.contains($target)).toEqual(true);
    });

    it('should select all indexes', function() {

        manager = new SelectionManager({
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

        var scopedManager = new SelectionManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(scopedManager, '_selectElement').andCallThrough();
        scopedManager.close();

        $target.trigger('click');

        expect(scopedManager._selectElement).not.toHaveBeenCalled();
        expect(scopedManager.collection.length).toEqual(0);
    });

}); // eof desribe
}); // eof define
