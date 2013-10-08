define(function(require, exports, module) {

var HorizontalRangeSlider = require('auf/ui/controls/sliders/horizontal-range');
var SpecHelpers           = require('lib/spec-helpers');
var EventHelpers          = SpecHelpers.Events;

describe('Control: Slider Horizontal Range', function() {

    // Set Up

    beforeEach(function() {
        // console.log('// ' + this.description);

        loadFixtures('control-slider-horizontal-range.html');

        $sliderContainer   = $('.slider-container');
        $slider            = $('.slider');
        $sliderTrack       = $slider.find('.track');
        $handles           = $('.handle');
        $sliderHandleLeft  = $slider.find('.handle.left');
        $sliderHandleMid   = $slider.find('.handle.mid');
        $sliderHandleRight = $slider.find('.handle.right');

        control = new HorizontalRangeSlider({
            $handles: [$sliderHandleLeft, $sliderHandleMid, $sliderHandleRight],
            $trackView: $sliderTrack,
        });

        testPositions = [0.25, 0.5, 0.75];
        testSteps     = [10, 15, 20];
    });

    afterEach(function() {
        // console.log('// eof ' + this.description);
    });

    // Helpers

    function getNormalizedTrackWidth($h) {
        var trackRect  = $sliderTrack[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();

        return trackRect.width - handleRect.width;
    }

    function setSliderTestPositions(positions) {
        var i = positions.length-1;
        var len = 0;

        for(i; i >= 0; i--) {
            position = positions[i];
            handle = $handles.eq(i);

            control.setPosition(handle, position);
        }
    }

    function setSliderTestSteps(steps) {
        var i = steps.length-1;
        var len = 0;

        for(i; i >= 0; i--) {
            step = steps[i];
            handle = $handles.eq(i);

            control.setStep(handle, step);
        }
    }

    // Test Suite

    it('reports expected ranges when positioned', function() {
        var positions      = testPositions;
        var expectedRange1 = Math.abs(positions[1] - positions[0]);
        var expectedRange2 = Math.abs(positions[1] - positions[2]);

        setSliderTestPositions(positions);

        ranges = control.getRange();

        expect(ranges[0]).toEqual(expectedRange1);
        expect(ranges[1]).toEqual(expectedRange2);
    });

    it('reports expected ranges when stepped', function() {
        // close existing control
        control.close()

        // create new one with steps enabled
        // note 60 steps here to create steps at positions [0.25, 0.5, 0.75]
        control = new HorizontalRangeSlider({
            $handles: [$sliderHandleLeft, $sliderHandleMid, $sliderHandleRight],
            $trackView: $sliderTrack,
            steps: 60
        });

        // custom steps
        var steps          = [15, 30, 45];
        var positions      = testPositions;
        var expectedRange1 = Math.abs(positions[1] - positions[0]);
        var expectedRange2 = Math.abs(positions[1] - positions[2]);

        setSliderTestSteps(steps);

        ranges = control.getRange();

        expect(ranges[0]).toEqual(expectedRange1);
        expect(ranges[1]).toEqual(expectedRange2);
    });

    it('respects handle boundaries when handle is positioned', function() {
        var positions = testPositions;
        var min       = 0;
        var max       = 1;

        setSliderTestPositions(positions);

        control.setPosition($sliderHandleMid, min);

        expect(control.getPosition()[1]).toEqual(positions[0]);

        control.setPosition($handles.eq(1), max);

        expect(control.getPosition()[1]).toEqual(positions[2]);
    });

    it('respects handle boundaries when handle is dragged by mouse', function() {
        var startPos;
        var $handle   = $handles.eq(1);
        var positions = testPositions;
        var min       = 0;
        var max       = getNormalizedTrackWidth($handle);

        setSliderTestPositions(positions);

        startPos = $handle.position().left;
        EventHelpers.simulateMouseDragged($handle, startPos, 15, min, 15);

        expect(control.getPosition()[1]).toEqual(positions[0]);

        startPos = $handle.position().left;
        EventHelpers.simulateMouseDragged($handle, startPos, 0, max, 0);

        expect(control.getPosition()[1]).toEqual(positions[2]);
    });

    it('respects handle boundaries when handle is dragged by touch', function(){
        var startPos;
        var $handle   = $handles.eq(1);
        var positions = testPositions;
        var min       = 0;
        var max       = getNormalizedTrackWidth($handle);

        setSliderTestPositions(positions);

        startPos = $handle.position().left;
        EventHelpers.simulateTouchDragged($handle, startPos, 15, min, 15);

        expect(control.getPosition()[1]).toEqual(positions[0]);

        startPos = $handle.position().left;
        EventHelpers.simulateTouchDragged($handle, startPos, 0, max, 0);

        expect(control.getPosition()[1]).toEqual(positions[2]);
    });

    it('respects stepped handle boundaries when handle is positioned', function(){
        // close existing control
        control.close()

        // create new one with steps enabled
        control = new HorizontalRangeSlider({
            $handles: [$sliderHandleLeft, $sliderHandleMid, $sliderHandleRight],
            $trackView: $sliderTrack,
            steps: 30
        });

        var steps = testSteps;
        var min = 0;
        var max = 30; // steps is configured above to 30;

        setSliderTestSteps(steps);

        control.setStep($sliderHandleMid, min);

        expect(control.getSteps()[1]).toEqual(steps[0]);

        control.setStep($handles.eq(1), max);

        expect(control.getSteps()[1]).toEqual(steps[2]);
    });

}); // eof describe
}); // eof define
