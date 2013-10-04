define(function(require, exports, module) {

// Import

var TouchResponder = require('auf/ui/responders/touches');
var $              = require('jquery');
var SpecHelpers    = require('lib/spec-helpers');
var EventHelpers   = SpecHelpers.Events;

describe('Responder: Touch', function() {

    var $input, responder = null;

    // Setup

    beforeEach(function() {
        loadFixtures('responder-touches.html');
        $input = $('#responder');
    });

    afterEach(function() {
        if(responder) {
            responder.close();
        }
    });

    // Test Suite

    it('triggered touchstart', function() {

        var touch    = $.Event('touchstart');
        var spyEvent = spyOnEvent($input, 'touchstart');

        $input.trigger(touch);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered touchmove', function() {

        var touch    = $.Event('touchmove');
        var spyEvent = spyOnEvent($input, 'touchmove');

        $input.trigger(touch);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered touchend', function() {

        var touch    = $.Event('touchend');
        var spyEvent = spyOnEvent($input, 'touchend');

        $input.trigger(touch);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered touchcancel', function() {

        var touch = $.Event('touchcancel');
        var spyEvent = spyOnEvent($input, 'touchcancel');

        $input.trigger(touch);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered TouchResponder.onClose', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var
        // We want to explicitely test close()

        var scopedResponder = new TouchResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').andCallThrough();

        scopedResponder.close();
        expect(scopedResponder.onClose).toHaveBeenCalled();
    });

    it('removes touch events', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var
        // We want to explicitely test onClose behavior.

        var touchStart      = jasmine.createSpy('touchStart');
        var touchEnd        = jasmine.createSpy('touchEnd');
        var scopedResponder = new TouchResponder({
                el: $input,
                touchStart: touchStart,
                touchEnd: touchEnd
            });

        scopedResponder.close();

        EventHelpers.simulateTouchStart($input, 10, 10);
        EventHelpers.simulateTouchEnd($input);

        expect(touchStart).not.toHaveBeenCalled();
        expect(touchEnd).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(touchStart.calls.length).toEqual(0);
        expect(touchEnd.calls.length).toEqual(0);
    });

    it('calls touchStart', function() {

        var touchStart = jasmine.createSpy('touchStart');

        responder = new TouchResponder({
            el: $input,
            touchStart: touchStart
        });

        EventHelpers.simulateTouchStart($input, 0, 0);
        expect(touchStart).toHaveBeenCalled();
    });

    it('calls touchMove', function() {

        var touchMove = jasmine.createSpy('touchMove');

        responder = new TouchResponder({
            el: $input,
            touchMove: touchMove
        });

        EventHelpers.simulateTouchMove($input, 0, 0);
        expect(touchMove).toHaveBeenCalled();
    });

    it('calls touchEnd', function() {

        var touchEnd = jasmine.createSpy('touchEnd');

        responder = new TouchResponder({
            el: $input,
            touchEnd: touchEnd
        });

        EventHelpers.simulateTouchEnd($input, 0, 0);
        expect(touchEnd).toHaveBeenCalled();
    });

    it('calls touchCancel', function() {

        var touchCancel = jasmine.createSpy('touchCancel');

        responder = new TouchResponder({
            el: $input,
            touchCancel: touchCancel
        });

        EventHelpers.simulateTouchCancel($input);
        expect(touchCancel).toHaveBeenCalled();
    });

    it('calculates deltaX negative', function() {

        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 200, 200);
        EventHelpers.simulateTouchMove($input, 0, 200);

        expect(responder.deltaX()[0]).toEqual(-200);
    });

    it('calculates deltaX positive', function() {

        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 200, 200);
        EventHelpers.simulateTouchMove($input, 400, 200);

        expect(responder.deltaX()[0]).toEqual(200);
    });

    it('calculates deltaY negative', function() {

        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 200, 200);
        EventHelpers.simulateTouchMove($input, 200, 0);

        expect(responder.deltaY()[0]).toEqual(-200);
    });

    it('calculates deltaY positive', function() {

        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 200, 200);
        EventHelpers.simulateTouchMove($input, 200, 400);

        expect(responder.deltaY()[0]).toEqual(200);
    });

}); // eof describe
}); // eof define
