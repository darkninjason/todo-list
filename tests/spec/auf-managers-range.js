define(function(require, exports, module) {

// Imports
var RangeManager = require('auf/ui/managers/range');

describe('Manager: Range', function() {

    var manager = null;

    // Set Up
    beforeEach(function() {
        // console.log('before: ' + this.description + '\n');
        manager = new RangeManager(
            {
                max: 100,
                steps: 10
            }
        );
    });

    afterEach(function() {
        // console.log('\neof ' + this.description);
    });

    // Helpers

    // Test Suite

    it('applies options and computes properties', function(){
        // Note:
        // - Creating custom instance here to test various opts.
        var manager = new RangeManager({
            min: 100,
            max: 200,
            steps: 10
        });

        expect(manager.min()).toEqual(100);
        expect(manager.max()).toEqual(200);
        expect(manager.steps()).toEqual(10);
        expect(manager.range()).toEqual(100);
        expect(manager.stepDistance()).toEqual(10); // Range / steps = 10
    });

    it('updates properties when range and steps change', function(){

        // update the range steps to force manager to recalculate
        manager.range(10, 210);
        manager.steps(4);

        expect(manager.min()).toEqual(10);
        expect(manager.max()).toEqual(210);
        expect(manager.steps()).toEqual(4);
        expect(manager.range()).toEqual(200); // Max - min = 200
        expect(manager.stepDistance()).toEqual(50); // Range / steps = 50
    });

    it('updates step when position changes', function(){
        manager.position(0.25);

        expect(manager.position()).toEqual(0.25);
        expect(manager.step()).toEqual(2);
    });

    it('updates position when step changes', function(){
        manager.step(5);

        expect(manager.step()).toEqual(5);
        expect(manager.position()).toEqual(0.5); // Steps / 5 = 0.5
    });

    it('updates position the number of steps changes', function(){
        manager.step(5);

        // Same as before
        expect(manager.step()).toEqual(5);
        expect(manager.position()).toEqual(0.5);

        // Now updates steps
        // Manager should recalculate position based on current step
        manager.steps(20);

        // We doubled the steps so our current position should be
        // Half of what it used to be
        expect(manager.position()).toBe(0.25);
    });

    it('handles step & position when steps is 1', function(){
        manager.steps(1);

        manager.step(2);
        expect(manager.step()).toEqual(1);

        manager.step(0);
        expect(manager.step()).toEqual(0);

        manager.position(0.5);
        expect(manager.step()).toEqual(0);
    });

    it('updates range and step distance when range changes', function() {
        manager.position(0.5);
        manager.range(0, 200);

        expect(manager.range()).toEqual(200);
        expect(manager.stepDistance()).toEqual(20);
    });

    it('restricts position value greater 1 to 1', function(){
        manager.position(10);
        expect(manager.position()).toEqual(1);
    });

    it('restricts position value less than 0 to 0', function(){
        manager.position(-1);
        expect(manager.position()).toEqual(0);
    });

    it('restricts steps values less than 1 to 1', function(){
        manager.steps(-1);
        expect(manager.steps()).toEqual(1);
    });

    it('restricts a step value less than steps to 0', function(){
        manager.step(-1);
        expect(manager.step()).toEqual(0);
    });

    it('restricts step greater than steps to steps', function(){
        manager.step(20);
        expect(manager.step()).toEqual(10);
    });

    it('floors step that is not a whole number to a whole number', function(){
        manager.step(1.5);
        expect(manager.step()).toEqual(1);
    });

    it('throws error if min greater than max', function(){
        function minIsGreaterThanMax() {
            manager.min(manager.max() + 1);
        }

        expect(minIsGreaterThanMax).toThrow();
    });

    it('throws error if max is less than min', function(){
        function maxIsLessThanMin() {
            manager.max(manager.min() - 1);
        }

        expect(maxIsLessThanMin).toThrow();
    });

}); // Eof describe
}); // Eof define
