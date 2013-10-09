define(function(require, exports, module){
// Imports

var Marionette           = require('marionette');
var _                    = require('underscore');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');
var OrientationResponder = require('auf/ui/responders/orientation');
var RangeManager         = require('auf/ui/managers/range');

// Module

// TODO:
// - Options
//   - $track             // required
//   - $handles           // required (at least 1)
//   - acceptsMouse       // default true
//   - acceptsTouch       // default false
//   - acceptsKeys        // default false
//   - acceptsOrientation // default false
//   - steps              // number of steps, default is 0
//   - snap               // should view 'snap' to steps, default false
//
// - Public API
//   - getPosition()
//   - getPositions()
//   - getHandlePosition()
//   - setPosition()
//   - setPositions()
//   - setHandlePosition()
//   - setHandlePositions()
//   - getStep()
//   - getSteps()
//   - getHandleStep()
//   - setStep()
//   - setSteps()
//   - setHandleStep()
//   - setHandleSteps()
//
// - Events
//   - change
//   - drag: start
//   - drag: end
//
// - Interaction support
//   - Mouse
//   - Touch
//   - Device Orientation
//   - Keys (arrows, depends on slider orientation)
//
// - Handling n-handles
//   - Each handle will have it's own "range" because handle widths can vary
//   - No need to store this, I think; easier to determine at runtime?
//   - Cache on init.
//
// Tasks
// - Implement Mouse Handling
// - Implement Touch Handling
// - Implement Key Handling
// - Implement Orientation Handling
//
// Thoughts
// - Handles take starting position?
// - Change event reports steps, positions, target step, target position?
//
var HorizontalSlider = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE:     'change',
    EVENT_DRAG_START: 'drag: start',
    EVENT_DRAG_END:   'drag: stop;',

    ranges: null,
    mouseResponders: null,

    // Settings

    settings: {
        $track: null,
        $handles: null,
        steps: 0,
        snap: false,
        acceptsMouse: true,
        acceptsTouch: false,
        acceptsKeys: false,
        acceptsOrientation: false
    },

    // Backbone & Marionette overrides

    /**
     * Initialize HorizontalSlider
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * horizontalSlider = new HorizontalSlider(
     *     {
     *         $track: $('.slider .track'),    // required
     *         $handles: $('.slider .handle'), // required
     *         steps: 10,                      // default 0
     *         snap: true,                     // default false
     *         acceptsMouse: true              // default true
     *         acceptsTouch: true              // default false
     *         acceptsKeys: true               // default false
     *         acceptsOrientation: true        // default false
     *     }
     * );
     */
    initialize: function(options){
        var settings = _.extend(this.settings, options);

        var hasTrackSetting     = settings.$track !== null;
        var hasOneTrack         = hasTrackSetting && settings.$track.length == 1;
        var hasHandleSetting    = settings.$handles !== null;
        var hasAtLeastOneHandle = hasHandleSetting && settings.$handles.length > 0;

        if(!hasOneTrack) {
            throw 'HorizontalSlider requires at least one track element!';
        }

        if(!hasAtLeastOneHandle) {
            throw 'HorizontalSlider requires at least one handle element!';
        }

        this._initializeRanges(settings);

        if(this.settings.acceptsMouse){
            this.mouseResponders = this._initializeMouse(settings);
        }
    },

    onClose: function() {
        // remove events
    },

    // Internal initialization

    _initializeRanges: function(settings) {
        var ranges = this._getNormalizedRanges(
            settings.$track,
            settings.$handles
        );

        var id, range, $handle, listener;
        var i = 0;
        var len = ranges.length;

        for(i; i < len; i++) {
            id       = i;
            range    = ranges[i];
            $handle  = settings.$handles.eq(i);
            listener = _.bind(this._rangeDidChange, this, $handle);

            // attach listener to range: change
            this.listenTo(range, 'change', listener);
        }

        this.ranges = ranges;
    },

    _getNormalizedRanges: function($track, $handles) {
        var max;
        var min = 0;

        var results       = [];
        var trackBounds   = this._getElementBounds($track[0]);
        var handlesBounds = this._getElementsBounds($handles.toArray());

        var i   = 0;
        var len = handlesBounds.length;

        for(i; i < len; i++) {
            max = trackBounds.width - handlesBounds[i].width;
            results.push(new RangeManager({min:min, max:max}));
        }

        return results;
     },

    _initializeMouse: function(settings) {
        var range, mouseDragged, mouseDown, mouseUp, responder;
        var $handles = settings.$handles;
        var ranges = this.ranges;
        var i = 0;
        var len = $handles.length;
        var results = [];

        console.log('underscore', _);

        for(i; i < len; i++) {
            range        = ranges[i];
            mouseDragged = _.bind(this._handleDidReceiveMouseDrag, this, range);
            mouseDown    = _.bind(this._handleDidRecieveMouseDown, this, range);
            mouseUp      = _.bind(this._handleDidRecieveMouseUp, this, range);

            responder = new MouseResponder({
                el: $handles.eq(i),
                mouseDragged: mouseDragged,
                mouseDown: mouseDown,
                mouseUp: mouseUp
            });

            results.push(responder);

        }

        return results;
    },

    handleOffset: 0,

    _handleDidReceiveMouseDrag: function(range, responder, e) {
        // console.log('_handleDidReceiveMouseDrag', range, responder, e);
        e.preventDefault();

        var delta = responder.deltaX();

        console.log('delta', delta, this.handleOffset, delta + this.handleOffset);

        $handle = responder.$el;
        left = delta + this.handleOffset;

        left = left > range.getMax() ? range.getMax() : left;
        left = left < 0 ? 0 : left;

        $handle.css({'left': left + 'px'});

        range.setValue(left);
    },

    _handleDidRecieveMouseDown: function(range, responder, e) {
        // console.log('_handleDidRecieveMouseDown',range, responder, e);
        e.preventDefault();
        this.handleOffset = responder.$el.position().left;
    },

    _handleDidRecieveMouseUp: function(range, responder, e) {
        // console.log('_handleDidRecieveMouseUp', range, responder, e);
        e.preventDefault();
        this.handleOffset = responder.$el.position().left;
    },

    // 'Protected' methods

    // OK to override!
    _updateHandlePosition: function($handle, range, position, value) {
        var left = value;
        $handle.css({'left': left});
    },

    // 'Private' helper accessors

    _getElementBounds: function(el) {
        // el is raw dom element
        // returns ClientRect: {'bottom', 'height', 'left', 'right', 'top', 'width'}
        // TODO: IE Support, may need polyfill later.
        return el.getBoundingClientRect();
    },

    _getElementsBounds: function(elements) {
        // elements is a list of raw dom elements
        // returns multiple ClientRects for list of elements.

        var results = [];
        var i = 0;
        var len = elements.length;

        for(i; i < len; i++){
            results.push(this._getElementBounds(elements[i]));
        }

        return results;
    },

    _getHandleIndex: function($handle) {
        return this.settings.$handles.index($handle);
    },

    _getRange: function(index) {
        var range = this.ranges[index];

        if(typeof range == 'undefined') {
            throw 'Index out of range, this.ranges[' + index + '], when length is ' + this.ranges.length + '.';
        }

        return range;
    },

    // 'Public' Position methods

    getPosition: function(index) {
        index = index || 0;
        return this._getRange(index).getPosition();
    },

    getPositions: function() {
        var results = [];
        var ranges  = this.ranges;
        var i       = 0;
        var len     = ranges.length;

        for(i; i < len; i++) {
            results.push(this.getPosition(i));
        }

        return results;
    },

    getHandlePosition: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getPosition(index);
    },

    setPosition: function(value, index) {
        index = index || 0; // default to 0
        this._getRange(index).setPosition(value);
    },

    setHandlePosition: function(value, $handle) {
        var index = this._getHandleIndex($handle);
        this.setPosition(value, index);
    },

    // Step methods

    getStep: function(index) {
        index = index || 0;
        var position = this.getPosition(index);

        // round will round-up if decimal is .5 or higher.
        // this should give good reporting of steps
        return Math.round(this.settings.steps * position);
    },

    getSteps: function() {
        var results = [];
        var ranges  = this.ranges;
        var i       = 0;
        var len     = ranges.length;

        for(i; i < len; i++) {
            results.push(this.getStep(i));
        }

        return results;
    },

    getHandleStep: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getStep(index);
    },

    setStep: function(value, index) {
        // set step value for index
        index = index || 0;

        var posiiton;
        var steps = this.settings.steps;
        var step  = value;

        // normalize step value
        step = step > steps ? steps : step;
        step = step < 0 ? 0 : step;

        // isNaN check handles 0/0 case
        position = step/steps;
        position = isNaN(position) ? 0 : position;

        this.setPosition(position, index);
    },

    setHandleStep: function(value, $handle) {
        var index = this._getHandleIndex($handle);
        this.setStep(value, index);
    },

    // Event delegates

    _rangeDidChange: function($handle, range, position, value) {
        console.log('_rangeDidChange', position, value);
        this._updateHandlePosition($handle, range, position, value);
        // this.dispatchChange();
    },

    // Event Dispatchers

    // TODO: possibly pass in target, and related data
    dispatchChange: function() {
        // this.trigger(this.EVENT_CHANGE, this.getPositions(), this.getSteps());
    },

}); // eof HorizontalSlider

// Exports
module.exports = HorizontalSlider;

}); // eof define
