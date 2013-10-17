define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var RangeManager = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE: 'change',

    // Defaults

    _defaults: {
        min: 0,
        max: 1
    },

    _position: 0,
    _range   : null,

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
        _.defaults(options, this._defaults);

        // Calculate computed properties
        this._computeRange();
    },

    // Internal computed properties

    _computeRange: function() {
        this._range = Math.abs(this.getMax() - this.getMin());
    },

    // Internal helper methods

    _validatePosition: function(position) {
        var positionIsEmpty = _.isEmpty(position);

        if(positionIsEmpty){
            throw "Empty parameter: position = " + position;
        }
    },

    _getNormalizedPosition: function(val){
        // Ternary is faster than Math.min,max
        val = val > 1 ? 1 : val;
        val = val < 0 ? 0 : val;

        return val;
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
        this._validatePosition(val);

        val = this._getNormalizedPosition(val);

        if(val != this._position) {
            this._position = val;
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
            throw "Min cannot be greater than max!";
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
            throw "Max cannot be less than min!";
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

    // Event Dispatchers

    _dispatchChange: function() {
        this.trigger(this.EVENT_CHANGE, this, this.getPosition(), this.getValue());
    },

}); // eof RangeManager

// Exports
module.exports = RangeManager;

}); // eof define
