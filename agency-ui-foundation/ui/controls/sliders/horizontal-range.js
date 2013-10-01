define(function(require, exports, module){

// Imports

var Marionette       = require('vendor/marionette');
var _                = require('vendor/underscore');
var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');

// Module

var HorizontalRangeSlider =  Marionette.Controller.extend({

    // Initialization

    initialize: function(options){
        _.bindAll(this, 'responderWantsMove');
        this.slider = new HorizontalSlider(options);
        this.slider.responderWantsMove = this.responderWantsMove;
        this.listenTo(this.slider, 'change', this.rangeDidChange);
    },

    rangeDidChange: function(slider){
        // forward the event
        this.trigger('change', this);
    },

    responderWantsMove: function(responder){
        var $h = responder.$el;

        var action;
        var handleIndex = this.slider.getHandleIndex($h);
        var position = this.slider.calculatePositionXForDelta($h, responder.deltaX());

        if(this.slider.steps){
            var step = this.slider.calculateStepForPositionX($h, position);
            var currentStep = this.slider.handleSteps[handleIndex];

            if(step != currentStep){
                step = this.enforceRangeStep(handleIndex, step);
                this.slider.setStep($h, step);
            }
        } else {
            position = this.enforceRangePosition(handleIndex, position);
            this.slider.setPercent($h, position);
        }
    },

    enforceRangePosition: function(index, position){
        if(index == 1){
            return Math.max(this.slider.handlePositionX[0], position);
        }

        return Math.min(this.slider.handlePositionX[1], position);
    },

    enforceRangeStep: function(index, step){
        if(index == 1){
            return Math.max(this.slider.handleSteps[0], step);
        }

        return Math.min(this.slider.handleSteps[1], step);
    },

    getPosition: function(){
        return this.slider.handlePositionX;
    },

    getSteps: function(){
        return this.slider.handleSteps;
    },

    // Marionette overrides

    onClose: function(){
        this.slider.close();
    }

}); // eof HorizontalRangeSlider

// Exports
module.exports = HorizontalRangeSlider;

}); // eof define
