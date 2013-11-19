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

    it('expects \'draggingConfiguration\' to be called on dragstart', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();

        manager.reset($actionTargets);

        manager.draggingConfiguration = actionSpy;

        var payload = EventHelpers.simulateDragStart(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects \'getData\' to be called on dragstart', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();

        manager.reset($actionTargets);

        manager.getData = actionSpy;

        var payload = EventHelpers.simulateDragStart(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects \'getDragImage\' to be called on dragstart', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();

        manager.reset($actionTargets);

        manager.getDragImage = actionSpy;

        var payload = EventHelpers.simulateDragStart(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects \'draggingStarted\' to be called on dragstart', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();
        var flag = false;

        manager.reset($actionTargets);

        // this call is defered, so we need an async test
        manager.draggingStarted = actionSpy;

        runs(function() {
            var payload = EventHelpers.simulateDragStart(
                $actionTargets.eq(0));

            setTimeout(function() {
                flag = true;
            }, 100);
        });

        waitsFor(function(){
            return flag;
        }, 200);

        runs(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
            expect(actionSpy.calls.length).toEqual(1);
        });

    });

    it('expects \'draggingEnded\' to be called on dragend', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();
        var flag = false;

        manager.reset($actionTargets);

        // this call is defered, so we need an async test
        manager.draggingEnded = actionSpy;

         var payload = EventHelpers.simulateDragEnd(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1][0]).toEqual($actionTargets.eq(0)[0]);
        expect(actionSpy.mostRecentCall.args[2]).toEqual('none');
    });



}); // Eof describe
}); // Eof define
