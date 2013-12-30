define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var dragEvents = require('built/core/events/drag');
var events = require('built/core/events/event');
var EventHelpers = require('lib/spec-helpers').Events;
var HorizontalSliderControl = require('built/core/controls/sliders/horizontal').HorizontalSliderControl;

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
            container        : $('.slider-container'),
            track            : $('.slider .track'),
            handles          : $('.slider .handle'),
            steps             : 30,
            acceptsMouse      : true,
            acceptsTouch      : true,
            acceptsOrientation: true,
            snap              : false
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getControl(augments) {
        return new HorizontalSliderControl(getOptions(augments));
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

    it('composes public api', function(){
        var scope, control, api;

        api = ['calculateMaxPosition',
            'getPositionAt',
            'getPositions',
            'getPositionForHandle',
            'setPositionAt',
            'setPositionForHandle',
            'getStepAt',
            'getSteps',
            'getStepForHandle',
            'setStepAt',
            'setStepForHandle',
            'getPosition',
            'setPosition',
            'getStep',
            'setStep'];
        scope = {};
        control = getControl();

        control.compose(scope);

        _.each(api, function(method, i, api){
            expect(_.isFunction(scope[method])).toEqual(true);
        });
    });

    it('recalculates max position', function(){
        var elements, $container, control, positions;

        elements = getPageElements();
        $container = elements.$container;
        control = getControl();
        positions = [0.25, 0.50, 0.75];

        _.each(positions, function(pos, i, positions){
            control.setPositionAt(pos, i);
        });

        // shrink the container
        $container.css('width', '150px');

        // recalculate positions
        control.calculateMaxPosition();

        // even though the width changed, recaculating max position
        // should result in values equal to the originals since
        // positions are relative to the max position.

        _.each(positions, function(pos, i, positions){
            expect(control.getPositionAt(i)).toEqual(positions[i]);
        });
    });

    it('updates when setPositionAt is called', function(){
        var elements, control, pos, left;

        elements = getPageElements();
        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        expect(control.getPositions()).toEqual(pos);
    });

    it('updates when setPositionForHandle is called', function(){
        var elements, $handles, control, pos, left;

        elements   = getPageElements();
        $handles   = elements.$handles;
        control    = getControl();
        pos        = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionForHandle(p, $handles.eq(i));
        });

        expect(control.getPositions()).toEqual(pos);
    });

    it('updates when setStepAt is called', function(){
        var elements, control, step, stepDistance, left;

        elements = getPageElements();
        control = getControl();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        step = [8, 15, 23];
        stepDistance = trackWidth / control.options.steps;

        _.each(step, function(s, i, list){
            control.setStepAt(s, i);
        });

        expect(control.getSteps()).toEqual(step);
    });

    it('updates when setStepForHandle is called', function(){
        var elements, $handles, control, step, stepDistance, left;

        elements = getPageElements();
        $handles = elements.$handles;
        control = getControl();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        step = [8, 15, 23];
        stepDistance = trackWidth / control.options.steps;

        _.each(step, function(s, i, list){
            control.setStepForHandle(s, $handles.eq(i));
        });

        expect(control.getSteps()).toEqual(step);
    });

    // Public 'Convenience' API

    it('updates when setPosition is called', function(){
        var elements, control, pos, left;

        elements = getPageElements();
        control = getControl();
        pos = 0.25;

        control.setPosition(pos);
        expect(control.getPosition()).toEqual(pos);
    });

    it('updates when setStep is called', function(){
        var elements, control, step, stepDistance, left;

        elements = getPageElements();
        control = getControl();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        step = 8;
        stepDistance = trackWidth / control.options.steps;

        control.setStep(step);
        expect(control.getStep()).toEqual(step);
    });

    it('gets position / step for handle', function(){
        var elements, control, position, step;

        elements = getPageElements();
        control = getControl();

        control.setPositionForHandle(0.5, elements.$leftHandle);

        position = control.getPositionForHandle(elements.$leftHandle);
        step = control.getStepForHandle(elements.$leftHandle);

        expect(position).toEqual(0.5);
        expect(step).toEqual(15);
    });

    // Interaction Tests

    it('updates position / step from mouse', function(){
        var elements, trackWidth, control, pos, step;

        elements = getPageElements();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        control = getControl();
        pos = [0.2, 0.50, 0.7];
        step = [6, 15, 20];

        _.each(pos, function(p, i, list){
            doBasicMouseDrag(elements.$handles.eq(i), trackWidth * p);
        });

        expect(control.getPositions()).toEqual(pos);
        expect(control.getSteps()).toEqual(step);
    });

    it('updates position / step from touch', function(){
        var elements, trackWidth, control, pos, step;

        elements = getPageElements();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        control = getControl({snap: true});
        pos = [0.2, 0.50, 0.7];
        step = [6, 15, 20];

        _.each(pos, function(p, i, list){
            doBasicTouchDrag(elements.$handles.eq(i), trackWidth * p);
        });

        expect(control.getPositions()).toEqual(pos);
        expect(control.getSteps()).toEqual(step);
    });

    it('does not exceed max from mouse or touch', function(){
        var elements, control;

        elements = getPageElements();
        control = getControl();

        doBasicMouseDrag(elements.$leftHandle, 5000);
        expect(control.getPosition()).toEqual(1);

        doBasicTouchDrag(elements.$leftHandle, 5000);
        expect(control.getPosition()).toEqual(1);
    });

    it('does not exceed min from mouse or touch', function(){
        var elements, control;

        elements = getPageElements();
        control = getControl();

        doBasicMouseDrag(elements.$leftHandle, -5000);
        expect(control.getPosition()).toEqual(0);

        doBasicTouchDrag(elements.$leftHandle, -5000);
        expect(control.getPosition()).toEqual(0);
    });

    // Events Tests

    it('dispatches drag events for mouse and touch', function(){
        var dragStartSpy, dragUpdateSpy, dragEndSpy, elements, control;

        dragStartSpy = jasmine.createSpy('start');
        dragUpdateSpy = jasmine.createSpy('update');
        dragEndSpy = jasmine.createSpy('end');
        elements = getPageElements();
        control = getControl();

        control.on(dragEvents.DRAG_START, dragStartSpy);
        control.on(dragEvents.DRAG_UPDATE, dragUpdateSpy);
        control.on(events.CHANGE, dragUpdateSpy);
        control.on(dragEvents.DRAG_END, dragEndSpy);

        doBasicMouseDrag(elements.$leftHandle, 100);
        doBasicTouchDrag(elements.$leftHandle, 50);

        expect(dragStartSpy.calls.count()).toEqual(2);
        expect(dragUpdateSpy.calls.count()).toEqual(4);
        expect(dragEndSpy.calls.count()).toEqual(2);
    });

    it('disables mouse when acceptsMouse is false', function(){
        var control, elements, spy;

        spy = jasmine.createSpy('dragUpdate');
        elements = getPageElements();
        control = getControl({acceptsMouse: false});

        control.on(dragEvents.DRAG_UPDATE, spy);
        control.on(events.CHANGE, spy);

        doBasicMouseDrag(elements.$leftHandle, 100);

        expect(spy).not.toHaveBeenCalled();
    });

    it('disables touch when acceptsTouch is false', function(){
        var control, elements, spy;

        spy = jasmine.createSpy('dragUpdate');
        elements = getPageElements();
        control = getControl({acceptsTouch: false});

        control.on(dragEvents.DRAG_UPDATE, spy);
        control.on(events.CHANGE, spy);

        doBasicTouchDrag(elements.$leftHandle, 100);

        expect(spy).not.toHaveBeenCalled();
    });

    // Marionette

    it('closes all responders on close', function(){
        var elements, trackWidth, control, pos, spy;

        spy = jasmine.createSpy('drag');
        elements = getPageElements();
        trackWidth = getNormalizedTrackWidth(elements.$track, elements.$leftHandle);
        control = getControl();

        control.on(dragEvents.DRAG_UPDATE, spy);
        control.on(events.CHANGE, spy);

        // call close
        control.close();

        // drag the handles around a bit
        doBasicMouseDrag(elements.$leftHandle, 100);

        // expect no movement
        expect(spy).not.toHaveBeenCalled();
    });

}); // eof describe
}); // eof define
