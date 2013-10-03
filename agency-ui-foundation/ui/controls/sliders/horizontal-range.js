define(function(require, exports, module){

// Imports

var Marionette       = require('marionette');
var _                = require('underscore');
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
        var handleIndex = this.slider.getHandleIndex($h);
        var obj = this.slider.ranges[handleIndex];

        var position = this.slider.calculatePositionWithRangeAndDelta(obj, responder.deltaX());

        if(this.slider.steps){
            var step = this.slider.calculateStepWithRangeAndPosition(obj, position);
            var currentStep = this.slider.handleSteps[handleIndex];

            if(step != currentStep){
                step = this.enforceRangeStep(handleIndex, step);
                this.slider.setStep($h, step);
            }
        } else {
            position = this.enforceRangePosition(handleIndex, position);
            this.slider.setPosition($h, position);
        }
    },

    enforceRangePosition: function(index, position){
        if(index == 1){
            return Math.max(this.slider.ranges[0].range.getPosition(), position);
        }

        return Math.min(this.slider.ranges[1].range.getPosition(), position);
    },

    enforceRangeStep: function(index, step){
        if(index == 1){
            return Math.max(this.slider.handleSteps[0], step);
        }

        return Math.min(this.slider.handleSteps[1], step);
    },

    getPosition: function(){
        return this.slider.getPosition();
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
