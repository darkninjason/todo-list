define(function(require, exports, module) {

// Imports

var list = require('auf/ui/managers/list');

describe('List Manager', function() {


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
        return new list.ListManager(getOptions(augments));
    }

    // Test Suite

    it('swaps positions of 2 indexes in the middle', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setList(list);
        manager.swapPositions(1, 2);

        var target = manager.getList();
        expect(target.length).toEqual(4);

        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

    it('swaps positions of 2 indexes from the beginning <-> end', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setList(list);
        manager.swapPositions(0, 3);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(1);
    });

    it('swaps using commutative from <-> to', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setList(list);

        // our from value is larger than our to value
        // should still work just fine.
        manager.swapPositions(3, 0);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(1);
    });

    it('replaces item at the first position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setList(list);
        manager.replaceAtPositionWith(0, 9);

        var target = manager.getList();

        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(9);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(4);
    });

    it('replaces item at the last position', function(){
        var list = [1,2,3,4];

        manager = getManager();
        manager.setList(list);
        manager.replaceAtPositionWith(3, 9);

        var target = manager.getList();

        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(3);
        expect(target[3]).toEqual(9);
    });

    it('replaces item in a middle position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.replaceAtPositionWith(2, 9);

        var target = manager.getList();

        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(2);
        expect(target[2]).toEqual(9);
        expect(target[3]).toEqual(4);
    });

    it('moves item from the last position to the first position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.moveItemAtPositionToPosition(3, 0);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(4);
        expect(target[1]).toEqual(1);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(3);
    });

    it('moves item from the first position to the last position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.moveItemAtPositionToPosition(0, 3);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(2);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(4);
        expect(target[3]).toEqual(1);
    });

    it('moves item from the 3rd position to the 2nd position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.moveItemAtPositionToPosition(2, 1);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

    it('moves item from the 2nd position to the last position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.moveItemAtPositionToPosition(1, 3);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(1);
        expect(target[1]).toEqual(3);
        expect(target[2]).toEqual(4);
        expect(target[3]).toEqual(2);
    });

    it('moves item from the 3rd position to the first position', function(){
        var list = [1,2,3,4];

        manager = getManager({list: list});
        manager.moveItemAtPositionToPosition(2, 0);

        var target = manager.getList();
        expect(target.length).toEqual(4);
        expect(target[0]).toEqual(3);
        expect(target[1]).toEqual(1);
        expect(target[2]).toEqual(2);
        expect(target[3]).toEqual(4);
    });

}); // Eof describe
}); // Eof define