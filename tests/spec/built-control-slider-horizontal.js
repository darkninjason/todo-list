define(function(require, exports, module) {

// Imports

var _                = require('underscore');
var HorizontalSlider = require('built/core/controls/sliders/horizontal').HorizontalSlider;
var events           = require('built/core/events/event');
var drag             = require('built/core/events/drag');
var SpecHelpers      = require('lib/spec-helpers');
var EventHelpers     = SpecHelpers.Events;

describe('Horizontal Slider Control', function() {

    // Setup

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
        return new HorizontalSlider(getOptions(augments));
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

    // Options Tests

    it('applies options', function(){
        var hsliderDefaults, augments, control, controlDefaults;

        // copied from hslider, will need update should these change.
        hsliderDefaults = {
            $track: null,
            $handles: null,
            steps: 0,
            snap: false,
            acceptsMouse: true,
            acceptsTouch: false,
        };

        augments          = _.clone(hsliderDefaults);
        augments.$track   = getPageElements().$track;
        augments.$handles = getPageElements().$handles;

        control = getControl(augments);

        // expect modified options to be modified
        expect(control.options.$track).toEqual(augments.$track);
        expect(control.options.$handles).toEqual(augments.$handles);

        // expect unmodified options to equal defaults
        expect(control.options.acceptsMouse).toEqual(hsliderDefaults.acceptsMouse);
        expect(control.options.acceptsTouch).toEqual(hsliderDefaults.acceptsTouch);
        expect(control.options.snap).toEqual(hsliderDefaults.snap);
        expect(control.options.steps).toEqual(hsliderDefaults.steps);
    });

    it('disables mouse when acceptsMouse is false', function(){
        var control, elements;

        els     = getPageElements();
        control = getControl({acceptsMouse: false});

        doBasicMouseDrag(els.$leftHandle, 100);

        // if mouse is not available, leftHandle shouldn't move.
        expect(control.getPosition()).toEqual(0);
    });

    it('enables mouse when acceptsMouse is true', function(){
        var control, elements, pos, dragx;

        els     = getPageElements();
        control = getControl();
        pos     = 0.5;
        dragx   = getNormalizedTrackWidth(els.$track, els.$leftHandle) * pos;

        doBasicMouseDrag(els.$leftHandle, dragx);

        expect(control.getPosition()).toEqual(0.5);
        expect(els.$leftHandle).toHaveCss({'left': dragx + 'px'});
    });

    it('disables touch when acceptsTouch is false', function(){
        var control, elements;

        els     = getPageElements();
        control = getControl({acceptsTouch: false});

        doBasicTouchDrag(els.$leftHandle, 100);

        // if mouse is not available, leftHandle shouldn't move.
        expect(control.getPosition()).toEqual(0);
    });

    it('enables touch when acceptsTouch is true', function(){
        var control, elements, pos, dragx;

        els     = getPageElements();
        control = getControl();
        pos     = 0.5;
        dragx   = getNormalizedTrackWidth(els.$track, els.$leftHandle) * pos;

        doBasicTouchDrag(els.$leftHandle, dragx);

        expect(control.getPosition()).toEqual(0.5);
        expect(els.$leftHandle).toHaveCss({'left': dragx + 'px'});
    });

    // Throws Tests

    it('throws when track is not provided', function(){
        function throwable(){
            var control;

            control = getControl({$track: null});
        }

        expect(throwable).toThrow();
    });

    it('throws when no handles provided', function(){
        function throwable() {
            var control;

            control = getControl({$handles: null});
        }

        expect(throwable).toThrow();
    });

    it('throws when incorrect index is passed', function(){
        function throwable() {
            var control;

            control = getControl();
            control.setPositionAt(0.5, 10);
        }

        expect(throwable).toThrow();
    });

    it('throws when incorrect handle is passed', function(){
        function throwable() {
            var $fakeHandle, control;

            $fakeHandle = $('<div class="handle fake"></div>');
            control = getControl();

            control.setPositionForHandle(0.5, $fakeHandle);
        }

        expect(throwable).toThrow();
    });

    // Public API Tests

    it('recalculates max position', function(){
        var $els, $container, $track, $handles, control, positions;

        $els       = getPageElements();
        $container = $els.$container;
        $track     = $els.$track;
        $handles   = $els.$handles;
        control    = getControl();
        positions  = [0.25, 0.50, 0.75];

        _.each(positions, function(pos, i, positions){
            control.setPositionAt(pos, i);
        });

        // shrink the container
        $container.css('width', '150px');

        // recalculate positions
        control.calculateMaxPosition();

        // verify positions and element lefts
        _.each(positions, function(pos, i, positions){
            var $handle, trackWidth, expectedWidth;

            $handle      = $handles.eq(i);
            trackWidth   = getNormalizedTrackWidth($track, $handle);
            expectedLeft = trackWidth * pos;

            expect(control.getPositionAt(i)).toEqual(positions[i]);
            expect($handle.css('left')).toEqual(expectedLeft + 'px');
        });
    });

    it('updates when setPositionAt is called', function(){
        var els, control, pos, left;

        els        = getPageElements();
        control    = getControl();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        pos        = [0.25, 0.50, 0.75];
        left      = [
            trackWidth * pos[0],
            trackWidth * pos[1],
            trackWidth * pos[2]
        ];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
            expect(els.$handles.eq(i)).toHaveCss({'left': left[i] + 'px'});
        });

        _.each(pos, function(p, i, list){
            expect(control.getPositionAt(i)).toEqual(p);
        });

        expect(control.getPositions()).toEqual(pos);
    });

    it('updates when setPositionForHandle is called', function(){
        var els, $handles, control, pos, left;

        els        = getPageElements();
        $handles   = els.$handles;
        control    = getControl();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        pos        = [0.25, 0.50, 0.75];
        left      = [
            trackWidth * pos[0],
            trackWidth * pos[1],
            trackWidth * pos[2]
        ];

        _.each(pos, function(p, i, list){
            control.setPositionForHandle(p, $handles.eq(i));
            expect($handles.eq(i)).toHaveCss({'left': left[i] + 'px'});
        });

        _.each(pos, function(p, i, list){
            expect(control.getPositionForHandle($handles.eq(i))).toEqual(p);
        });

        expect(control.getPositions()).toEqual(pos);
    });

    it('updates when setStepAt is called', function(){
        var els, control, step, stepDistance, left;

        els          = getPageElements();
        control      = getControl();
        trackWidth   = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        step         = [8, 15, 23];
        stepDistance = trackWidth / control.options.steps;
        left        = [
            stepDistance * step[0],
            stepDistance * step[1],
            stepDistance * step[2]
        ];

        _.each(step, function(s, i, list){
            control.setStepAt(s, i);
            expect(els.$handles.eq(i)).toHaveCss({'left': left[i] + 'px'});
        });

        _.each(step, function(s, i, list){
            expect(control.getStepAt(i)).toEqual(s);
        });

        expect(control.getSteps()).toEqual(step);
    });

    it('updates when setStepForHandle is called', function(){
        var els, $handles, control, step, stepDistance, left;

        els          = getPageElements();
        $handles     = els.$handles;
        control      = getControl();
        trackWidth   = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        step         = [8, 15, 23];
        stepDistance = trackWidth / control.options.steps;
        left        = [
            stepDistance * step[0],
            stepDistance * step[1],
            stepDistance * step[2]
        ];

        _.each(step, function(s, i, list){
            control.setStepForHandle(s, $handles.eq(i));
            expect($handles.eq(i)).toHaveCss({'left': left[i] + 'px'});
        });

        _.each(step, function(s, i, list){
            expect(control.getStepForHandle($handles.eq(i))).toEqual(s);
        });

        expect(control.getSteps()).toEqual(step);
    });

    // Public 'Convenience' API

    it('updates when setPosition is called', function(){
        var els, control, pos, left;

        els        = getPageElements();
        control    = getControl();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        pos        = 0.25;
        left       = trackWidth * pos;

        control.setPosition(pos);

        expect(control.getPosition()).toEqual(pos);
        expect(els.$leftHandle).toHaveCss({'left': left + 'px'});
    });

    it('updates when setStep is called', function(){
        var els, control, step, stepDistance, left;

        els          = getPageElements();
        control      = getControl();
        trackWidth   = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        step         = 8;
        stepDistance = trackWidth / control.options.steps;
        left         = stepDistance * step;

        control.setStep(step);

        expect(control.getStep()).toEqual(step);
        expect(els.$leftHandle).toHaveCss({'left': left + 'px'});
    });

    // Interaction Tests

    it('updates position / step from mouse', function(){
        var els, trackWidth, control, pos, step;

        els        = getPageElements();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        control    = getControl();
        pos        = [0.2, 0.50, 0.7];
        step       = [6, 15, 21];

        _.each(pos, function(p, i, list){
            doBasicMouseDrag(els.$handles.eq(i), trackWidth * p);
        });

        expect(control.getPositions()).toEqual(pos);
        expect(control.getSteps()).toEqual(step);
    });

    it('updates from mouse when snap is enabled', function(){
        var els, trackWidth, control, pos, step;

        els        = getPageElements();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        control    = getControl({snap: true});
        pos        = [0.2, 0.5, 0.7];

        // lefts calculated with same logic as steps
        // snap shoudl adhear to step positions
        left = [
            Math.round(trackWidth * pos[0]),
            Math.round(trackWidth * pos[1]),
            Math.round(trackWidth * pos[2])
        ];

        // test that ui is snapping to correct coordinates despite
        // weird positioning
        _.each(pos, function(p, i, list){
            doBasicMouseDrag(els.$handles.eq(i), trackWidth * p);
            expect(els.$handles.eq(i)).toHaveCss({left: left[i] + 'px'});
        });
    });

    it('does not exceed max from mouse', function(){
        var els, control;

        els     = getPageElements();
        control = getControl();

        doBasicMouseDrag(els.$leftHandle, 5000);

        expect(control.getPosition()).toEqual(1);
    });

    it('does not exceed min from mouse', function(){
        var els, control;

        els     = getPageElements();
        control = getControl();

        doBasicMouseDrag(els.$leftHandle, -5000);

        expect(control.getPosition()).toEqual(0);
    });

    it('updates position / step from touch', function(){
        var els, trackWidth, control, pos, step;

        els        = getPageElements();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        control    = getControl();
        pos        = [0.2, 0.50, 0.7];
        step       = [6, 15, 21];

        _.each(pos, function(p, i, list){
            doBasicTouchDrag(els.$handles.eq(i), trackWidth * p);
        });

        expect(control.getPositions()).toEqual(pos);
        expect(control.getSteps()).toEqual(step);
    });

    it('updates to step only from touch when snap is enabled', function(){
        var els, trackWidth, control, pos, step;

        els        = getPageElements();
        trackWidth = getNormalizedTrackWidth(els.$track, els.$leftHandle);
        control    = getControl({snap: true});
        pos        = [0.2, 0.5, 0.7];

        // lefts calculated with same logic as steps
        left = [
            Math.round(trackWidth * pos[0]),
            Math.round(trackWidth * pos[1]),
            Math.round(trackWidth * pos[2])
        ];

        // test that ui is snapping to correct coordinates despite
        // weird positioning
        _.each(pos, function(p, i, list){
            doBasicTouchDrag(els.$handles.eq(i), trackWidth * p);
            expect(els.$handles.eq(i)).toHaveCss({left: left[i] + 'px'});
        });
    });

    it('does not exceed max from mouse', function(){
        var els, control;

        els     = getPageElements();
        control = getControl();

        doBasicTouchDrag(els.$leftHandle, 5000);

        expect(control.getPosition()).toEqual(1);
    });

    it('does not exceed min from mouse', function(){
        var els, control;

        els     = getPageElements();
        control = getControl();

        doBasicTouchDrag(els.$leftHandle, -5000);

        expect(control.getPosition()).toEqual(0);
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

        control.on(drag.DRAG_START, dragStart);

        doBasicMouseDrag(els.$leftHandle, 100);

        expect(dragStart).toHaveBeenCalled();
    });

    it('dispatches drag:stop for mouse', function(){
        var dragStop, els, control;

        dragStop  = jasmine.createSpy('dragStop');
        els       = getPageElements();
        control   = getControl();

        control.on(drag.DRAG_END, dragStop);

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

        control.on(drag.DRAG_START, dragStart);

        doBasicTouchDrag(els.$leftHandle, 100);

        expect(dragStart).toHaveBeenCalled();
    });

    it('dispatches drag:stop for touch', function(){
        var dragStop, els, control;

        dragStop  = jasmine.createSpy('dragStop');
        els       = getPageElements();
        control   = getControl();

        control.on(drag.DRAG_END, dragStop);

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
