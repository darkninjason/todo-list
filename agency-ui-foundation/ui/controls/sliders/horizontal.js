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
// - Format, move getter / setters together

var HorizontalSlider = Marionette.Controller.extend({

    // Object vars

    $trackView: null,
    steps: 0,

    // Initialization

    initialize: function(options){
        var filtered = _.pick(options, '$trackView', 'steps');
        _.extend(this, filtered);
        _.bindAll(this, '_updateHandleOffset');

        this._initializeSteps();

        this.handles = [];
        this.handleValues = [];
        this.handleSteps = [];
        this.mouseResponders = [];
        this.touchResponders = [];

        this.ranges = [];

        this._initializeHandles.apply(this, options.$handles);
    },

    _initializeHandles: function(){
        var process = _.bind(function($h){
            var position = $h.position();

            this.handles.push($h[0]);
            this.handleValues.push($h);

            var range = new RangeManager({
                max: this._normalizeTrack($h)
            });

            range.setValue(position.left);

            var obj = {
                offsetPosition:range.getPosition(),
                range: range
            };

            this.ranges.push(obj);

            var step = this._calculateStepWithRangeAndPosition(obj, range.getPosition());
            this.handleSteps.push(step);


        }, this);

        _.each(arguments, process);

        this._initializeTouches();
        this._initializeMouse();
        this._initializeOrientation();
    },

    // Responder initialization

    _initializeOrientation: function(){
        var handleOrientation = _.bind(function(responder, e){
            this._normalizeTrackForAvailableHandles();
            this._initializeSteps();

            var self = this;

            _.each(this.handleValues, function($h){
                var handleIndex = self._getHandleIndex($h);
                var obj = self.ranges[handleIndex];
                var currentPosition = obj.range.getPosition();
                self.setPosition($h, currentPosition);
                self._updateHandleOffset($h);
            });
        }, this);


        this.orientationResponder = new OrientationResponder({
            portrait: handleOrientation,
            landscape: handleOrientation
        });
    },

    _initializeTouches: function(){
        var touchStart = _.bind(function(responder, e){
             e.preventDefault();
             var $h = responder.$el;
             this.trigger('drag:start', $h);
        }, this);

        var touchMove = _.bind(function(responder, e){
            e.preventDefault();

            this._handleWantsMove(responder.$el, responder.deltaX()[0]);
        }, this);

        var touchEnd = _.bind(function(responder, e){
            var $h = responder.$el;
            this._updateHandleOffset($h);
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

    _initializeMouse: function(){
        var mouseDragged = _.bind(function(responder, e){
            e.preventDefault();
            this._handleWantsMove(responder.$el, responder.deltaX());
        }, this);

        var mouseDown = _.bind(function(responder, e){
            e.preventDefault();
            var $h = responder.$el;
            this.trigger('drag:start', $h);

        }, this);

        var mouseUp = _.bind(function(responder, e){
            var $h = responder.$el;
            this._updateHandleOffset($h);
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

    _initializeSteps: function (){
        if(this.steps){
            this.stepUnit = 1 / this.steps;
        } else {
            this.stepUnit = 0;
        }
    },

    _updateHandleOffset: function($h){
        var handleIndex = this._getHandleIndex($h);

        var obj = this.ranges[handleIndex];
        obj.offsetPosition = obj.range.positionForValue($h.position().left);
    },

    _getHandleIndex: function($h){
        return this.handles.indexOf($h[0]);
    },

    _handleWantsMove: function($h, offset){
        var handleIndex = this._getHandleIndex($h);
        var obj = this.ranges[handleIndex];

        var position = this._calculatePositionWithRangeAndDelta(obj, offset);

        if(this.steps){
            // TODO: Repeated Code, @setPosition
            var step = this._calculateStepWithRangeAndPosition(obj, position);
            var currentStep = this.handleSteps[handleIndex];

            if(step != currentStep){
                this.setStep($h, step);
            }
        } else {
            this.setPosition($h, position);
        }
    },

    _calculateStepWithRangeAndPosition: function(obj, position){
        var range = obj.range;
        var currentPosition = range.getPosition();
        var action = position < currentPosition ? Math.ceil : Math.floor;
        return action(position * this.steps);
    },

    _calculatePositionWithRangeAndDelta: function(obj, delta){
        var range = obj.range;
        var value = range.valueForPosition(obj.offsetPosition);
        return range.positionForValue(value  + delta);
    },

    _normalizeTrackForAvailableHandles: function(){
        var process = _.bind(function($h){
            var handleIndex = this._getHandleIndex($h);
            var obj = this.ranges[handleIndex];
            obj.range.setMax(this._normalizeTrack($h));

        }, this);

        _.each(this.handleValues, process);
    },

    // TODO:
    // - Rename, name is a bit confugsing, maybe getTrackBounds()?
    _normalizeTrack: function($h){
        var $track = this.$trackView;
        var trackRect = $track[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();
        return trackRect.width - handleRect.width;
    },

    // TODO:
    // - Revisit, this function does zero validation.
    _moveTo: function($el, posX){
        $el.css({left: posX});
    },

    // 'Public' methods

    setPosition: function($h, position){
        var handleIndex = this._getHandleIndex($h);
        var obj         = this.ranges[handleIndex];

        obj.range.setPosition(position);

        this._moveTo($h, obj.range.getValue());
        this.trigger('change', this);

        // update step, if steps is enabled
        if(this.steps) {
            // TODO: Repeated code @_handleWantsMove
            var step = this._calculateStepWithRangeAndPosition(obj, position);
            var currentStep = this.handleSteps[handleIndex];

            if(step != currentStep){
                this.setStep($h, step);
            }
        }
    },

    setStep: function($h, value){
        var handleIndex = this._getHandleIndex($h);
        var target      = Math.min(this.steps, parseInt(value, 10));

        target = Math.max(0, target);

        this.handleSteps[handleIndex] = target;
        this.setPosition($h, target * this.stepUnit);
    },

    // TODO:
    // - Revisit, getPosition now returns arr
    // - Rename to getPositions?
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
