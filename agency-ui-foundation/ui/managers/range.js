define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var RangeManager = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE: 'change',

    // Settings

    settings: {
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
        _.extend(this.settings, options);

        // Calculate computed properties
        this._computeRange();
    },

    // Internal computed properties

    _computeRange: function() {
        this._range = Math.abs(this.getMax() - this.getMin());
    },

    // Internal helper methods

    _getPositionForValue: function(val){
        var position = val / this.getRange();
        return this._getNormalizedPosition(position);
    },

    _getValueForPosition: function(val){
        position = this._getNormalizedPosition(val);
        return this.getRange() * position;
    },

    _getNormalizedPosition: function(val){
        // Ternary is faster than Math.min,max
        val = val > 1 ? 1 : val;
        val = val < 0 ? 0 : val;

        return val;
    },

    // 'Public' methods

    getPosition: function() {
        return this._position;
    },

    setPosition: function(val) {
        val = this._getNormalizedPosition(val);

        if(val != this._position) {
            this._position = val;
            this.dispatchChange();
        }
    },

    setValue: function(val){
        var position = this._getPositionForValue(val);
        this.setPosition(position);
    },

    getValue: function(){
        return this._getValueForPosition(this.getPosition());
    },

    getMin: function() {
        return this.settings.min;
    },

    setMin: function(val) {
        if(val > this.settings.max){
            throw "Min cannot be greater than max!";
        }

        if(val != this.settings.min) {
            this.settings.min = val;
            this._computeRange();
        }
    },

    getMax: function() {
        return this.settings.max;
    },

    setMax: function(val) {
        if(val < this.settings.min) {
            throw "Max cannot be less than min!";
        }

        if(val != this.getMax()) {
            this.settings.max = val;
            this._computeRange();
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

    dispatchChange: function() {
        this.trigger(this.EVENT_CHANGE, this, this.getPosition(), this.getValue());
    },

}); // eof RangeManager

// Exports
module.exports = RangeManager;

}); // eof define
