define(function(require, exports, module) {

var index = require('auf/ui/managers/index');

describe('Index Manager', function() {

    var manager = null;

    // Setup
    // ==================================================================== //

    beforeEach(function(){
        manager = new index.IndexManager();
    });

    // Test Suite
    // ==================================================================== //

    it('should set length', function() {
        manager.setLength(3);
        expect(manager.itemsLength).toEqual(3);
    });

    it('should set current index', function() {
        manager.setCurrentIndex(1);
        expect(manager.currentIndex).toEqual(1);
    });

    it('should advance current index to 0', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForNext();
        expect(manager.currentIndex).toEqual(0);
    });

    it('should advance current index to 1', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForNext();
        manager.updateCurrentIndexForNext();
        expect(manager.currentIndex).toEqual(1);
    });

    it('should cycle current index from advancing', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForNext();
        manager.updateCurrentIndexForNext();
        manager.updateCurrentIndexForNext();
        manager.updateCurrentIndexForNext();
        expect(manager.currentIndex).toEqual(0);
    });

    it('should cycle current index from advancing with arbitrary start', function() {
        manager.setLength(3);
        manager.setCurrentIndex(1);
        manager.updateCurrentIndexForNext();
        manager.updateCurrentIndexForNext();
        expect(manager.currentIndex).toEqual(0);
    });

    it('should retreat current index to 2', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForPrevious();
        expect(manager.currentIndex).toEqual(2);
    });

    it('should retreat current index to 1', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForPrevious();
        manager.updateCurrentIndexForPrevious();
        expect(manager.currentIndex).toEqual(1);
    });

    it('should cycle current index from retreating', function() {
        manager.setLength(3);
        manager.updateCurrentIndexForPrevious();
        manager.updateCurrentIndexForPrevious();
        manager.updateCurrentIndexForPrevious();
        manager.updateCurrentIndexForPrevious();
        expect(manager.currentIndex).toEqual(2);
    });

    it('should cycle current index from retreating with arbitrary start', function() {
        manager.setLength(3);
        manager.setCurrentIndex(1);
        manager.updateCurrentIndexForPrevious();
        manager.updateCurrentIndexForPrevious();
        expect(manager.currentIndex).toEqual(2);
    });

}); // eof describe
}); // eof define
