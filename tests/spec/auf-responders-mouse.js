define(function(require, exports, module) {

// Imports

var MouseResponder = require('auf/ui/responders/mouse');
var $              = require('jquery');
var SpecHelpers    = require('lib/spec-helpers')
var EventHelpers   = SpecHelpers.Events;

describe('Responder: Mouse', function() {

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

    it('triggered mousedown', function(){
        var type     = 'mousedown';
        var e        = $.Event(type);
        var spyEvent = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered mouseup', function(){
        var type = 'mouseup';
        var e    = $.Event(type);
        var spy  = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered mousemove', function(){
        var type  = 'mousemove';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered mouseenter', function(){
        var type  = 'mouseenter';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered mouseleave', function(){
        var type  = 'mouseleave';
        var e     = $.Event(type);
        var spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered MouseResponder.onClose', function() {
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

    it('removes mouse events', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test onClose() behavior.

        var mouseDown       = jasmine.createSpy('mouseDown');
        var mouseup         = jasmine.createSpy('mouseup');
        var scopedResponder = new MouseResponder({
                el: $input,
                mouseDown: mouseDown,
                mouseup: mouseup
            });

        scopedResponder.close();

        EventHelpers.simulateMouseDown($input, 0, 0);
        EventHelpers.simulateMouseUp($input, 0, 0);

        expect(mouseDown).not.toHaveBeenCalled();
        expect(mouseup).not.toHaveBeenCalled();

        // This is probably a redundant check:
        expect(mouseDown.calls.length).toEqual(0);
        expect(mouseup.calls.length).toEqual(0);
    });

    it('calls mouseDown', function(){
        var spy = jasmine.createSpy('mouseDown');

        responder = new MouseResponder({
            el: $input,
            mouseDown: spy
        });

        EventHelpers.simulateMouseDown($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseUp', function(){
        var spy = jasmine.createSpy('mouseUp');

        responder = new MouseResponder({
            el: $input,
            mouseUp: spy
        });

        EventHelpers.simulateMouseUp($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseEntered', function(){
        var spy = jasmine.createSpy('mouseEntered');

        responder = new MouseResponder({
            el: $input,
            mouseEntered: spy,
            acceptsEnterExit: true
        });

        EventHelpers.simulateMouseEnter($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseExited', function(){
        var spy = jasmine.createSpy('mouseExited');

        responder = new MouseResponder({
            el: $input,
            mouseExited: spy,
            acceptsEnterExit: true
        });

        EventHelpers.simulateMouseExit($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseMoved', function(){
        var spy = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
            el: $input,
            mouseMoved: spy,
            acceptsMove: true
        });

        EventHelpers.simulateMouseMove($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseDragged', function(){
        var spy = jasmine.createSpy('mouseDragged');

        responder = new MouseResponder({
            el: $input,
            mouseDragged: spy
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, 10, 10);
        expect(spy).toHaveBeenCalled();
    });

    it('tracks deltas', function(){
        responder = new MouseResponder({
            el: $input
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, 10, 10);
        expect(responder.deltaX()).toEqual(10);
        expect(responder.deltaY()).toEqual(10);

    });

    it('tracks negatvie deltas', function(){
        responder = new MouseResponder({
            el: $input
        });

        EventHelpers.simulateMouseDragged($input, 0, 0, -10, -10);
        expect(responder.deltaX()).toEqual(-10);
        expect(responder.deltaY()).toEqual(-10);

    });

    it('counts clicks', function(){
        responder = new MouseResponder({
            el: $input
        });

        EventHelpers.simulateMouseDown($input, 0, 0);
        expect(responder.clickCount()).toEqual(1);
    });

}); // eof describe
}); // eof define
