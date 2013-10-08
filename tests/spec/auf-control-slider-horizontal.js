define(function(require, exports, module) {

// Imports

var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');
var SpecHelpers      = require('lib/spec-helpers');
var EventHelpers     = SpecHelpers.Events;

describe('Control: Slider Horizontal', function() {

    // Object Vars

    var control;
    var $sliderContainer, $slider, $sliderTrack, $sliderHandle;

    // Setup

    beforeEach(function() {
        loadFixtures('control-slider-horizontal.html');

        $sliderContainer = $('.slider-container');
        $slider          = $('.slider');
        $sliderTrack     = $slider.find('.track');
        $sliderHandle    = $slider.find('.handle');

        control = new HorizontalSlider({
            $handles: [$sliderHandle],
            $trackView: $sliderTrack,
            steps: 30
        });
    });

    // Helpers

    function getNormalizedTrackWidth($h) {
        var trackRect  = $sliderTrack[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();

        return trackRect.width - handleRect.width;
    }

    // Test Suite

    it('moved slider handle', function() {
        var targetPosition = 0.5;
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS    = {'left': trackWidth * targetPosition + 'px'};

        control.setPosition($sliderHandle, 0.5);

        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('moved slider handle a step', function() {
        var stepsToMove  = 2;
        var trackWidth   = getNormalizedTrackWidth($sliderHandle);
        var stepDistance = trackWidth / 30;
        var expectedCSS  = {'left': stepDistance * stepsToMove + 'px'};

        control.setStep($sliderHandle, stepsToMove);

        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('moved slider handle with mouse drag', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var moveToX     = trackWidth / 2;
        var expectedCSS = {'left': moveToX + 'px'};

        EventHelpers.simulateMouseDragged($sliderHandle, 0, 15, moveToX, 15);

        expect($sliderHandle).toHaveCss(expectedCSS);
        expect(control.getPosition()[0]).toEqual(0.5);
    });

    it('moved slider handle with touch drag', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var moveToX     = trackWidth / 2;
        var expectedCSS = {'left': moveToX + 'px'};

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 15, moveToX, 15);

        expect($sliderHandle).toHaveCss(expectedCSS);
        expect(control.getPosition()[0]).toEqual(0.5);
    });

    it('did not move slider handle past track right boundary', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS = {'left': trackWidth + 'px'};

        control.setPosition($sliderHandle, 2.0);

        // expect the handle left to equal the width of the
        // normalized track. The normalized track subtracts
        // the width of the handle.
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('did not move slider handle past track left boundary', function() {
        var expectedCSS = {'left': '0px'};

        control.setPosition($sliderHandle, 0.5);
        control.setPosition($sliderHandle, -1);

        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('triggered mouse drag events', function(){
        var mouseDragStart  = jasmine.createSpy('mouseDragStart');
        var mouseDragChange = jasmine.createSpy('mouseDragChange');
        var mouseDragStop   = jasmine.createSpy('mouseDragStop');

        control.listenTo(control, 'drag:start', mouseDragStart);
        control.listenTo(control, 'change', mouseDragChange);
        control.listenTo(control, 'drag:stop', mouseDragStop);

        EventHelpers.simulateMouseDragged($sliderHandle, 0, 0, 100, 0);

        expect(mouseDragStart).toHaveBeenCalled();
        expect(mouseDragChange).toHaveBeenCalled();
        expect(mouseDragStop).toHaveBeenCalled();
    });

    it('triggered touch drag events', function(){
        var touchDragStart  = jasmine.createSpy('touchDragStart');
        var touchDragChange = jasmine.createSpy('touchDragChange');
        var touchDragStop   = jasmine.createSpy('touchDragStop');

        control.listenTo(control, 'drag:start', touchDragStart);
        control.listenTo(control, 'change', touchDragChange);
        control.listenTo(control, 'drag:stop', touchDragStop);

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 0, 100, 0);

        expect(touchDragStart).toHaveBeenCalled();
        expect(touchDragStop).toHaveBeenCalled();
    });

    it('updates steps for position', function(){
        var expectedStep = 15;

        control.setPosition($sliderHandle, 0.5);
        expect(control.getSteps()[0]).toEqual(expectedStep);
    });

    it('updates position for steps', function(){
        var expectedPosition = 0.5;
        control.setStep($sliderHandle, 15); // 30, above, /2 = 15

        expect(control.getPosition()[0]).toEqual(expectedPosition);
    });

}); // eof describe
}); // eof define
