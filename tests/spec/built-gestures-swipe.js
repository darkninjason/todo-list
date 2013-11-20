define(function(require, exports, module) {

// Imports

var SwipeGesture = require('built/core/gestures/swipe').SwipeGesture;
var SpecHelpers  = require('lib/spec-helpers');
var EventHelpers = SpecHelpers.Events;

describe('Gesture: Swipe', function() {

    var $input, gesture = null;

    // Setup

    beforeEach(function() {
        loadFixtures('responder-touches.html');
        $input = $('#responder');
    });

    afterEach(function() {
        if(gesture){
            gesture.close();
        }
    });

    // Helpers

    function swipeLeft($el){
        EventHelpers.simulateTouchStart($input, 300, 300);
        EventHelpers.simulateTouchMove($input, 0, 290);
        EventHelpers.simulateTouchEnd($input);
    }

    function swipeRight($el){
        EventHelpers.simulateTouchStart($input, 0, 300);
        EventHelpers.simulateTouchMove($input, 300, 290);
        EventHelpers.simulateTouchEnd($input);
    }

    function swipeUp($el){
        EventHelpers.simulateTouchStart($input, 300, 400);
        EventHelpers.simulateTouchMove($input, 290, 50);
        EventHelpers.simulateTouchEnd($input);
    }

    function swipeDown($el){
        EventHelpers.simulateTouchStart($input, 300, 50);
        EventHelpers.simulateTouchMove($input, 290, 400);
        EventHelpers.simulateTouchEnd($input);
    }

    // Test Suite


    it('did trigger swipe left', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'left',
            handleGesture: handleGesture
        });


        swipeLeft($input);
        expect(handleGesture).toHaveBeenCalled();
    });

    it('did not trigger swipe left', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'left',
            handleGesture: handleGesture
        });

        swipeRight($input);
        swipeUp($input);
        swipeDown($input);
        expect(handleGesture).not.toHaveBeenCalled();
    });

    it('did trigger swipe right', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'right',
            handleGesture: handleGesture
        });


        swipeRight($input);
        expect(handleGesture).toHaveBeenCalled();
    });

    it('did not trigger swipe right', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'right',
            handleGesture: handleGesture
        });

        swipeLeft($input);
        swipeUp($input);
        swipeDown($input);

        expect(handleGesture).not.toHaveBeenCalled();
    });

    it('did trigger swipe up', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'up',
            handleGesture: handleGesture
        });

        swipeUp($input);
        expect(handleGesture).toHaveBeenCalled();
    });

    it('did not trigger swipe up', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'up',
            handleGesture: handleGesture
        });

        swipeLeft($input);
        swipeRight($input);
        swipeDown($input);

        expect(handleGesture).not.toHaveBeenCalled();
    });

    it('did trigger swipe down', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'down',
            handleGesture: handleGesture
        });

        swipeDown($input);
        expect(handleGesture).toHaveBeenCalled();
    });

    it('did not trigger swipe down', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'down',
            handleGesture: handleGesture
        });

        swipeLeft($input);
        swipeRight($input);
        swipeUp($input);

        expect(handleGesture).not.toHaveBeenCalled();
    });

    it('did trigger swipe left requiring 2 touches', function() {

        var handleGesture = jasmine.createSpy('handleGesture');
        var startEvent    = EventHelpers.simulateTouchEvent($input, 'touchstart', 300, 300);
        var moveEvent     = EventHelpers.simulateTouchEvent($input, 'touchmove', 0, 300);

        gesture = new SwipeGesture({
            el: $input,
            direction: 'left',
            numberOfTouchesRequired: 2,
            handleGesture: handleGesture
        });

        startEvent.originalEvent.touches.push({
            pageX: 290,
            pageY: 320});

        moveEvent.originalEvent.touches.push({
            pageX: 30,
            pageY: 320});

        $input.trigger(startEvent);
        $input.trigger(moveEvent);
        EventHelpers.simulateTouchEnd($input);

        expect(handleGesture).toHaveBeenCalled();
    });

    it('did not trigger swipe left requiring 2 touches', function() {

        var handleGesture = jasmine.createSpy('handleGesture');

        gesture = new SwipeGesture({
            el: $input,
            direction: 'left',
            numberOfTouchesRequired: 2,
            handleGesture: handleGesture
        });

        swipeLeft($input);
        expect(handleGesture).not.toHaveBeenCalled();
    });

}); // eof describe
}); // eof define
