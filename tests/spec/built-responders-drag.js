define(function(require, exports, module) {

// Imports

var DragResponder = require('built/core/responders/drag').DragResponder;
var helpers  = require('built/core/utils/helpers');
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

    it('expects BUILT IDs to be set', function(){

        var manager = getManager();

        expect(helpers.getElementId($actionTargets.eq(0))).toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(1))).toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(2))).toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(3))).toEqual(undefined);

        manager.reset($actionTargets);

        expect(helpers.getElementId($actionTargets.eq(0))).not.toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(1))).not.toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(2))).not.toEqual(undefined);
        expect(helpers.getElementId($actionTargets.eq(3))).not.toEqual(undefined);

    });

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

        manager.reset($actionTargets);
        manager.draggingEnded = actionSpy;


         var payload = EventHelpers.simulateDragEnd(
            $actionTargets.eq(0));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1][0]).toEqual($actionTargets.eq(0)[0]);
        expect(actionSpy.mostRecentCall.args[2]).toEqual('none');
    });

    it('disables dragging events on removed objects', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();
        var flag = false;
        var $candidate = $actionTargets.eq(0);

        manager.reset($actionTargets);
        manager.removeElement($candidate);

        // draggingStarted is a defered call,
        // so we need an async test
        manager.draggingStarted = actionSpy;
        manager.draggingEnded = actionSpy;

        runs(function(){
            var e;
            EventHelpers.simulateDragStart(
                $candidate);

            EventHelpers.simulateDragEnd(
                $candidate);

            setTimeout(function() {
                flag = true;
            }, 100);
        });

        waitsFor(function(){
            return flag;
        }, 200);

        runs(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            expect(actionSpy.calls.length).toEqual(0);
        });

    });

    it('disables all dragging events on close', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager();
        var flag = false;

        manager.reset($actionTargets);
        manager.close();

        // draggingStarted is a defered call,
        // so we need an async test
        manager.draggingStarted = actionSpy;
        manager.draggingEnded = actionSpy;

        runs(function(){
            _.each($actionTargets, function(each){
                var $el = $(each);
                EventHelpers.simulateDragStart($el);
                EventHelpers.simulateDragEnd($el);
            });

            setTimeout(function() {
                flag = true;
            }, 100);
        });

        waitsFor(function(){
            return flag;
        }, 200);

        runs(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            expect(actionSpy.calls.length).toEqual(0);
        });

    });

    it('throws error when removing non-AUF element', function(){
        function badAction() {
            var manager = getManager();
            manager.reset($actionTargets);
            manager.removeElement($('<li>Foo</li>'));
        }

        expect(badAction).toThrow();
    });

}); // Eof describe
}); // Eof define
