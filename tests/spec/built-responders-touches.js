define(function(require, exports, module) {

// Import

var $              = require('jquery');
var TouchResponder = require('built/core/responders/touches').TouchResponder;
var EventHelpers   = require('lib/spec-helpers').Events;

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

    it('throws error when no input provided', function(){
        //EventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        function badInit() {
            new TouchResponder({});
        }

        expect(badInit).toThrow();
    });

    it('triggered touchstart', function() {
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('touchstart', actionSpy);

        EventHelpers.simulateTouchStart($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('touchstart', actionSpy);

    });

    it('triggered touchmove', function() {
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('touchmove', actionSpy);

        EventHelpers.simulateTouchMove($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('touchmove', actionSpy);
    });

    it('triggered touchend', function() {
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('touchend', actionSpy);

        EventHelpers.simulateTouchEnd($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('touchend', actionSpy);
    });

    it('triggered touchcancel', function() {

        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('touchcancel', actionSpy);

        EventHelpers.simulateTouchCancel($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('touchcancel', actionSpy);
    });

    it('triggered TouchResponder.onClose', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var
        // We want to explicitely test close()

        var scopedResponder = new TouchResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').and.callThrough();

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

        setTimeout(function(){

        }, 500);
        EventHelpers.simulateTouchStart($input, 10, 10);
        EventHelpers.simulateTouchEnd($input);

        expect(touchStart).not.toHaveBeenCalled();
        expect(touchEnd).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(touchStart.calls.count()).toEqual(0);
        expect(touchEnd.calls.count()).toEqual(0);
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

    it('should count clicks', function(){
        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 0, 0);
        EventHelpers.simulateTouchEnd($input, 0, 0);
        EventHelpers.simulateTouchStart($input, 0, 0);
        EventHelpers.simulateTouchEnd($input, 0, 0);
        expect(responder.clickCount()).toEqual(2);
    });


    it('should reset clicks to 0 after delay', function(done){
        var flag = false;

        responder = new TouchResponder({
            el: $input
        });

        EventHelpers.simulateTouchStart($input, 0, 0);

        var action = function(){
            var deferred = $.Deferred();

            setTimeout(function() {
                EventHelpers.simulateTouchEnd($input, 0, 0);
                deferred.resolve();
            }, responder.clickCountTimeout + 1);

            return deferred.promise();
        };

        action().then(function(){
            expect(responder.clickCount()).toEqual(0);
            done();
        });

    });

}); // eof describe
}); // eof define
