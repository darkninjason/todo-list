define(function(require, exports, module) {

// Imports

var MouseResponder = require('auf/ui/responders/mouse');
var $              = require('jquery');
var SpecHelpers    = require('lib/spec-helpers');
var EventHelpers   = SpecHelpers.Events;

describe('Mouse Responder', function() {

    var $input, responder = null;

    // Setup

    beforeEach(function() {
        loadFixtures('responder-mouse.html');
        $input = $('#responder');
    });

    afterEach(function() {
        if(responder){
            responder.close();
        }
    });

    // Test Suite

    it('expects UI will trigger mousedown', function(){
        var type     = 'mousedown';
        var e        = $.Event(type);
        var spyEvent = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('expects UI will trigger mouseup', function(){
        var type = 'mouseup';
        var e    = $.Event(type);
        var spy  = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('expects UI will trigger mousemove', function(){
        var type  = 'mousemove';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('expects UI will trigger mouseenter', function(){
        var type  = 'mouseenter';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('expects UI will trigger mouseleave', function(){
        var type  = 'mouseleave';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('expects onClose to be called', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test close().

        var scopedResponder = new MouseResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').andCallThrough();

        scopedResponder.close();
        expect(scopedResponder.onClose).toHaveBeenCalled();
    });

    it('expects mouse up and mouse down to be called', function() {
        var mouseDown       = jasmine.createSpy('mouseDown');
        var mouseUp         = jasmine.createSpy('mouseup');

        responder = new MouseResponder({
                el: $input,
                mouseDown: mouseDown,
                mouseUp: mouseUp,
                acceptsUpDown: true
        });


        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        expect(mouseDown).toHaveBeenCalled();
        expect(mouseUp).toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseDown.calls.length).toEqual(1);
        expect(mouseUp.calls.length).toEqual(1);
    });

    it('expects mouse up and mouse down not to be called', function() {
        var mouseDown       = jasmine.createSpy('mouseDown');
        var mouseUp         = jasmine.createSpy('mouseup');

        responder = new MouseResponder({
                el: $input,
                mouseDown: mouseDown,
                mouseUp: mouseUp,
                acceptsUpDown: false
        });


        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        expect(mouseDown).not.toHaveBeenCalled();
        expect(mouseUp).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseDown.calls.length).toEqual(0);
        expect(mouseUp.calls.length).toEqual(0);
    });

    it('expects mouse up and mouse down to be removed', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test onClose() behavior.

        var mouseDown       = jasmine.createSpy('mouseDown');
        var mouseUp         = jasmine.createSpy('mouseUp');
        var scopedResponder = new MouseResponder({
                el: $input,
                mouseDown: mouseDown,
                mouseUp: mouseUp,
                acceptsUpDown: true
            });

        scopedResponder.close();

        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        expect(mouseDown).not.toHaveBeenCalled();
        expect(mouseUp).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseDown.calls.length).toEqual(0);
        expect(mouseUp.calls.length).toEqual(0);
    });

    it('expects mouse enter and exit to be called', function() {
        var mouseEntered = jasmine.createSpy('mouseEntered');
        var mouseExited = jasmine.createSpy('mouseExited');

        responder = new MouseResponder({
                el: $input,
                mouseEntered: mouseEntered,
                mouseExited: mouseExited,
                acceptsEnterExit: true
        });

        EventHelpers.simulateMouseEnter($input, 0, 0);
        EventHelpers.simulateMouseExit($input, 0, 0);

        expect(mouseEntered).toHaveBeenCalled();
        expect(mouseExited).toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseEntered.calls.length).toEqual(1);
        expect(mouseExited.calls.length).toEqual(1);
    });

    it('expects mouse enter and exit not to be called', function() {
        var mouseEntered = jasmine.createSpy('mouseEntered');
        var mouseExited = jasmine.createSpy('mouseExited');

        responder = new MouseResponder({
                el: $input,
                mouseEntered: mouseEntered,
                mouseExited: mouseExited,
                acceptsEnterExit: false
        });

        EventHelpers.simulateMouseEnter($input, 0, 0);
        EventHelpers.simulateMouseExit($input, 0, 0);

        expect(mouseEntered).not.toHaveBeenCalled();
        expect(mouseExited).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseEntered.calls.length).toEqual(0);
        expect(mouseExited.calls.length).toEqual(0);
    });

    it('expects mouse enter and mouse exit to be removed', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test onClose() behavior.

        var mouseEntered = jasmine.createSpy('mouseEntered');
        var mouseExited = jasmine.createSpy('mouseExited');

        var scopedResponder = new MouseResponder({
                el: $input,
                mouseEntered: mouseEntered,
                mouseExited: mouseExited,
                acceptsEnterExit: true
        });

        scopedResponder.close();

        EventHelpers.simulateMouseEnter($input, 0, 0);
        EventHelpers.simulateMouseExit($input, 0, 0);

        expect(mouseEntered).not.toHaveBeenCalled();
        expect(mouseExited).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseEntered.calls.length).toEqual(0);
        expect(mouseExited.calls.length).toEqual(0);
    });

    it('expects mouse move to be called', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true
        });

        EventHelpers.simulateMouseMove($input, 0, 0);

        expect(mouseMoved).toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseMoved.calls.length).toEqual(1);
    });

    it('expects mouse move not to be called', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: false
        });

        EventHelpers.simulateMouseMove($input, 0, 0);

        expect(mouseMoved).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseMoved.calls.length).toEqual(0);
    });

    it('expects mouse move to be removed', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test onClose() behavior.

        var mouseMoved = jasmine.createSpy('mouseMoved');

        var scopedResponder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true
        });

        scopedResponder.close();

        EventHelpers.simulateMouseMove($input, 0, 0);

        expect(mouseMoved).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseMoved.calls.length).toEqual(0);
    });

    it('expectes mouse dragged to be called', function(){
        var spy = jasmine.createSpy('mouseDragged');

        responder = new MouseResponder({
            el: $input,
            mouseDragged: spy,
            acceptsUpDown: true
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, 10, 10);
        expect(spy).toHaveBeenCalled();
    });

    it('should report deltas', function(){
        responder = new MouseResponder({
            el: $input,
            acceptsUpDown: true
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, 10, 10);
        expect(responder.deltaX()).toEqual(10);
        expect(responder.deltaY()).toEqual(10);

    });

    it('should report negatvie deltas', function(){
        responder = new MouseResponder({
            el: $input,
            acceptsUpDown: true
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, -10, -10);
        expect(responder.deltaX()).toEqual(-10);
        expect(responder.deltaY()).toEqual(-10);

    });

    it('should count clicks', function(){
        responder = new MouseResponder({
            el: $input,
            acceptsUpDown: true
        });

        EventHelpers.simulateMouseDown($input, 0, 0);
        expect(responder.clickCount()).toEqual(1);
    });

}); // eof describe
}); // eof define
