define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers    = require('lib/spec-helpers').Events;
WindowResponder = require('auf/ui/responders/window').WindowResponder;

describe('Window Responder', function() {

    // Setup

    beforeEach(function() {
    });

    afterEach(function() {
    });

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            acceptsOrientation: true,
            acceptsResize: true,
            resizeDebounce: 0
        };

        return _.extend(testSuiteDefaults, augments);
    }
    function getResponder(augments) {
        return new WindowResponder(getOptions(augments));
    }

    // Test Suite

    it('expects orientation landscape -90', function(){
        var actionSpy, responder;

        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            landscape: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeLeft($(window));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects orientation landscape 90', function(){
        var actionSpy, responder;

        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            landscape: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects orientation portrait 0', function(){
        var actionSpy, responder;

        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            portrait: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects window resize', function(){
        var actionSpy, responder;

        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            resize: actionSpy
        });

        EventHelpers.simulateWindowResize();

        expect(actionSpy).toHaveBeenCalled();
    });

    it('debounces resize', function(){
        var flag, count, actionSpy, responder;

        flag = false;
        count = 0;
        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            resize: actionSpy,
            resizeDebounce: 200
        });

        runs(function() {
            id = setInterval(function() {
                EventHelpers.simulateWindowResize($(window));
                count++;

            if(count > 4) {
                clearInterval(id);

                // allow time for debounce to execute
                setTimeout(function() {
                    flag = true;
                }, 225);
            }

            }, 100);
        });

        waitsFor(function() {
            return flag;
        }, 'Timeout expired', 1000);

        runs(function() {
            expect(actionSpy.calls.length).toEqual(1);
        });

    });


    it('expects orientation events to not be called', function(){
        var actionSpy, responder;

        actionSpy = jasmine.createSpy('actionSpy');
        responder = getResponder({
            portrait: actionSpy,
            landscape: actionSpy
        });

        responder.close();

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));
        EventHelpers.simulateOrientationLandscapeLeft($(window));

        expect(actionSpy).not.toHaveBeenCalled();
    });

}); // eof describe
}); // eof define
