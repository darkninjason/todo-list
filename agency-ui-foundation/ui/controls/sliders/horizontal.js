define(function(require, exports, module){

// Imports

var Marionette           = require('vendor/marionette');
var _                    = require('vendor/underscore');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');
var OrientationResponder = require('auf/ui/responders/orientation');

// Module

var HorizontalSlider = Marionette.Controller.extend({

    // Object vars

    $trackView: null,
    steps: 0,

    // Initialization

    initialize: function(options){
        var filtered = _.pick(options, '$trackView', 'steps');
        _.extend(this, filtered);
        _.bindAll(this, 'updateHandleOffset');

        // normalizeTrack needs to happen 1st
        this.normalizeTrackForAvailableHandles();
        this.initializeSteps();

        this.handles = [];
        this.handleValues = [];
        this.handleOffsetX = [];
        this.handlePositionX = [];
        this.handleTracks = [];
        this.handleSteps = [];
        this.mouseResponders = [];
        this.touchResponders = [];

        this.initializeHandles.apply(this, options.$handles);
    },

    initializeHandles: function(){
        var process = _.bind(function($h){
            var position = $h.position();
            this.handles.push($h[0]);
            this.handleValues.push($h);
            this.handleTracks.push(this.normalizeTrack($h));
            this.handleOffsetX.push(position.left);

            var percentPosition = this.calculatePositionXForDelta($h, 0);
            this.handlePositionX.push(percentPosition);

            var step = this.calculateStepForPositionX($h, percentPosition);
            this.handleSteps.push(step);

        }, this);

        _.each(arguments, process);

        this.initializeTouches();
        this.initializeMouse();
        this.initializeOrientation();
    },

    initializeOrientation: function(){
        var handleOrientation = _.bind(function(responder, e){
            this.normalizeTrackForAvailableHandles();
            this.initializeSteps();

            var self = this;

            _.each(this.handleValues, function($h){
                var handleIndex = self.getHandleIndex($h);
                var currentPosition = self.handlePositionX[handleIndex];
                self.setPercent($h, currentPosition);
                self.updateHandleOffset($h);
            });
        }, this);


        this.orientationResponder = new OrientationResponder({
            portrait: handleOrientation,
            landscape: handleOrientation
        });
    },

    initializeTouches: function(){
        var touchStart = _.bind(function(responder, e){
             e.preventDefault();
             var $h = responder.$el;
             $h.css({'z-index': 1});
        }, this);

        var touchMove = _.bind(function(responder, e){
            e.preventDefault();
            this.responderWantsMove(responder);
        }, this);

        var touchEnd = _.bind(function(responder, e){
            var $h = responder.$el;
            $h.css({'z-index': 0});
            this.updateHandleOffset($h);
        }, this);

        var process = _.bind(function($h){
            var responder = new TouchResponder({
                el: $h,
                touchStart: touchStart,
                touchMove: touchMove,
                touchEnd: touchEnd
            });

            this.touchResponders.push(responder);

        }, this);

        _.each(this.handleValues, process);
    },

    initializeMouse: function(){
        var mouseDragged = _.bind(function(responder, e){
            e.preventDefault();
            this.responderWantsMove(responder);
        }, this);

        var mouseDown = _.bind(function(responder, e){
            e.preventDefault();
            var $h = responder.$el;
            $h.css({'z-index': 1});

        }, this);

        var mouseUp = _.bind(function(responder, e){
            var $h = responder.$el;
            $h.css({'z-index': 0});
            this.updateHandleOffset($h);
        }, this);

        var process = _.bind(function($h){
            var responder = new MouseResponder({
                el: $h,
                mouseDragged: mouseDragged,
                mouseDown: mouseDown,
                mouseUp: mouseUp
            });

            this.mouseResponders.push(responder);

        }, this);

        _.each(this.handleValues, process);

    },

    initializeSteps: function (){
        if(this.steps){
            this.stepUnit = 1 / this.steps;
        } else {
            this.stepUnit = 0;
        }
    },

    updateHandleOffset: function($h){
        var handleIndex = this.getHandleIndex($h);
        this.handleOffsetX[handleIndex] = $h.position().left;
    },

    getHandleIndex: function($h){
        return this.handles.indexOf($h[0]);
    },

    getHandleOffsetX: function($h){
        var handleIndex = this.getHandleIndex($h);
        return this.handleOffsetX[handleIndex];
    },

    responderWantsMove: function(responder){
        var $h = responder.$el;
        var position = this.calculatePositionXForDelta($h, responder.deltaX());

        if(this.steps){
            var handleIndex = this.getHandleIndex($h);
            var step = this.calculateStepForPositionX($h, position);
            var currentStep = this.handleSteps[handleIndex];

            if(step != currentStep){
                this.setStep($h, step);
            }
        } else {

            this.setPercent($h, position);
        }
    },

    calculateStepForPositionX: function($h, positionX){
        var handleIndex = this.getHandleIndex($h);
        var currentPosition = this.handlePositionX[handleIndex];
        var action = positionX < currentPosition ? Math.ceil : Math.floor;
        return action(positionX * this.steps);
    },

    calculatePositionXForDelta: function($h, deltaX){
        var handleIndex = this.getHandleIndex($h);
        var offsetX = this.getHandleOffsetX($h);
        var normalizedTrack = this.handleTracks[handleIndex];
        var posX = offsetX + deltaX;
        var position = posX / normalizedTrack;

        position = Math.min(1, position);
        position = Math.max(0, position);

        return position;
    },

    normalizeTrackForAvailableHandles: function(){
        this.handleTracks = [];
        var process = _.bind(function($h){
            this.handleTracks.push(this.normalizeTrack($h));
        }, this);

        _.each(this.handleValues, process);
    },

    normalizeTrack: function($h){
        var $track = this.$trackView;
        var trackRect = $track[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();
        return trackRect.width - handleRect.width;
    },

    setPercent: function ($h, percent){
        var handleIndex = this.getHandleIndex($h);
        var normalizedTrack = this.handleTracks[handleIndex];
        var x = percent * normalizedTrack;
        this.moveTo($h, x);
        this.handlePositionX[handleIndex] = percent;
        this.trigger('change', this);
    },

    setStep: function($h, value){
        var handleIndex = this.getHandleIndex($h);
        var target = Math.min(this.steps, parseInt(value, 10));
        target = Math.max(0, target);

        this.handleSteps[handleIndex] = target;
        this.setPercent($h, target * this.stepUnit);
    },

    moveTo: function($el, posX){
        $el.css({left: posX});
    },

    getPosition: function(){
        return this.handlePositionX;
    },

    getSteps: function(){
        return this.handleSteps;
    }

}); // eof HorizontalSlider

// Exports
module.exports = HorizontalSlider;

}); // eof define
