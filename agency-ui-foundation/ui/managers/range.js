define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var RangeManager = Marionette.Controller.extend({

    // Option vars

    _min     : 0,
    _max     : 1,
    _steps   : 1,

    // Position vars

    _position: 0,
    _step    : 0,

    // Computed vars

    _range   : null,
    _stepDistance: null, // read-only

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
     *         steps: 1, // default 1
     *     }
     * );
     */
    initialize: function(options) {
        // Initialize settings
        this.setMax   ( options.max   || this.getMax()   );
        this.setMin   ( options.min   || this.getMin()   );
        this.setSteps ( options.steps || this.getSteps() );

        // Calculate computed properties
        this.computeRange();
        this.computeStepDistance();
    },

    // Computers

    computeRange: function() {
        this._range = Math.abs(this.getMax() - this.getMin());
    },
    computeStepDistance: function() {
        this._stepDistance = this.getRange() / this.getSteps();
    },

    // Helpers

    getPositionForStep: function(val) {
        return (this._stepDistance * val) / 100;
    },
    getStepForPosition: function(val) {
        return Math.floor(this.getSteps() * val);
    },

    hasArguments: function(args) {
        return args.length > 0;
    },

    // Module methods

    getPosition: function() {
        return this._position;
    },
    setPosition: function(val) {
        val = val > 1 ? 1 : val; // warn?
        val = val < 0 ? 0 : val; // warn?

        if(val != this._position) {
            this._position = val;
            this._step     = this.getStepForPosition(this._position);
        }
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
            this.computeStepDistance();
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
            this.computeStepDistance();
        }
    },

    getRange: function() {
        return this._range;
    },
    setRange: function(min, max) {
        this.setMin(min);
        this.setMax(max);
    },

    getSteps: function() {
        return this._steps;
    },
    setSteps: function(val) {
        val = val < 1 ? 1 : val; // warn?

        if(val != this._steps) {
            this._steps = val;
            this.computeStepDistance();

            // Recalculate position for new step distance
            this.setPosition(this.getPositionForStep(this._step));
        }
    },

    getStep: function() {
        return this._step;
    },
    setStep: function(val) {
        // local ref
        var steps = this._steps;

        val = val > steps ? steps : val; // warn?
        val = val < 0 ? 0 : val; // warn?

        // Check if number is whole
        // Flatten if not
        val = val % 1 != 0 ? Math.floor(val) : val; // warn

        if(val != this._step) {
            this._step     = val;
            this._position = this.getPositionForStep(this._step);

            console.log('set', this._step);
        }

    },

    getStepDistance: function() {
        return this._stepDistance;
    },

    // Sugars

    position: function(val) {
        return this.hasArguments(arguments)
            ? this.setPosition(val) : this.getPosition();
    },
    step: function(val) {
        return this.hasArguments(arguments)
            ? this.setStep(val) : this.getStep();
    },
    min: function(val) {
        return this.hasArguments(arguments)
            ? this.setMin(val) : this.getMin();
    },
    max: function(val) {
        return this.hasArguments(arguments)
            ? this.setMax(val) : this.getMax();
    },
    range: function(min, max) {
        return this.hasArguments(arguments)
            ? this.setRange(min, max) : this.getRange();
    },
    steps: function(val) {
        return this.hasArguments(arguments)
            ? this.setSteps(val) : this.getSteps();
    },
    step: function(val) {
        return this.hasArguments(arguments)
            ? this.setStep(val) : this.getStep();
    },

    // Read-only
    stepDistance: function(){
        return this.getStepDistance();
    }

}); // eof RangeManager

// Exports
module.exports = RangeManager;

}); // eof define
