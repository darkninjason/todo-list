define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers    = require('lib/spec-helpers').Events;
WindowResponder = require('built/core/responders/window').WindowResponder;

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
        expect(actionSpy.calls.count()).toEqual(1);
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
        expect(actionSpy.calls.count()).toEqual(1);
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
        expect(actionSpy.calls.count()).toEqual(1);
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

    it('debounces resize', function(done){

        var actionSpy = jasmine.createSpy('actionSpy');
        var responder = getResponder({
            resize: actionSpy,
            resizeDebounce: 200
        });

        var action = function(){
            var deferred = $.Deferred();
            var count = 0;
            var id;

            id = setInterval(function() {
                EventHelpers.simulateWindowResize($(window));
                count++;

                if(count > 4) {
                    clearInterval(id);

                    // allow time for debounce to execute
                    setTimeout(function() {
                        deferred.resolve();
                    }, 225);
                }
            }, 100);

            return deferred.promise();
        };

        action().then(function(){
            expect(actionSpy.calls.count()).toEqual(1);
            done();
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
