define(function(require, exports, module) {

var mouse = require('auf/ui/responders/mouse'),
    $     = require('vendor/jquery');

describe('Mouse Responder', function() {

    var $input, responder = null;

    // Setup
    // ==================================================================== //

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
    // ==================================================================== //

    function simulateEvent($el, type, x, y){
        var e    = $.Event(type);

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

    // Test Suite
    // ==================================================================== //

    it('triggered mousedown', function(){
        var type = 'mousedown',
            e    = $.Event(type),
            spy  = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered mouseup', function(){
        var type = 'mouseup',
            e    = $.Event(type),
            spy  = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered mousemove', function(){
        var type  = 'mousemove',
            e     = $.Event(type),
            spy   = spyOnEvent($input, type);

        $input.trigger(e);
        expect(spy).toHaveBeenTriggered();
    });

    it('triggered MouseResponder.onClose', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test close().

        var scopedResponder = new mouse.MouseResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').andCallThrough();

        scopedResponder.close();
        expect(scopedResponder.onClose).toHaveBeenCalled();
    });

    it('removes mouse events', function() {
        // Note the local assignment to of a scopedResponder,
        // not using the suite's setup 'responder' var.
        // We want to explicitely test close().

        var mouseDown       = jasmine.createSpy('mouseDown'),
            mouseup         = jasmine.createSpy('mouseup'),
            scopedResponder = new mouse.MouseResponder({
                el: $input,
                mouseDown: mouseDown,
                mouseup: mouseup
            });

        scopedResponder.close();

        simulateMouseDown($input, 0, 0);
        simulateMouseUp($input, 0, 0);

        expect(mouseDown).not.toHaveBeenCalled();
        expect(mouseup).not.toHaveBeenCalled();

        // this is probably a redundant check:
        expect(mouseDown.calls.length).toEqual(0);
        expect(mouseup.calls.length).toEqual(0);
    });

    it('calls mouseDown', function(){
        var spy       = jasmine.createSpy('mouseDown'),
            responder = new mouse.MouseResponder({
                el: $input,
                mouseDown: spy
            });

        simulateMouseDown($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseUp', function(){
        var spy       = jasmine.createSpy('mouseUp'),
            responder = new mouse.MouseResponder({
                el: $input,
                mouseUp: spy
            });

        simulateMouseUp($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseMoved', function(){
        var spy       = jasmine.createSpy('mouseMoved'),
            responder = new mouse.MouseResponder({
                el: $input,
                mouseMoved: spy,
                acceptsMoveEvents: true
            });

        simulateMouseMove($input, 0, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('calls mouseDragged', function(){
        var spy       = jasmine.createSpy('mouseDragged'),
            responder = new mouse.MouseResponder({
                el: $input,
                mouseDragged: spy
            });

        // Drag it!
        simulateMouseDown($input, 0, 0);
        simulateMouseMove($input, 10, 10);
        simulateMouseUp($input, 10, 10);

        expect(spy).toHaveBeenCalled();
    });

    it('properly tracks dragged deltas', function(){
        var responder = new mouse.MouseResponder({
            el: $input
        });

        simulateMouseDown($input, 0, 0);
        simulateMouseMove($input, 10, 10);
        simulateMouseUp($input, 10, 10);

        expect(responder.deltaX()).toEqual(10);
        expect(responder.deltaY()).toEqual(10);

    });

    it('counts clicks', function(){
        var responder = new mouse.MouseResponder({
                el: $input
            });

        // Drag it!
        simulateMouseDown($input, 0, 0);
        expect(responder.clickCount()).toEqual(1);
    });

}); // eof describe
}); // eof define
