define(function(require, exports, module) {

var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');

// TODO:
// - Breakout mouse and touch event simulations

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

    // Mouse Event Helpers

    function simulateMouseEvent($el, type, x, y){
        var e = $.Event(type);

        e.pageX = x;
        e.pageY = y;
        e.target = $el[0];
        e.currentTarget = $el[0];

        $el.trigger(e);

        return e;
    }

    function simulateMouseDown($el, x, y) {
        return simulateMouseEvent($el, 'mousedown', x, y);
    }
    function simulateMouseUp($el, x, y) {
        return simulateMouseEvent($el, 'mouseup', x, y);
    }
    function simulateMouseMove($el, x, y) {
        return simulateMouseEvent($el, 'mousemove', x, y);
    }
    function simulateMouseDragged($el, startX, startY, endX, endY) {
        simulateMouseDown($el, startX, startY);
        simulateMouseMove($el, endX, endY);
        simulateMouseUp($el, endX, endY);
    }

    // Touch Evenet Helpers

    function simulateTouchEvent($el, type, x, y) {
        var e     = $.Event(type);
        var touch = {
                pageX: x,
                pageY: y,
                target: $el[0]
            };

        e.originalEvent = {touches: [touch]};
        e.target        = $el[0];
        e.currentTarget = $el[0];

        $el.trigger(e);

        return e;
    }

    function simulateTouchStart($el, x, y) {
        return simulateTouchEvent($el, 'touchstart', x, y);
    }

    function simulateTouchMove($el, x, y) {
        return simulateTouchEvent($el, 'touchmove', x, y);
    }

    function simulateTouchEnd($el, x, y) {
        return simulateTouchEvent($el, 'touchend', x, y);
    }

    function simulateTouchCancel($el) {
        return simulateTouchEvent($el, 'touchcancel');
    }

    function simulateTouchDragged($el, startX, startY, endX, endY) {
        simulateTouchStart($el, startX, startY);
        simulateTouchMove($el, endX, endY);
        simulateTouchEnd($el, endX, endY);
    }

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
        var expectedCSS = {'left': moveToX + 'px'}

        simulateMouseDragged($sliderHandle, 0, 15, moveToX, 15);

        expect($sliderHandle).toHaveCss(expectedCSS);
        expect(control.getPosition()[0]).toEqual(0.5);
    });

    it('moved slider handle with touch drag', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var moveToX     = trackWidth / 2;
        var expectedCSS = {'left': moveToX + 'px'}

        simulateTouchDragged($sliderHandle, 0, 15, moveToX, 15);

        expect($sliderHandle).toHaveCss(expectedCSS);
        expect(control.getPosition()[0]).toEqual(0.5);
    });

    it('did not move slider handle past track right', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS = {'left': trackWidth + 'px'};

        control.setPosition($sliderHandle, 2.0);

        // expect the handle left to equal the width of the
        // normalized track. The normalized track subtracts
        // the width of the handle.
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    it('did not move slider handle past track left', function() {
        var expectedCSS = {'left': '0px'};

        control.setPosition($sliderHandle, 0.5);
        control.setPosition($sliderHandle, -1);

        expect($sliderHandle).toHaveCss(expectedCSS);
    });

}); // eof describe
}); // eof define
