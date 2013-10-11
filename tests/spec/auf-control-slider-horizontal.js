define(function(require, exports, module) {

// Imports

var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');
var SpecHelpers      = require('lib/spec-helpers');
var EventHelpers     = SpecHelpers.Events;

describe('Horizontal Slider Control', function() {

    // Object Vars

    var control, $sliderContainer, $slider, $sliderTrack, $sliderHandle;

    // Setup

    beforeEach(function() {
        loadFixtures('control-slider-horizontal.html');

        $sliderContainer = $('.slider-container');
        $slider          = $('.slider');
        $sliderTrack     = $slider.find('.track');
        $sliderHandle    = $slider.find('.handle');

        control = new HorizontalSlider({
            $handles: $sliderHandle,
            $track: $sliderTrack,
            steps: 30,
            acceptsMouse: true,
            acceptsTouch: true,
        });
    });

    // Helpers

    function getNormalizedTrackWidth($h) {
        var trackRect  = $sliderTrack[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();

        return trackRect.width - handleRect.width;
    }

    // Test Suite
    it('throws error when no track provided', function(){
        function badInit() {
            new HorizontalSlider({
                $handles: $sliderHandle,
                // $track: $sliderTrack,
                steps: 30,
                acceptsMouse: true,
                acceptsTouch: true,
            });
        }

        expect(badInit).toThrow();
    });

    it('throws error when no handle provided', function(){
        function badInit() {
            new HorizontalSlider({
                // $handles: $sliderHandle,
                $track: $sliderTrack,
                steps: 30,
                acceptsMouse: true,
                acceptsTouch: true,
            });
        }

        expect(badInit).toThrow();
    });

    it('moved slider handle', function() {
        var targetPosition = 0.5;
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS    = {'left': trackWidth * targetPosition + 'px'};

        control.setPosition(targetPosition);

        expect(control.getPosition()).toEqual(targetPosition);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('moved slider handle a step', function() {
        var targetStep   = 2;
        var trackWidth   = getNormalizedTrackWidth($sliderHandle);
        var stepDistance = trackWidth / 30;
        var expectedCSS  = {'left': stepDistance * targetStep + 'px'};

        control.setStep(targetStep);

        expect(control.getStep()).toEqual(targetStep);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('moved slider handle with mouse drag', function() {
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var targetPosition = 0.5;
        var moveToX        = trackWidth * targetPosition;
        var expectedCSS    = {'left': moveToX + 'px'};

        EventHelpers.simulateMouseDragged($sliderHandle, 0, 15, moveToX, 15);

        expect(control.getPosition()).toEqual(targetPosition);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('moved slider handle with touch drag', function() {
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var targetPosition = 0.5;
        var moveToX        = trackWidth * targetPosition;
        var expectedCSS    = {'left': moveToX + 'px'};

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 15, moveToX, 15);

        expect(control.getPosition()).toEqual(0.5);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('did not move slider handler past max', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS = {'left': trackWidth + 'px'};

        control.setPosition(0.5);
        control.setPosition(2.0);

        expect(control.getPosition()).toEqual(1);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('did not move slider handle past min', function() {
        var expectedCSS = {'left': '0px'};

        control.setPosition(0.5);
        control.setPosition(-1);

        expect(control.getPosition()).toEqual(0);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('triggered events from mouse', function(){
        var dragStart = jasmine.createSpy('dragStart');
        var change    = jasmine.createSpy('change');
        var dragStop  = jasmine.createSpy('dragStop');

        control.on('drag:start', dragStart);
        control.on('change', change);
        control.on('drag:stop', dragStop);

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 0, 100, 0);

        expect(dragStart).toHaveBeenCalled();
        expect(change).toHaveBeenCalled();
        expect(dragStop).toHaveBeenCalled();
    });

    it('triggered events from touch', function(){
        var dragStart = jasmine.createSpy('dragStart');
        var change    = jasmine.createSpy('change');
        var dragStop  = jasmine.createSpy('dragStop');

        control.on('drag:start', dragStart);
        control.on('change', change);
        control.on('drag:stop', dragStop);

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 0, 100, 0);

        expect(dragStart).toHaveBeenCalled();
        expect(change).toHaveBeenCalled();
        expect(dragStop).toHaveBeenCalled();
    });

    it('updates steps for position', function(){
        var expectedStep = 15;

        control.setPosition(0.5);

        expect(control.getStep()).toEqual(expectedStep);
    });

    it('updates position for steps', function(){
        var expectedPosition = 0.5;

        control.setStep(15); // 30, above, /2 = 15

        expect(control.getPosition()).toEqual(expectedPosition);
    });

    it('expects responders to be removed', function(){
        var trackWidth       = getNormalizedTrackWidth($sliderHandle);
        var expectedPosition = 200/trackWidth;

        // Drag the handle around a bit.
        EventHelpers.simulateMouseDragged($sliderHandle, 0, 0, 50, 0);
        EventHelpers.simulateTouchDragged($sliderHandle, 50, 0, 200, 0);

        expect(control.getPosition()).toEqual(expectedPosition);

        // Run close functionality.
        control.close();

        // Drag the handle around a bit.
        EventHelpers.simulateMouseDragged($sliderHandle, 200, 0, 50, 0);
        EventHelpers.simulateTouchDragged($sliderHandle, 50, 0, 0, 0);

        // When closed is called, no listeners should be active
        // Expect our position to be identical
        expect(control.getPosition()).toEqual(expectedPosition);
    });

}); // eof describe
}); // eof define
