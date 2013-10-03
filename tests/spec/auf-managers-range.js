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
                max: 100
            }
        );
    });

    afterEach(function() {
        // console.log('\neof ' + this.description);
    });

    // Helpers

    // Test Suite

    it('applies range from default manager', function(){
        expect(manager.getRange()).toEqual(100);
    });

    it('applies options and computes properties', function(){
        manager = new RangeManager({
            min: 100,
            max: 200
        });

        expect(manager.getMin()).toEqual(100);
        expect(manager.getMax()).toEqual(200);
        expect(manager.getRange()).toEqual(100);
    });

    it('updates properties when range change', function(){

        // update the range to force manager to recalculate
        manager.setRange(10, 210);

        expect(manager.getMin()).toEqual(10);
        expect(manager.getMax()).toEqual(210);
        expect(manager.getRange()).toEqual(200); // Max - min = 200
    });


    it('updates position change', function(){
        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(0.25);
        expect(manager.getPosition()).toEqual(0.25);
    });

    it('restricts position value greater 1 to 1', function(){
        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(9);
        expect(manager.getPosition()).toEqual(1);
    });

    it('restricts position value less than 0 to 0', function(){
        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(-9);
        expect(manager.getPosition()).toEqual(0);
    });

    it('calculates position for a given value betwen 0 and 100', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        expect(manager.positionForValue(25)).toEqual(0.25);
        expect(manager.positionForValue(33)).toEqual(0.33);
        expect(manager.positionForValue(50)).toEqual(0.5);
        expect(manager.positionForValue(75)).toEqual(0.75);
        expect(manager.positionForValue(100)).toEqual(1);

    });

    it('calculates position for a given value betwen 0 and 300', function(){

        function round(val){
            // 3 decimal places
            return Math.round(val * 1000) / 1000;
        }

        manager = new RangeManager({
            min: 10,
            max: 310
        });

        expect(manager.positionForValue(0)).toEqual(0);
        expect(round(manager.positionForValue(25))).toEqual(0.083);
        expect(round(manager.positionForValue(100))).toEqual(0.333);
        expect(round(manager.positionForValue(200))).toEqual(0.667);
        expect(manager.positionForValue(300)).toEqual(1);

    });

    it('calculates value for a given position betwen 0 and 1', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        expect(manager.valueForPosition(0)).toEqual(0);
        expect(manager.valueForPosition(0.25)).toEqual(25);
        expect(manager.valueForPosition(0.5)).toEqual(50);
        expect(manager.valueForPosition(0.75)).toEqual(75);
        expect(manager.valueForPosition(1)).toEqual(100);

    });

    it('calculates position when setting value', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setValue(50);
        expect(manager.getPosition()).toEqual(0.5);

    });

    it('calculates value when setting position', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setPosition(0.5);
        expect(manager.getValue()).toEqual(50);

    });

    it('calculates position exceeding max', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        expect(manager.positionForValue(150)).toEqual(1);

    });

    it('calculates position exceeding min', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        expect(manager.positionForValue(-200)).toEqual(0);

    });

    it('throws error if min greater than max', function(){
        function minIsGreaterThanMax() {
            manager.setMin(manager.getMax() + 1);
        }

        expect(minIsGreaterThanMax).toThrow();
    });

    it('throws error if max is less than min', function(){
        function maxIsLessThanMin() {
            manager.setMax(manager.getMin() - 1);
        }

        expect(maxIsLessThanMin).toThrow();
    });

}); // Eof describe
}); // Eof define
