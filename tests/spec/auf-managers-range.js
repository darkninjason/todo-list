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

        manager.setValue(25);
        expect(manager.getPosition()).toEqual(0.25);

        manager.setValue(33);
        expect(manager.getPosition()).toEqual(0.33);

        manager.setValue(50);
        expect(manager.getPosition()).toEqual(0.5);

        manager.setValue(75);
        expect(manager.getPosition()).toEqual(0.75);

        manager.setValue(100);
        expect(manager.getPosition()).toEqual(1);
    });

    it('calculates position for a given value betwen 0 and 300', function(){

        manager = new RangeManager({
            min: 10,
            max: 310
        });

        manager.setValue(0);
        expect(manager.getPosition()).toEqual(0);

        manager.setValue(75);
        expect(manager.getPosition()).toEqual(0.25);

        manager.setValue(150);
        expect(manager.getPosition()).toEqual(0.5);

        manager.setValue(225);
        expect(manager.getPosition()).toEqual(0.75);

        manager.setValue(300);
        expect(manager.getPosition()).toEqual(1);
    });

    it('calculates value for a given position betwen 0 and 1', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setPosition(0.25);
        expect(manager.getValue()).toEqual(25);

        manager.setPosition(0.5);
        expect(manager.getValue()).toEqual(50);

        manager.setPosition(0.75);
        expect(manager.getValue()).toEqual(75);

        manager.setPosition(1);
        expect(manager.getValue()).toEqual(100);
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

    it('provides a default value', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        expect(manager.getValue()).toEqual(0);

    });

    it('calculates position for value exceeding max', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setValue(200);
        expect(manager.getPosition()).toEqual(1);
    });

    it('calculates position for value exceeding min', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setValue(-200);
        expect(manager.getPosition()).toEqual(0);
    });

    it('calculates value for position exceeding max', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setPosition(2);
        expect(manager.getValue()).toEqual(100);
    });

    it('calculates value for position exceeding min', function(){

        manager = new RangeManager({
            min: 10,
            max: 110
        });

        manager.setPosition(-2);
        expect(manager.getValue()).toEqual(0);
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

    it('dispatches change', function(){
        manager = new RangeManager({
            min: 10,
            max: 110
        });

        var spy = jasmine.createSpy('spy');

        manager.listenTo(manager, 'change', spy);
        manager.setPosition(0.5);
        manager.setValue(75);

        expect(spy.calls.length).toEqual(2);
    });

}); // Eof describe
}); // Eof define
