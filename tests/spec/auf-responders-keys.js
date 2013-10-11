define(function(require, exports, module) {

// Imports

var KeyResponder    = require('auf/ui/responders/keys');
var KeyInputManager = require('auf/ui/managers/key-input');
var EventHelpers    = require('lib/spec-helpers').Events;

describe('Key Responder', function() {

    var $input, $ctx, responder = null;

    // Setup

    beforeEach(function() {
        loadFixtures('responder-keys.html');
        $ctx = $('#jasmine-fixtures');
        $input = $ctx.find('#responder');
    });

    afterEach(function() {
        if(responder){
            responder.close();
        }
    });

    // Test Suite

    it('expects UI will trigger keydown', function() {
        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('keydown', actionSpy);

        EventHelpers.simulateKeyDown($input, 40);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('keydown', actionSpy);
    });

    it('expects UI will trigger keyup', function() {

        var actionSpy = jasmine.createSpy('eventSpy');

        $input.on('keyup', actionSpy);

        EventHelpers.simulateKeyUp($input, 40);
        expect(actionSpy).toHaveBeenCalled();

        $input.off('keyup', actionSpy);

    });

    it('expects onClose to be called', function() {
        // note the local assignment to of a scopedResponder
        // not using the suite's setup 'responder' var
        // we want to explicitely test close()

        var scopedResponder = new KeyResponder({
            el: $input
        });

        spyOn(scopedResponder, 'onClose').andCallThrough();

        scopedResponder.close();
        expect(scopedResponder.onClose).toHaveBeenCalled();
    });

    it('expects alternate KeyInputManager to be used (for Aubrey)', function() {
        var inputManager = new KeyInputManager({
            13: 'moveUp'   // reassigning return to moveUp
        });

        var actionUp = jasmine.createSpy('moveUp');
        var actionNewline = jasmine.createSpy('insertNewline');

        responder = new KeyResponder({
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

    it('expects key events to be removed', function() {
        // note the local assignment to of a scopedResponder
        // not using the suite's setup 'responder' var
        // we want to explicitely test onClose behavior()

        var keyDown = jasmine.createSpy('keyDown');
        var keyUp = jasmine.createSpy('keyUp');

        var scopedResponder = new KeyResponder({
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

    it('expects keyDown to be called', function() {

        var keyDown = jasmine.createSpy('keyDown');

        responder = new KeyResponder({
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

    it('expects keyUp to be called', function() {

        var keyUp = jasmine.createSpy('keyUp');
        responder = new KeyResponder({
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

    it('expects insertNewline to be called', function() {

        var action = jasmine.createSpy('insertNewline');
        responder = new KeyResponder({
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

    it('expects insertTab to be called', function() {

        var action = jasmine.createSpy('insertTab');
        responder = new KeyResponder({
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

    it('expects deleteBackward to be called', function() {

        var action = jasmine.createSpy('deleteBackward');
        responder = new KeyResponder({
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

    it('expects cancelOperation to be called', function() {

        var action = jasmine.createSpy('cancelOperation');
        responder = new KeyResponder({
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

    it('expects moveUp to be called', function() {

        var action = jasmine.createSpy('moveUp');
        responder = new KeyResponder({
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

    it('expects moveDown to be called', function() {

        var action = jasmine.createSpy('moveDown');
        responder = new KeyResponder({
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

    it('expects moveLeft to be called', function() {

        var action = jasmine.createSpy('moveLeft');
        responder = new KeyResponder({
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

    it('expects moveRight to be called', function() {

        var action = jasmine.createSpy('moveRight');
        responder = new KeyResponder({
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

    it('expects insertText to be calles', function() {
        var keyCode = {
            l: 76,
            u: 85,
            c: 67,
            y: 89
        };

        var action = jasmine.createSpy('insertText');
        responder = new KeyResponder({
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
