define(function(require, exports, module){
// Imports

var Marionette           = require('marionette');
var _                    = require('underscore');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');
var OrientationResponder = require('auf/ui/responders/orientation');
var RangeManager         = require('auf/ui/managers/range');

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

        this.initializeSteps();

        this.handles = [];
        this.handleValues = [];
        this.handleSteps = [];
        this.mouseResponders = [];
        this.touchResponders = [];

        this.ranges = [];
        this.initializeHandles.apply(this, options.$handles);
    },

    initializeHandles: function(){
        var process = _.bind(function($h){
            var position = $h.position();
            this.handles.push($h[0]);
            this.handleValues.push($h);

            var range = new RangeManager({
                max: this.normalizeTrack($h)
            });

            range.setValue(position.left);

            var obj = {
                offsetPosition:range.getPosition(),
                range: range
            };

            this.ranges.push(obj);

            var step = this.calculateStepWithRangeAndPosition(obj, range.getPosition());
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
                var obj = self.ranges[handleIndex];
                var currentPosition = obj.range.getPosition();
                self.setPosition($h, currentPosition);
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
             this.trigger('drag:start', $h);
        }, this);

        var touchMove = _.bind(function(responder, e){
            e.preventDefault();
            this.handleWantsMove(responder.$el, e.deltaX()[0]);
        }, this);

        var touchEnd = _.bind(function(responder, e){
            var $h = responder.$el;
            this.updateHandleOffset($h);
            this.trigger('drag:stop', $h);
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
            this.handleWantsMove(responder.$el, e.deltaX());
        }, this);

        var mouseDown = _.bind(function(responder, e){
            e.preventDefault();
            var $h = responder.$el;
            this.trigger('drag:start', $h);

        }, this);

        var mouseUp = _.bind(function(responder, e){
            var $h = responder.$el;
            this.updateHandleOffset($h);
            this.trigger('drag:stop', $h);
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

        var obj = this.ranges[handleIndex];
        obj.offsetPosition = obj.range.positionForValue($h.position().left);
    },

    getHandleIndex: function($h){
        return this.handles.indexOf($h[0]);
    },

    handleWantsMove: function($h, offset){
        var handleIndex = this.getHandleIndex($h);
        var obj = this.ranges[handleIndex];

        var position = this.calculatePositionWithRangeAndDelta(obj, offset);

        if(this.steps){
            var step = this.calculateStepWithRangeAndPosition(obj, position);
            var currentStep = this.handleSteps[handleIndex];

            if(step != currentStep){
                this.setStep($h, step);
            }
        } else {
            this.setPosition($h, position);
        }
    },

    calculateStepWithRangeAndPosition: function(obj, position){
        var range = obj.range;
        var currentPosition = range.getPosition();
        var action = position < currentPosition ? Math.ceil : Math.floor;
        return action(position * this.steps);
    },

    calculatePositionWithRangeAndDelta: function(obj, delta){
        var range = obj.range;
        var value = range.valueForPosition(obj.offsetPosition);
        return range.positionForValue(value  + delta);
    },

    normalizeTrackForAvailableHandles: function(){
        var process = _.bind(function($h){
            var handleIndex = this.getHandleIndex($h);
            var obj = this.ranges[handleIndex];
            obj.range.setMax(this.normalizeTrack($h));

        }, this);

        _.each(this.handleValues, process);
    },

    normalizeTrack: function($h){
        var $track = this.$trackView;
        var trackRect = $track[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();
        return trackRect.width - handleRect.width;
    },

    setPosition: function($h, position){
        var handleIndex = this.getHandleIndex($h);

        var obj = this.ranges[handleIndex];
        obj.range.setPosition(position);

        this.moveTo($h, obj.range.getValue());
        this.trigger('change', this);
    },

    setStep: function($h, value){
        var handleIndex = this.getHandleIndex($h);
        var target = Math.min(this.steps, parseInt(value, 10));
        target = Math.max(0, target);

        this.handleSteps[handleIndex] = target;
        this.setPosition($h, target * this.stepUnit);
    },

    moveTo: function($el, posX){
        $el.css({left: posX});
    },

    getPosition: function(){
        return _.map(this.ranges, function(x){
            return x.range.getPosition();
        });
    },

    getSteps: function(){
        return this.handleSteps;
    }

}); // eof HorizontalSlider

// Exports
module.exports = HorizontalSlider;

}); // eof define
