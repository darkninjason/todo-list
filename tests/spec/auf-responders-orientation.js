define(function(require, exports, module) {

// Imports

var $                    = require('jquery');
var OrientationResponder = require('auf/ui/responders/orientation');
var EventHelpers         = require('lib/spec-helpers').Events;

describe('Orientation Responder', function() {

    var responder = null;

    // Setup

    beforeEach(function() {
    });

    afterEach(function() {
        if(responder){
            responder.close();
        }
    });

    // Test Suite

    it('expects orientation landscape -90', function(){

        var actionSpy = jasmine.createSpy('actionSpy');

        responder = new OrientationResponder({
            landscape: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeLeft($(window));
        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects orientation landscape 90', function(){

        var actionSpy = jasmine.createSpy('actionSpy');

        responder = new OrientationResponder({
            landscape: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));
        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects orientation portrait 0', function(){

        var actionSpy = jasmine.createSpy('actionSpy');

        responder = new OrientationResponder({
            portrait: actionSpy
        });

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));
        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
    });

    it('expects orientation events to not be called', function(){

        var actionSpy = jasmine.createSpy('actionSpy');

        var scopedResponder = new OrientationResponder({
            portrait: actionSpy,
            landscape: actionSpy
        });

        scopedResponder.close();

        EventHelpers.simulateOrientationPortrait($(window));
        EventHelpers.simulateOrientationLandscapeRight($(window));
        EventHelpers.simulateOrientationLandscapeLeft($(window));

        expect(actionSpy).not.toHaveBeenCalled();
    });

}); // eof describe
}); // eof define
