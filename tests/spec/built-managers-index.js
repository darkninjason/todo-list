define(function(require, exports, module) {

// Imports

var IndexManager = require('built/core/managers/index').IndexManager;

describe('Index Manager', function() {

    var manager = null;

    // Setup

    beforeEach(function(){
        manager = new IndexManager();
    });

    // Test Suite

    it('should set length', function() {
        manager.setLength(3);
        expect(manager.getLength()).toEqual(3);
    });

    it('should set current index', function() {
        manager.setLength(3);
        manager.setIndex(1);
        expect(manager.getIndex()).toEqual(1);
    });

    it('should advance current index to 1', function() {
        manager.setLength(3);
        manager.nextIndex();
        expect(manager.getIndex()).toEqual(1);
    });

    it('should advance current index to 2', function() {
        manager.setLength(3);
        manager.nextIndex();
        manager.nextIndex();
        expect(manager.getIndex()).toEqual(2);
    });

    it('should cycle current index from advancing', function() {
        manager.setLength(3);
        manager.nextIndex();
        manager.nextIndex();
        manager.nextIndex();
        expect(manager.getIndex()).toEqual(0);
    });

    it('should cycle current index from advancing with arbitrary start', function() {
        manager.setLength(3);
        manager.setIndex(1);
        manager.nextIndex();
        manager.nextIndex();
        expect(manager.getIndex()).toEqual(0);
    });

    it('should retreat current index to 2', function() {
        manager.setLength(3);
        manager.previousIndex();
        expect(manager.getIndex()).toEqual(2);
    });

    it('should retreat current index to 1', function() {
        manager.setLength(3);
        manager.previousIndex();
        manager.previousIndex();
        expect(manager.getIndex()).toEqual(1);
    });

    it('should cycle current index from retreating', function() {
        manager.setLength(3);
        manager.previousIndex();
        manager.previousIndex();
        manager.previousIndex();
        manager.previousIndex();
        expect(manager.getIndex()).toEqual(2);
    });

    it('should cycle current index from retreating with arbitrary start', function() {
        manager.setLength(3);
        manager.setIndex(1);
        manager.previousIndex();
        manager.previousIndex();
        expect(manager.getIndex()).toEqual(2);
    });

}); // eof describe
}); // eof define
