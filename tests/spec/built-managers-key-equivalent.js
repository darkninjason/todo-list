define(function(require, exports, module) {

// Imports

var _         = require('underscore');
var KeyEquivalentManager = require('built/core/managers/key-equivalent').KeyEquivalentManager;
var KeyModifier          = require('built/core/managers/key-equivalent').KeyModifier;
var EventHelpers         = require('lib/spec-helpers').Events;
var KeyCodes             = require('lib/spec-helpers').KeyCodes;


describe('Key Equivalent Manager', function() {

    var manager = null;

    // Set Up

    beforeEach(function() {
    });

    afterEach(function() {
        manager = null;
    });

    // Helpers

    function createKeyEvent(type, keycode, payload){
        payload.keyCode = keycode;
        payload.which =  keycode;

        var e = $.Event(type);
        _.extend(e, payload);

        return e;
    }

    function createKeyDownEvent(keycode, payload){
        return createKeyEvent('keydown', keycode, payload);
    }

    function createKeyUpEvent(keycode, payload){
        return createKeyEvent('keyup', keycode, payload);
    }

    function getManager(augments) {
        return new KeyEquivalentManager();
    }

    // Test Suite

    it('runs with empty map', function(){
        var e = createKeyDownEvent(KeyCodes['return'], {
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: true
        });

        manager = getManager();
        manager.performKeyEquivalent(null, e);

    });

    it('registers equivalent with string', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();
        manager.registerWithString('command + shift + escape', spy);

        var map = manager.map;
        var key = KeyModifier.META | KeyModifier.SHIFT;

        expect(map[key]).not.toEqual(undefined);
        expect(map[key][KeyCodes.escape]).not.toEqual(undefined);
        expect(map[key][KeyCodes.escape]).toEqual(spy);
    });

    it('performs key equivalent', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();
        manager.registerWithString('command + shift + escape', spy);

        var e = createKeyDownEvent(KeyCodes.escape, {
            altKey: false,
            ctrlKey: false,
            metaKey: true,
            shiftKey: true
        });

        var result = manager.performKeyEquivalent(null, e);
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(true);
    });

    it('does not perform key equivalent', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();
        manager.registerWithString('command + shift + escape', spy);

        var e = createKeyDownEvent(KeyCodes.escape, {
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false
        });

        var result = manager.performKeyEquivalent(null, e);
        expect(spy).not.toHaveBeenCalled();
        expect(result).toEqual(false);
    });

    it('does not perform key equivalent with undefined action', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();
        manager.registerWithString('command + shift + escape', undefined);

        var e = createKeyDownEvent(KeyCodes.escape, {
            altKey: false,
            ctrlKey: false,
            metaKey: true,
            shiftKey: true
        });

        var result = manager.performKeyEquivalent(null, e);
        expect(spy).not.toHaveBeenCalled();
        expect(result).toEqual(false);
    });

    it('performs key equivalent with all modifiers', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();
        manager.registerWithString('command + shift + option + ctrl + p', spy);

        // using shift in the registration means we will be sending a
        // capital P for the actual event.
        var e = createKeyDownEvent('P'.charCodeAt(), {
            altKey: true,
            ctrlKey: true,
            metaKey: true,
            shiftKey: true
        });

        var result = manager.performKeyEquivalent(null, e);
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(true);
    });

    it('throws error with single character', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();

        function badInit() {
            manager.registerWithString('p', spy);
        }

        expect(badInit).toThrow();
    });

    it('throws error with unknown modifiers', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();

        function badInit() {
            manager.registerWithString('foo + bar + baz + p', spy);
        }

        expect(badInit).toThrow();
    });

    it('throws error with unknown key', function(){
        var spy = jasmine.createSpy('spy');
        manager = getManager();

        function badInit() {
            manager.registerWithString('command + shift + bar', spy);
        }

        expect(badInit).toThrow();
    });



}); // Eof describe
}); // Eof define
