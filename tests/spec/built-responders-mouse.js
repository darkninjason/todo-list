define(function(require, exports, module) {

// Imports

var $              = require('jquery');
var MouseResponder = require('built/ui/responders/mouse').MouseResponder;
var helpers        = require('built/utils/helpers');
var EventHelpers   = require('lib/spec-helpers').Events;

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

    it('throws error when no input provided', function(){
        //EventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        function badInit() {
            new MouseResponder({});
        }

        expect(badInit).toThrow();
    });

    it('expects BUILT ID to be set', function(){

        expect(helpers.getElementId($input)).toEqual(undefined);

        responder = new MouseResponder({
            el: $input
        });

        expect(helpers.getElementId($input)).not.toEqual(undefined);
    });

    it('expects UI will trigger mousedown', function(){

        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('mousedown', actionSpy);

        EventHelpers.simulateMouseDown($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('mousedown', actionSpy);
    });

    it('expects UI will trigger mouseup', function(){
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('mouseup', actionSpy);

        EventHelpers.simulateMouseUp($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('mouseup', actionSpy);
    });

    it('expects UI will trigger mousemove', function(){

        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('mousemove', actionSpy);

        EventHelpers.simulateMouseMove($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('mousemove', actionSpy);
    });

    it('expects UI will trigger mouseenter', function(){

        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('mouseenter', actionSpy);

        EventHelpers.simulateMouseEnter($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('mouseenter', actionSpy);
    });

    it('expects UI will trigger mouseleave', function(){
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('mouseleave', actionSpy);

        EventHelpers.simulateMouseExit($input);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('mouseleave', actionSpy);
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

    it('expects traditional mouse move to be called', function() {
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

    it('expects non-traditional mouse move to be called with x, y change', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });

        EventHelpers.simulateMouseMove($input, 0, 0);
        EventHelpers.simulateMouseMove($input, 10, 10);

        expect(mouseMoved).toHaveBeenCalled();
    });

    it('expects non-traditional mouse move to be called with x change only', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });

        EventHelpers.simulateMouseMove($input, 0, 0);
        EventHelpers.simulateMouseMove($input, 10, 0);

        expect(mouseMoved).toHaveBeenCalled();
    });

    it('expects non-traditional mouse move to be called with y change only', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });

        EventHelpers.simulateMouseMove($input, 0, 0);
        EventHelpers.simulateMouseMove($input, 0, 10);

        expect(mouseMoved).toHaveBeenCalled();
    });

    it('expects non-traditional mouse move to be called after enabling and disableing', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });

        EventHelpers.simulateMouseMove($input, 2, 2);
        EventHelpers.simulateMouseMove($input, 10, 10);
        responder.enableMove(false);
        responder.enableMove(true);
        mouseMoved.reset();
        EventHelpers.simulateMouseMove($input, 3, 3);
        expect(mouseMoved).not.toHaveBeenCalled();
        EventHelpers.simulateMouseMove($input, 10, 10);
        expect(mouseMoved).toHaveBeenCalled();
    });

    it('expects non-traditional mouse move NOT to be called ', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });

        EventHelpers.simulateMouseMove($input, 10, 10);
        EventHelpers.simulateMouseMove($input, 10, 10);
        EventHelpers.simulateMouseMove($input, 10, 10);

        expect(mouseMoved).not.toHaveBeenCalled();
    });

    it('expects normal mouse move to not be called ', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true,
                accpetsTraditionalMouseMove: false
        });
        responder._mouseX = 1;
        responder._mouseY = 1;
        EventHelpers.simulateMouseMove($input, 1, 1);

        expect(mouseMoved).not.toHaveBeenCalled();
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
        EventHelpers.simulateMouseUp($input, 0, 0);
        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);
        expect(responder.clickCount()).toEqual(2);
    });

    it('should reset clicks to 0 after delay', function(){
        var flag = false;

        responder = new MouseResponder({
            el: $input,
            acceptsUpDown: true
        });

        runs(function() {
            EventHelpers.simulateMouseDown($input, 0, 0);

            setTimeout(function() {
                flag = true;
            }, responder.clickCountTimeout + 1);
        });

        waitsFor(function() {
            return flag;
        }, 'No input received', responder.clickCountTimeout * 2);

        runs(function() {
            EventHelpers.simulateMouseUp($input, 0, 0);
            expect(responder.clickCount()).toEqual(0);
        });
    });

    it('expects mouse enter and exit to be toggled', function() {
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

        responder.enableEnterExit(false);

        EventHelpers.simulateMouseEnter($input, 0, 0);
        EventHelpers.simulateMouseExit($input, 0, 0);

        responder.enableEnterExit(true);

        EventHelpers.simulateMouseEnter($input, 0, 0);
        EventHelpers.simulateMouseExit($input, 0, 0);

        expect(mouseEntered).toHaveBeenCalled();
        expect(mouseExited).toHaveBeenCalled();

        expect(mouseEntered.calls.length).toEqual(2);
        expect(mouseExited.calls.length).toEqual(2);
    });

    it('expects mouse up and down to be toggled', function() {
        var mouseUp = jasmine.createSpy('mouseUp');
        var mouseDown = jasmine.createSpy('mouseDown');

        responder = new MouseResponder({
                el: $input,
                mouseUp: mouseUp,
                mouseDown: mouseDown,
                acceptsUpDown: true
        });

        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        responder.enableUpDown(false);

        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        responder.enableUpDown(true);

        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        expect(mouseUp).toHaveBeenCalled();
        expect(mouseDown).toHaveBeenCalled();

        expect(mouseUp.calls.length).toEqual(2);
        expect(mouseDown.calls.length).toEqual(2);
    });

    it('expects mouse move to be toggled', function() {
        var mouseMoved = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
                el: $input,
                mouseMoved: mouseMoved,
                acceptsMove: true
        });

        EventHelpers.simulateMouseMove($input, 0, 0);

        responder.enableMove(false);

        EventHelpers.simulateMouseMove($input, 0, 0);

        responder.enableMove(true);

        EventHelpers.simulateMouseMove($input, 0, 0);

        expect(mouseMoved).toHaveBeenCalled();
        expect(mouseMoved.calls.length).toEqual(2);
    });

}); // eof describe
}); // eof define
