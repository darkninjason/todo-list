define(function(require, exports, module) {

var _ = require('underscore');
var HorizontalRangeSliderControl = require('built/core/controls/sliders/horizontal-range').HorizontalRangeSliderControl;
var events = require('built/core/events/event');
var dragEvents = require('built/core/events/drag');
var EventHelpers = require('lib/spec-helpers').Events;

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
            container: $('.slider-container'),
            track: $('.slider .track'),
            handles: $('.slider .handle'),
            steps: 30,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true,
            snap: false
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getControl(augments) {
        return new HorizontalRangeSliderControl(getOptions(augments));
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

    // Extended Functionality Tests

    it('composes additional api', function(){
        var scope, control, api;

        api = ['getRanges'];
        scope = {};
        control = getControl();

        control.compose(scope);

        _.each(api, function(method, i, api){
            expect(_.isFunction(scope[method])).toEqual(true);
        });
    });

    it('does not exceed min (0)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(-1, 0);

        expect(control.getPositionAt(0)).toEqual(0);
    });

    it('does not exceed max (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 0);

        expect(control.getPositionAt(0)).toEqual(pos[1]);
    });

    it('does exceed min (position at index 0)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 1);

        expect(control.getPositionAt(1)).toEqual(pos[0]);
    });

    it('does exceed max (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 1);

        expect(control.getPositionAt(1)).toEqual(pos[2]);
    });

    it('does exceed min (position at index 1)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 2);

        expect(control.getPositionAt(2)).toEqual(pos[1]);
    });

    it('does exceed max (1)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.50, 0.75];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(2, 2);

        expect(control.getPositionAt(2)).toEqual(1);
    });

    // Public API

    it('returns expected ranges', function(){
        var control, pos, expectedRanges;

        pos = [0.25, 0.50, 0.75];
        control = getControl();
        expectedRanges = [pos[1] - pos[0], pos[2] - pos[1]];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        expect(control.getRanges()).toEqual(expectedRanges);
    });

    it('does not exceed min with snap enabled (position at index 0)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.5, 0.75];
        step = [8, 15, 23];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(0, 1);

        expect(control.getStepAt(1)).toEqual(step[0]);
    });

    it('does not exceed max with snap enabled (position at index 2)', function(){
        var control, pos;

        control = getControl();
        pos = [0.25, 0.5, 0.75];
        step    = [8, 15, 23];

        _.each(pos, function(p, i, list){
            control.setPositionAt(p, i);
        });

        control.setPositionAt(1, 1);

        expect(control.getStepAt(1)).toEqual(step[2]);
    });

}); // eof describe
}); // eof define
