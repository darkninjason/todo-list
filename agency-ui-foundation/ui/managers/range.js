define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var RangeManager = Marionette.Controller.extend({

    // Option vars

    _min     : 0,
    _max     : 1,

    // Position vars

    _position: 0,

    // Computed vars

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
        // Initialize settings
        this.setMax   ( options.max   || this.getMax()   );
        this.setMin   ( options.min   || this.getMin()   );

        // Calculate computed properties
        this.computeRange();
    },

    // Computers

    computeRange: function() {
        this._range = Math.abs(this.getMax() - this.getMin());
    },

    // Module methods

    getPosition: function() {
        return this._position;
    },

    setPosition: function(val) {
        val = this.normalizePosition(val);

        if(val != this._position) {
            this._position = val;
        }
    },

    setValue: function(val){
        var position = this.positionForValue(val);
        this.setPosition(position);
    },

    getValue: function(){
        return this.valueForPosition(this.getPosition());
    },

    getMin: function() {
        return this._min;
    },

    setMin: function(val) {
        if(val > this._max){
            throw "Min cannot be greater than max!";
        }

        if(val != this._min) {
            this._min = val;
            this.computeRange();
        }
    },

    getMax: function() {
        return this._max;
    },

    setMax: function(val) {
        if(val < this._min) {
            throw "Max cannot be less than min!";
        }

        if(val != this.getMax()) {
            this._max = val;
            this.computeRange();
        }
    },

    getRange: function() {
        return this._range;
    },

    setRange: function(min, max) {
        this.setMin(min);
        this.setMax(max);
    },

    // Helpers

    positionForValue: function(val){
        var position = val / this.getRange();
        return this.normalizePosition(position);
    },

    valueForPosition: function(val){
        position = this.normalizePosition(val);
        return this.getRange() * position;
    },

    normalizePosition: function(val){
        // Ternary is faster than Math.min,max
        val = val > 1 ? 1 : val;
        val = val < 0 ? 0 : val;

        return val;
    }

}); // eof RangeManager

// Exports
module.exports = RangeManager;

}); // eof define
