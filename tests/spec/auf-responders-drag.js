define(function(require, exports, module) {

// Imports

var DragResponder = require('auf/ui/responders/drag').DragResponder;
var spechelpers  = require('lib/spec-helpers');
var EventHelpers = spechelpers.Events;

describe('Drag Responder', function() {

    var $context;
    var $actionTargets;

    // Set Up

    beforeEach(function() {
        loadFixtures('responder-drag.html');
        $context = $('#jasmine-jquery-context');
        $actionTargets = $context.find('ul li');

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
        return new DragResponder(getOptions(augments));
    }

    // Test Suite

    xit('throws error when no non-array provided on init', function(){
        function badInit() {
            new array.ArrayManager({list: $items});
        }

        expect(badInit).toThrow();
    });

    xit('throws error when no non-array provided on set', function(){
        function badInit() {
            manager = new array.ArrayManager();
            manager.setArray(123);
        }

        expect(badInit).toThrow();
    });

    it('expects draggingConfiguration to be called on dragstart', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = this.getManager();

        manager.reset($actionTargets);

        manager.draggingConfiguration = actionSpy;

        EventHelpers.simulateDragStart(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalledWith(manager);
        expect(actionSpy.calls.length).toEqual(1);

    });



}); // Eof describe
}); // Eof define
