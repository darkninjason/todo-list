define(function(require, exports, module) {

// Imports

var SingleSelectionManager = require('auf/ui/managers/selection-single');

describe('Single Selection Manager', function() {

    var $items, manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-selection-single.html');
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

        var manager = new SingleSelectionManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(manager.selectionManager, 'select');

        $target.trigger('click');
        expect(manager.selectionManager.select).toHaveBeenCalled();
    });

    it('should remove click events', function() {
        // we want to test for onClose on this manager
        // specifically so don't use the module accessible
        // 'manager' var, as it is closed for us in 'afterEach'

        var manager = new SingleSelectionManager({
                el: $items
            });

        var $target = $items.eq(0);

        spyOn(manager.selectionManager, 'select');
        manager.close();

        $target.trigger('click');

        expect(manager.selectionManager.select).not.toHaveBeenCalled();
    });

    it('should trigger select', function() {
        manager = new SingleSelectionManager({
            el: $items
        });

        var select = jasmine.createSpy('Select');
        var $target = $items.eq(0);

        manager.listenTo(manager, 'select', select);
        $target.trigger('click');
        $target.trigger('click');

        expect(select).toHaveBeenCalled();
        expect(select.calls.length).toEqual(1);
    });

    it('should trigger deselect', function() {
        manager = new SingleSelectionManager({
            el: $items,
            allowsDeselect: true
        });

        var deselect = jasmine.createSpy('Deselect');
        var $target = $items.eq(0);

        manager.listenTo(manager, 'deselect', deselect);
        $target.trigger('click');
        $target.trigger('click');

        expect(deselect).toHaveBeenCalled();
        expect(deselect.calls.length).toEqual(1);
    });

    it('should select one option with click', function() {
        manager = new SingleSelectionManager({
            el: $items
        });

        var $target1 = $items.eq(0);
        var $target2 = $items.eq(1);

        $target1.trigger('click');
        $target2.trigger('click');

        var collection = manager.selectionManager.collection;

        expect(collection.length).toEqual(1);
        expect(collection.contains($target2)).toEqual(true);
        expect(collection.contains($target1)).toEqual(false);

    });


    it('should select one by index', function() {
        manager = new SingleSelectionManager({
            el: $items
        });

        var $target1 = $items.eq(0);
        var $target2 = $items.eq(1);

        manager.selectIndex(0);
        manager.selectIndex(1);

        var collection = manager.selectionManager.collection;

        expect(collection.length).toEqual(1);
        expect(collection.contains($target2)).toEqual(true);
        expect(collection.contains($target1)).toEqual(false);
    });


    it('should allow deselect', function() {
        manager = new SingleSelectionManager({
            el: $items,
            allowsDeselect: true
        });

        var $target1 = $items.eq(0);
        var collection = manager.selectionManager.collection;

        $target1.trigger('click');

        expect(collection.length).toEqual(1);
        expect(collection.contains($target1)).toEqual(true);


        $target1.trigger('click');
        expect(collection.length).toEqual(0);
        expect(collection.contains($target1)).toEqual(false);
    });

    it('should return one selection', function() {
        manager = new SingleSelectionManager({
            el: $items
        });

        manager.selectIndex(1);
        manager.selectIndex(2);
        expect(manager.val()[0]).toEqual($items.eq(2)[0]);
    });

}); // eof describe
}); // eof define
