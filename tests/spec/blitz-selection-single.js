define(function(require, exports, module) {
    var selections = require('auf/ui/managers/selection');

    describe('Single Selection Manager', function() {

        var $items, manager = null;

        beforeEach(function() {
            loadFixtures('selection-manager-single.html');
            $items = $('.option');
        });

        afterEach(function() {
            if(manager){
                manager.close();
                manager = null;
            }
        });

        it('should trigger before:select', function() {
            manager = new selections.SingleSelectionManager({
                el: $items
            });

            var beforeSelect = jasmine.createSpy('beforeSelect');

            var $target = $items.eq(0);
            $target.trigger('click');

            expect(beforeSelect).not.toHaveBeenCalled();

            manager.listenTo(manager, 'before:select', beforeSelect);
            $target.trigger('click');

            expect(beforeSelect).toHaveBeenCalled();
        });

        it('should trigger after:select', function() {
            manager = new selections.SingleSelectionManager({
                el: $items
            });

            var afterSelect = jasmine.createSpy('afterSelect');

            var $target = $items.eq(0);
            $target.trigger('click');

            expect(afterSelect).not.toHaveBeenCalled();

            manager.listenTo(manager, 'after:select', afterSelect);
            $target.trigger('click');

            expect(afterSelect).toHaveBeenCalled();
        });

        it('should select one option with click', function() {
            manager = new selections.SingleSelectionManager({
                el: $items
            });

            var $target1 = $items.eq(0);
            var $target2 = $items.eq(1);
            var selectedClass = manager.selectionManager.selectedClass;

            $target1.trigger('click');
            $target2.trigger('click');

            expect($target1).not.toHaveClass(selectedClass);
            expect($target2).toHaveClass(selectedClass);
        });

        it('should select one option on click with alt selectedClass', function() {
            manager = new selections.SingleSelectionManager({
                el: $items,
                selectedClass: 'foo'
            });

            var $target1 = $items.eq(0);
            var $target2 = $items.eq(1);

            var selectedClass = 'foo';

            $target1.trigger('click');
            $target2.trigger('click');

            expect($target1).not.toHaveClass(selectedClass);
            expect($target2).toHaveClass(selectedClass);
        });


        it('should select one by index', function() {
            manager = new selections.SingleSelectionManager({
                el: $items
            });

            var $target1 = $items.eq(0);
            var $target2 = $items.eq(1);
            var selectedClass = manager.selectionManager.selectedClass;

            manager.selectIndex(0);
            manager.selectIndex(1);

            expect($target1).not.toHaveClass(selectedClass);
            expect($target2).toHaveClass(selectedClass);
        });

        it('should select one by value', function() {
            manager = new selections.SingleSelectionManager({
                el: $items
            });

            var $target1 = $items.eq(0);
            var $target2 = $items.eq(1);
            var selectedClass = manager.selectionManager.selectedClass;

            manager.selectValue('one');
            manager.selectValue('two');

            expect($target1).not.toHaveClass(selectedClass);
            expect($target2).toHaveClass(selectedClass);
        });

        it('should allow deselect', function() {
            manager = new selections.SingleSelectionManager({
                el: $items,
                allowsDeselect: true
            });

            var $target1 = $items.eq(0);
            var selectedClass = manager.selectionManager.selectedClass;

            $target1.trigger('click');
            expect($target1).toHaveClass(selectedClass);

            $target1.trigger('click');
            expect($target1).not.toHaveClass(selectedClass);
        });

        it('should return selected value', function() {
            manager = new selections.SelectionManager({
                el: $items
            });

            manager.selectIndex(1);
            expect(manager.val()).toEqual('two');
        });

        it('should remove events', function() {
            // we want to test for onClose on this manager
            // specifically so don't use the module accessible
            // 'manager' var, as it is closed for us in 'afterEach'

            var scopedManager = new selections.SingleSelectionManager({
                el: $items
            });

            scopedManager.close();

            var $target = $items.eq(0);
            $target.trigger('click');

            expect($target).not.toHaveClass(scopedManager.selectedClass);
        });
    });
});
