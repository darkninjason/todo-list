define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var RangeManager = Marionette.Controller.extend({

    EVENT_CHANGE: 'change',
    EVENT_MARKER: 'marker',

    _defaults: null,
    _range   : null,
    _position: 0,

    // associated marker values
    _prevPosition: null,
    _markers: null,
    _lastDispatched: null,

    /**
     * Initialize RangeManager
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * rangeManager = new RangeManager(
     *     {
     *         min: 0, // default 0
     *         max: 1, // default 1
     *     }
     * );
     */
    initialize: function(options) {
        this._defaults = {
            min: 0,
            max: 1
        };

        // Apply defaults to options
        _.defaults(options, this._defaults);

        this._markers         = [];
        this._lastDispatched  = [];

        // Calculate computed properties
        this._computeRange();
    },

    // Internal computed properties

    _computeRange: function() {
        this._range = Math.abs(this.getMax() - this.getMin());
    },

    // Internal methods

    _getNormalizedPosition: function(val){
        // Ternary is faster than Math.min,max
        val = val > 1 ? 1 : val;
        val = val < 0 ? 0 : val;

        return val;
    },

    _checkMarkers: function(prevPosition, position) {
        var reached, iterator, direction, inBetween;

        function incremental(marker, i, markers) {
            inBetween = marker >= prevPosition && marker <= position;
            if(inBetween) {
                reached.push(marker);
            }
        }

        function decremental(marker, i, markers) {
            inBetween = marker <= prevPosition && marker >= position;
            if(inBetween) {
                reached.push(marker);
            }
        }

        // modified by iterator functions above
        reached   = [];
        direction = (prevPosition < position) ? 'incremental' : 'decremental';
        iterator  = direction == 'incremental' ? incremental : decremental;

        // loop over markers to see if we've passed any
        _.each(this._markers, iterator, this);

        // TODO:
        // Revisit - I noticed that sometimes the same marker was dispatched 2x
        //      I put this in to try and solve that. Unfortunately, it was
        //      boarfing any marker that I passed then return to
        //      in the opposite direction. :( Need to come back to this.
        //
        // filter out markers that were already dispatched
        // reached = _.difference(reached, this._lastDispatched);

        // if reached has items, dispatch marker event
        if(reached.length > 0) {
            this._dispatchMarker(reached, direction);
            this._lastDispatched = reached;
        }
    },

    // 'Public' methods

    /**
     * Calculates a range position for a literal range value between min and max.
     * @param  {number} val a value between min and max
     * @return {number}     a position from 0 - 1 based on the provided value.
     *
     * @note
     * This will not set any value internally, retrives a possible value only.
     */
    calculatePositionForValue: function(val){
        var position = val / this.getRange();
        return this._getNormalizedPosition(position);
    },

    /**
     * Calculates a literal range value for range position.
     * @param  {number} val a value from 0 - 1
     * @return {number}     the value for the position provided.
     *
     * @note
     * This will not set any value internally, retreives a possible value only.
     */
    calculateValueForPosition: function(val){
        position = this._getNormalizedPosition(val);
        return this.getRange() * position;
    },

    getPosition: function() {
        return this._position;
    },

    setPosition: function(val) {
        val = this._getNormalizedPosition(val);

        if(val != this._position) {
            this._prevPosition = this._position;
            this._position = val;
            this._checkMarkers(this._prevPosition, this._position);

            this._dispatchChange();
        }
    },

    setValue: function(val){
        var position = this.calculatePositionForValue(val);
        this.setPosition(position);
    },

    getValue: function(){
        return this.calculateValueForPosition(this.getPosition());
    },

    getMin: function() {
        return this.options.min;
    },

    setMin: function(val) {
        if(val > this.options.max){
            throw 'Min cannot be greater than max!';
        }

        if(val != this.options.min) {
            this.options.min = val;
            this._computeRange();
            this._dispatchChange();
        }
    },

    getMax: function() {
        return this.options.max;
    },

    setMax: function(val) {
        if(val < this.options.min) {
            throw 'Max cannot be less than min!';
        }

        if(val != this.getMax()) {
            this.options.max = val;
            this._computeRange();
            this._dispatchChange();
        }
    },

    getRange: function() {
        return this._range;
    },

    setRange: function(min, max) {
        this.setMin(min);
        this.setMax(max);
    },

    // associated marker methods

    _sortArrayAscending: function(a, b) {
        // see: http://bit.ly/1c0cPTU
        return a - b;
    },

    getMarkers: function() {
        // return (shallow) copy of markers
        return this._markers.slice();
    },

    /**
     * add positions (values between 0 and 1) to the markers array
     * @param {arguments} __args__ position arguments
     *
     * @usage addMarkerPositions([*positions])
     * @example addMerkerPositions(0.1, 0.2, 0.3)
     */
    addMarkerPositions: function(__args__) {
        // __args__ is there to denote that this function takes 'arguments'
        // if you're familiar with python it's inspired by *args.
        // unfortunately, * is not a legal character for function args in js.
        // I added it to make the signature more explicit
        var sorted;

        function iterator(position, i, list) {
            if(position < 0 || position > 1) {
                throw 'Position out of range. Valid positions are between 0 and 1, position: ' + position;
            }

            this._markers.push(position);
        }

        sorted = true;

        // add positions to this._markers
        _.each(arguments, iterator, this);

        this._markers.sort(this._sortArrayAscending);
        this._markers = _.uniq(this._markers, sorted);
    },

    removeMarkerPositions: function(__args__) {
        var markerIndex;

        function iterator(arg, i, list) {
            markerIndex = _.indexOf(this._markers, arg);

            if(markerIndex == -1) {
                return;
            }

            this._markers.splice(markerIndex, 1);
        }

        // attempt removal of requested positions
        // non-existing positions are ignored
        _.each(arguments, iterator, this);
    },

    addMarkerValues: function(__args__) {
        var positions;

        positions = _.map(
            arguments,
            this.rangeManager.calculatePositionForValue,
            this.rangeManager
        );

        this.addMarkerPositions.apply(this, positions);
    },

    removeMarkerValues: function(__args__) {
        var positions;

        positions = _.map(
            arguments,
            this.rangeManager.calculatePositionForValue,
            this.rangeManager
        );

        this.removeMarkerPositions.apply(this, positions);
    },

    // Event Dispatchers

    _dispatchChange: function() {
        this.trigger(this.EVENT_CHANGE, this, this.getPosition(), this.getValue());
    },

    _dispatchMarker: function(markers, direction) {
        this.trigger(this.EVENT_MARKER, this, markers, direction);
    }

}); // eof RangeManager

// Exports
module.exports = RangeManager;

}); // eof define
