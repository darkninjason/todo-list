define(function(require, exports, module) {

// Imports

var RangeManager = require('built/core/managers/range').RangeManager;
var events = require('built/core/events/event');

describe('Range Manager', function() {

    var manager = null;

    // Set Up

    beforeEach(function() {
    });

    afterEach(function() {
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            min: 0,
            max: 100
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new RangeManager(getOptions(augments));
    }

    // Test Suite

    it('applies range from default manager', function(){
        expect(getManager().getRange()).toEqual(100);
    });

    it('applies options and computes properties', function(){
        var manager;

        manager = getManager({
            min: 100,
            max: 200
        });

        expect(manager.getMin()).toEqual(100);
        expect(manager.getMax()).toEqual(200);
        expect(manager.getRange()).toEqual(100);
    });

    it('updates properties when range change', function(){
        var manager;

        manager = getManager();

        // update the range to force manager to recalculate
        manager.setRange(10, 210);

        expect(manager.getMin()).toEqual(10);
        expect(manager.getMax()).toEqual(210);
        expect(manager.getRange()).toEqual(200); // Max - min = 200
    });


    it('updates position change', function(){
        var manager;

        manager = getManager();

        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(0.25);
        expect(manager.getPosition()).toEqual(0.25);
    });

    it('restricts position value greater 1 to 1', function(){
        var manager;

        manager = getManager();

        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(9);
        expect(manager.getPosition()).toEqual(1);
    });

    it('restricts position value less than 0 to 0', function(){
        var manager;

        manager = getManager();

        expect(manager.getPosition()).toEqual(0);
        manager.setPosition(-9);
        expect(manager.getPosition()).toEqual(0);
    });

    it('calculates position for a given value betwen 0 and 100', function(){
        var manager;

        manager = getManager({
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
        var manager;

        manager = getManager({
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
        var manager;

        manager = getManager({
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
        var manager;
        manager = getManager({
            min: 10,
            max: 110
        });

        manager.setValue(50);
        expect(manager.getPosition()).toEqual(0.5);

    });

    it('calculates value when setting position', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        manager.setPosition(0.5);
        expect(manager.getValue()).toEqual(50);

    });

    it('provides a default value', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        expect(manager.getValue()).toEqual(0);

    });

    it('calculates position for value exceeding max', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        manager.setValue(200);
        expect(manager.getPosition()).toEqual(1);
    });

    it('calculates position for value exceeding min', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        manager.setValue(-200);
        expect(manager.getPosition()).toEqual(0);
    });

    it('calculates value for position exceeding max', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        manager.setPosition(2);
        expect(manager.getValue()).toEqual(100);
    });

    it('calculates value for position exceeding min', function(){
        var manager;
        manager = new getManager({
            min: 10,
            max: 110
        });

        manager.setPosition(-2);
        expect(manager.getValue()).toEqual(0);
    });

    it('throws error if min greater than max', function(){
        function minIsGreaterThanMax() {
            var manager;
            manager = getManager();
            manager.setMin(manager.getMax() + 1);
        }

        expect(minIsGreaterThanMax).toThrow();
    });

    it('throws error if max is less than min', function(){
        function maxIsLessThanMin() {
            var manager;
            manager = getManager();
            manager.setMax(manager.getMin() - 1);
        }

        expect(maxIsLessThanMin).toThrow();
    });

    it('dispatches change', function(){
        var manager;
        manager = getManager({
            min: 10,
            max: 110
        });

        var spy = jasmine.createSpy('spy');

        manager.listenTo(manager, events.CHANGE, spy);
        manager.setPosition(0.5);
        manager.setValue(75);

        expect(spy.calls.count()).toEqual(2);
    });

    // TODO: Additional Coverage
    // Public API
    // addMarkerPositions(*args)
    // - add valid
    // - add invalid
    // - returns markers
    // removeMarkerPositions(*args)
    // - remove valid
    // - remove invalid
    // - returns markers
    // addMarkerValues(*args)
    // - add valid
    // - add invalid
    // removeMarkerValues(*args)
    // - remove valid
    // - remove invalid
    // Usage
    // - marker event should hand back all ellapsed markers between, new and old position

    it('adds marker positions', function(){
        var manager, positions, returnedPositions;

        manager   = getManager();
        positions = [0, 0.25, 0.5, 0.75, 1];
        ret       = manager.addMarkerPositions.apply(manager, positions);

        expect(ret).toEqual(positions);
        expect(manager.getMarkers()).toEqual(positions);
    });

    it('normalizes out of range positions', function(){
        var manager, positions, expectedMarkers;

        manager = getManager();
        positions = [-1, -2, 3, 4];
        expectedMarkers = [0, 1];

        manager.addMarkerPositions.apply(manager, positions);

        // if manager is working properly, it will normalize all out of range
        // positions to 0 and 1, which should result expected marker positions.
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('removes marker positions', function(){
        var manager, positions, removedPositions, ret, expectedMarkers;

        manager = getManager();
        positions = [0, 0.25, 0.5, 0.75, 1];

        // throw in a non-existing position to make it doesn't cause issues
        removedPositions = [0.25, 0.5, 0.75, 0.8];
        expectedMarkers = [0, 1];

        manager.addMarkerPositions.apply(manager, positions);

        ret = manager.removeMarkerPositions.apply(manager, removedPositions);

        expect(ret).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('adds marker values', function(){
        var manager, values, positions;

        manager   = getManager();
        values    = [0, 25, 50, 75, 100];
        positions = [0, 0.25, 0.5, 0.75, 1];
        ret       = manager.addMarkerValues.apply(manager, values);

        expect(ret).toEqual(positions);
        expect(manager.getMarkers()).toEqual(positions);
    });

    it('normalizes out of range values', function(){
        var manager, values, expectedMarkers, ret;

        manager = getManager();
        values = [-25, -50, 125, 150];
        expectedMarkers = [0, 1];
        ret = manager.addMarkerValues.apply(manager, values);

        expect(ret).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('removes marker values', function(){
        var manager, values, removedValues, expectedMarkers, ret;

        manager = getManager();
        values = [0, 25, 50, 75, 100];

        // throw in a non-existing value to make sure it causes no issues.
        removedValues = [25, 50, 75, 88];
        expectedMarkers = [0, 1];

        manager.addMarkerValues.apply(manager, values);

        ret = manager.removeMarkerValues.apply(manager, removedValues);

        expect(ret).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('dispatches marker', function(){
        var manager, markerSpy, positions;

        manager = getManager();
        markerSpy = jasmine.createSpy('marker');
        positions = [0, 0.25, 0.5, 0.75, 1];

        manager.on(events.MARKER, markerSpy);

        // add some markers using various methods
        manager.addMarkerPositions(0, 0.25);
        manager.addMarkerValues(50, 75, 100);

        // run manager through 0 - 1
        _.each(_.range(1, 101), function(pos, i, positions){
            manager.setPosition(pos/100);

            if(pos%25 === 0) {
                expect(markerSpy).toHaveBeenCalledWith(manager, [pos/100], 'incremental');
            }
        });

        // the marker at zero will not be called
        expect(markerSpy.calls.count()).toEqual(4);

        // run manager through 1 - 0
        _.each(_.range(99, -1, -1), function(pos, i, positions){
            manager.setPosition(pos/100);

            if(pos%25 === 0) {
                expect(markerSpy).toHaveBeenCalledWith(manager, [pos/100], 'decremental');
            }
        });

        // the 1 position will not be called
        expect(markerSpy.calls.count()).toEqual(8);
    });

}); // Eof describe
}); // Eof define
