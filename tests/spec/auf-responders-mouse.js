define(function(require, exports, module) {

// Imports

var MouseResponder = require('auf/ui/responders/mouse');
var $              = require('vendor/jquery');

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

    // Helpers

    function simulateEvent($el, type, x, y){
        var e = $.Event(type);

        e.pageX = x;
        e.pageY = y;
        e.target = $el[0];
        e.currentTarget = $el[0];

        $el.trigger(e);

        return e;
    }

    function simulateMouseDown($el, x, y) {
        return simulateEvent($el, 'mousedown', x, y);
    }
    function simulateMouseUp($el, x, y) {
        return simulateEvent($el, 'mouseup', x, y);
    }
    function simulateMouseMove($el, x, y) {
        return simulateEvent($el, 'mousemove', x, y);
    }
    function simulateMouseDragged($el, startX, startY, endX, endY) {
        simulateMouseDown($input, startX, startY);
        simulateMouseMove($input, endX, endY);
        simulateMouseUp($input, endX, endY);
    }

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

        simulateMouseDown($input, 0, 0);
        simulateMouseUp($input, 0, 0);

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

        simulateMouseDown($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseUp', function(){
        var spy = jasmine.createSpy('mouseUp');

        responder = new MouseResponder({
            el: $input,
            mouseUp: spy
        });

        simulateMouseUp($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseMoved', function(){
        var spy = jasmine.createSpy('mouseMoved');

        responder = new MouseResponder({
            el: $input,
            mouseMoved: spy,
            acceptsMoveEvents: true
        });

        simulateMouseMove($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseDragged', function(){
        var spy = jasmine.createSpy('mouseDragged');

        responder = new MouseResponder({
            el: $input,
            mouseDragged: spy
        });

        simulateMouseDragged($input, 0, 0, 10, 10);
        expect(spy).toHaveBeenCalled();
    });

    it('tracks deltas', function(){
        responder = new MouseResponder({
            el: $input
        });

        simulateMouseDragged($input, 0, 0, 10, 10);
        expect(responder.deltaX()).toEqual(10);
        expect(responder.deltaY()).toEqual(10);

    });

    it('tracks negatvie deltas', function(){
        responder = new MouseResponder({
            el: $input
        });

        simulateMouseDragged($input, 0, 0, -10, -10);
        expect(responder.deltaX()).toEqual(-10);
        expect(responder.deltaY()).toEqual(-10);

    });

    it('counts clicks', function(){
        responder = new MouseResponder({
            el: $input
        });

        simulateMouseDown($input, 0, 0);
        expect(responder.clickCount()).toEqual(1);
    });

}); // eof describe
}); // eof define
