define(function(require, exports, module) {

var keys = require('auf/ui/responders/keys');

describe('Key Responder', function() {

    var $input, responder = null;

    // Setup
    // ==================================================================== //

    beforeEach(function() {
        loadFixtures('responder-keys.html');
        $input = $('#responder');
    });

    afterEach(function() {
        if(responder){
            responder.close();
        }
    });

    // Test Suite
    // ==================================================================== //

    it('triggered keydown', function() {

        var key      = jQuery.Event('keydown'),
            spyEvent = spyOnEvent($input, 'keydown');

        key.which   = 40;
        key.keyCode = 40;

        $input.trigger(key);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered keyup', function() {

        var key      = jQuery.Event('keyup'),
            spyEvent = spyOnEvent($input, 'keyup');

        key.which   = 40;
        key.keyCode = 40;

        $input.trigger(key);
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('triggered KeyResponder.onClose', function() {
        // note the local assignment to of a scopedResponder
        // not using the suite's setup 'responder' var
        // we want to explicitely test close()

        var scopedResponder = new keys.KeyResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').andCallThrough();

        scopedResponder.close();
        expect(scopedResponder.onClose).toHaveBeenCalled();
    });

    it('uses alternate KeyInputManager (for Aubrey)', function() {
        var inputManager = new keys.KeyInputManager({
            13: 'moveUp'   // reassigning return to moveUp
        });

        var actionUp = jasmine.createSpy('moveUp');
        var actionNewline = jasmine.createSpy('insertNewline');

        responder = new keys.KeyResponder({
            el: $input,
            moveUp: actionUp,
            insertNewline: actionNewline,
            inputManager: inputManager
        });

        var key = jQuery.Event('keydown');
        key.which = 13;
        key.keyCode = 13;

        $input.trigger(key);
        expect(actionUp).toHaveBeenCalled();
        expect(actionUp).toHaveBeenCalledWith(responder, key);
        expect(actionNewline).not.toHaveBeenCalled();
    });

    it('removes key events', function() {
        // note the local assignment to of a scopedResponder
        // not using the suite's setup 'responder' var
        // we want to explicitely test onClose behavior()

        var keyDown = jasmine.createSpy('keyDown');
        var keyUp = jasmine.createSpy('keyUp');

        var scopedResponder = new keys.KeyResponder({
            el: $input,
            keyDown: keyDown,
            keyUp: keyUp
        });

        scopedResponder.close();

        var downEvent = jQuery.Event('keydown');
        downEvent.which = 40;
        downEvent.keyCode = 40;

        var upEvent = jQuery.Event('keyup');
        upEvent.which = 40;
        upEvent.keyCode = 40;

        $input.trigger(downEvent);
        $input.trigger(upEvent);

        expect(keyDown).not.toHaveBeenCalled();
        expect(keyUp).not.toHaveBeenCalled();

        // this is probably a redundant check:
        expect(keyDown.calls.length).toEqual(0);
        expect(keyUp.calls.length).toEqual(0);
    });

    it('calls keyDown', function() {

        var keyDown = jasmine.createSpy('keyDown');

        responder = new keys.KeyResponder({
            el: $input,
            keyDown: keyDown
        });

        var key = jQuery.Event('keydown');
        key.which = 40;
        key.keyCode = 40;

        $input.trigger(key);
        expect(keyDown).toHaveBeenCalled();
        expect(keyDown).toHaveBeenCalledWith(responder, key);
    });

    it('calls keyUp', function() {

        var keyUp = jasmine.createSpy('keyUp');
        responder = new keys.KeyResponder({
            el: $input,
            keyUp: keyUp
        });

        var key = jQuery.Event('keyup');
        key.which = 40;
        key.keyCode = 40;

        $input.trigger(key);
        expect(keyUp).toHaveBeenCalled();
        expect(keyUp).toHaveBeenCalledWith(responder, key);
    });

    it('handles RETURN', function() {

        var action = jasmine.createSpy('insertNewline');
        responder = new keys.KeyResponder({
            el: $input,
            insertNewline: action
        });

        var key = jQuery.Event('keydown');
        key.which = 13;
        key.keyCode = 13;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles TAB', function() {

        var action = jasmine.createSpy('insertTab');
        responder = new keys.KeyResponder({
            el: $input,
            insertTab: action
        });

        var key = jQuery.Event('keydown');
        key.which = 9;
        key.keyCode = 9;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles DELETE', function() {

        var action = jasmine.createSpy('deleteBackward');
        responder = new keys.KeyResponder({
            el: $input,
            deleteBackward: action
        });

        var key = jQuery.Event('keydown');
        key.which = 8;
        key.keyCode = 8;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles ESC', function() {

        var action = jasmine.createSpy('cancelOperation');
        responder = new keys.KeyResponder({
            el: $input,
            cancelOperation: action
        });

        var key = jQuery.Event('keydown');
        key.which = 27;
        key.keyCode = 27;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles UP', function() {

        var action = jasmine.createSpy('moveUp');
        responder = new keys.KeyResponder({
            el: $input,
            moveUp: action
        });

        var key = jQuery.Event('keydown');
        key.which = 38;
        key.keyCode = 38;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles DOWN', function() {

        var action = jasmine.createSpy('moveDown');
        responder = new keys.KeyResponder({
            el: $input,
            moveDown: action
        });

        var key = jQuery.Event('keydown');
        key.which = 40;
        key.keyCode = 40;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles LEFT', function() {

        var action = jasmine.createSpy('moveLeft');
        responder = new keys.KeyResponder({
            el: $input,
            moveLeft: action
        });

        var key = jQuery.Event('keydown');
        key.which = 37;
        key.keyCode = 37;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles RIGHT', function() {

        var action = jasmine.createSpy('moveRight');
        responder = new keys.KeyResponder({
            el: $input,
            moveRight: action
        });

        var key = jQuery.Event('keydown');
        key.which = 39;
        key.keyCode = 39;

        $input.trigger(key);
        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, key);
    });

    it('handles TEXT (lucy)', function() {
        var keyCode = {
            l: 76,
            u: 85,
            c: 67,
            y: 89
        };

        var action = jasmine.createSpy('insertText');
        responder = new keys.KeyResponder({
            el: $input,
            insertText: action
        });

        var lEvent = jQuery.Event('keydown');
        lEvent.which = keyCode.l;
        lEvent.keyCode = keyCode.l;

        var uEvent = jQuery.Event('keydown');
        uEvent.which = keyCode.u;
        uEvent.keyCode = keyCode.u;

        var cEvent = jQuery.Event('keydown');
        cEvent.which = keyCode.c;
        cEvent.keyCode = keyCode.c;

        var yEvent = jQuery.Event('keydown');
        yEvent.which = keyCode.y;
        yEvent.keyCode = keyCode.y;

        $input.trigger(lEvent);
        $input.trigger(uEvent);
        $input.trigger(cEvent);
        $input.trigger(yEvent);

        expect(action).toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(responder, lEvent);
        expect(action).toHaveBeenCalledWith(responder, uEvent);
        expect(action).toHaveBeenCalledWith(responder, cEvent);
        expect(action).toHaveBeenCalledWith(responder, yEvent);
        expect(action.calls.length).toEqual(4);
    });

}); // eof describe
}); // eof define
