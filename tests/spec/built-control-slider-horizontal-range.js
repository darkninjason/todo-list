define(function(require, exports, module) {

var _                     = require('underscore');
var HorizontalRangeSlider = require('built/core/controls/sliders/horizontal-range').HorizontalRangeSlider;
var events                = require('built/core/events/event');
var SpecHelpers           = require('lib/spec-helpers');
var EventHelpers          = SpecHelpers.Events;

describe('Horizontal Range Slider', function() {

    // Set Up

    beforeEach(function() {
        loadFixtures('control-slider-horizontal.html');
    });

    afterEach(function() {
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            $track            : $('.slider .track'),
            $handles          : $('.slider .handle'),
            steps             : 30,
            acceptsMouse      : true,
            acceptsTouch      : true,
            acceptsOrientation: true,
            snap              : false
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getControl(augments) {
        return new HorizontalRangeSlider(getOptions(augments));
    }

    function getPageElements() {
        return {
            $container  : $('.slider-container'),
            $slider     : $('.slider'),
            $track      : $('.slider .track'),
            $handles    : $('.slider .handle'),
            $leftHandle : $('.slider .handle.left'),
            $midHandle  : $('.slider .handle.mid'),
            $rightHandle: $('.slider .handle.right')
        };
    }

    function getNormalizedTrackWidth($track, $handle) {
        var trackRect, handleRect;

        trackRect  = $track[0].getBoundingClientRect();
        handleRect = $handle[0].getBoundingClientRect();

        return trackRect.width - handleRect.width;
    }

    function doBasicMouseDrag($handle, dragx) {
        EventHelpers.simulateMouseDragged($handle, 0, 0, dragx, 0);
    }

    function doBasicTouchDrag($handle, dragx) {
        EventHelpers.simulateTouchDragged($handle, 0, 0, dragx, 0);
    }

    // Throws Tests

    it('throws when less than two handles provided.', function(){
        function throwable() {
            var els,control;

            els     = getPageElements();
            control = getControl({
                $handles: els.$leftHandle
            });
        }

        expect(throwable).toThrow();
    });

    // Extended Functionality Tests

    it('does not exceed min (0)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(-1, 0);

        expect(control.getPositionAt(0)).toEqual(0);
    });

    it('does not exceed max (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 0);

        expect(control.getPositionAt(0)).toEqual(pos[1]);
    });

    it('does exceed min (position at index 0)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 1);

        expect(control.getPositionAt(1)).toEqual(pos[0]);
    });

    it('does exceed max (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 1);

        expect(control.getPositionAt(1)).toEqual(pos[2]);
    });

    it('does exceed min (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 2);

        expect(control.getPositionAt(2)).toEqual(pos[1]);
    });

    it('does exceed max (1)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(2, 2);

        expect(control.getPositionAt(2)).toEqual(1);
    });

    // Public API

    it('returns expected ranges', function(){
        var control, pos, expectedRanges;

        pos     = [0.25, 0.50, 0.75];
        control = getControl();
        expectedRanges = [pos[1] - pos[0], pos[2] - pos[1]];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        expect(control.getRanges()).toEqual(expectedRanges);
    });

    // UI
    it('does not exceed min with snap enabled (position at index 0)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.5, 0.75];
        step    = [8, 15, 23];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 1);

        expect(control.getStepAt(1)).toEqual(step[0]);
    });

    it('does not exceed max with snap enabled (position at index 2)', function(){
        var control, pos;

        control = getControl();
        pos     = [0.25, 0.5, 0.75];
        step    = [8, 15, 23];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 1);

        expect(control.getStepAt(1)).toEqual(step[2]);
    });

    // Events Tests

    it('dispatches change for setPositionAt', function(){
        var change, els, control;

        change    = jasmine.createSpy('change');
        els       = getPageElements();
        control   = getControl();

        control.on(events.CHANGE, change);

        control.setPositionAt(0.5, 0);

        expect(change).toHaveBeenCalled();
    });

    it('dispatches change for mouse', function(){
        var change, els, control;

        change    = jasmine.createSpy('change');
        els       = getPageElements();
        control   = getControl();

        control.on(events.CHANGE, change);

        doBasicMouseDrag(els.$leftHandle, 100);

        expect(change).toHaveBeenCalled();
    });

    it('dispatches drag:start for mouse', function(){
        var dragStart, els, control;

        dragStart = jasmine.createSpy('dragStart');
        els       = getPageElements();
        control   = getControl();

        control.on('drag:start', dragStart);

        doBasicMouseDrag(els.$leftHandle, 100);

        expect(dragStart).toHaveBeenCalled();
    });

    it('dispatches drag:stop for mouse', function(){
        var dragStop, els, control;

        dragStop  = jasmine.createSpy('dragStop');
        els       = getPageElements();
        control   = getControl();

        control.on('drag:stop', dragStop);

        doBasicMouseDrag(els.$leftHandle, 100);

        expect(dragStop).toHaveBeenCalled();
    });

    it('dispatches change for touch', function(){
        var change, els, control;

        change    = jasmine.createSpy('change');
        els       = getPageElements();
        control   = getControl();

        control.on(events.CHANGE, change);

        doBasicTouchDrag(els.$leftHandle, 100);

        expect(change).toHaveBeenCalled();
    });

    it('dispatches drag:start for touch', function(){
        var dragStart, els, control;

        dragStart = jasmine.createSpy('dragStart');
        els       = getPageElements();
        control   = getControl();

        control.on('drag:start', dragStart);

        doBasicTouchDrag(els.$leftHandle, 100);

        expect(dragStart).toHaveBeenCalled();
    });

    it('dispatches drag:stop for touch', function(){
        var dragStop, els, control;

        dragStop  = jasmine.createSpy('dragStop');
        els       = getPageElements();
        control   = getControl();

        control.on('drag:stop', dragStop);

        doBasicTouchDrag(els.$leftHandle, 100);

        expect(dragStop).toHaveBeenCalled();
    });

    // Marionette

    it('closes all responders on close', function(){
        var els, trackWidth, control, pos;

        els = getPageElements();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        control = getControl();
        pos = [0.25, 0.5, 0.75];

        // drag the handles around a bit
        doBasicMouseDrag(els.$leftHandle, trackWidth * pos[0]);
        doBasicTouchDrag(els.$midHandle, trackWidth * pos[1]);
        control.setPositionForHandle(pos[2], els.$rightHandle);

        // expect things to have moved around
        expect(control.getPositions()).toEqual(pos);

        // call close
        control.close();

        // drag the handles around a bit with responder input
        doBasicMouseDrag(els.$leftHandle, trackWidth * pos[2]);
        doBasicTouchDrag(els.$midHandle, trackWidth * pos[1]);

        // expect no movement
        expect(control.getPositions()).toEqual(pos);
    });

}); // eof describe
}); // eof define
