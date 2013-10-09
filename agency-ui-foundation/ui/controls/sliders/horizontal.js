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
        this.ranges = [];

        this._initializeHandles.apply(this, options.$handles);
    },

    _initializeHandles: function(){
        var process = _.bind(function($h){
            var position = $h.position();

            this.handles.push($h[0]);

            var range = new RangeManager({
                max: this._normalizeTrackBoundsForHandle($h)
            });

            range.setValue(position.left);

            // lil object to help us along the way
            // when managing multiple handles
            var obj = {
                offsetPosition:range.getPosition(),
                step: null,
                range: range,
                $handle: $h
            };

            obj.step = this._calculateStepWithRangeAndPosition(obj, range.getPosition());
            this.ranges.push(obj);

        }, this);

        _.each(arguments, process);

        this._initializeTouches();
        this._initializeMouse();
        this._initializeOrientation();
    },

    // Responder initialization
    _initializeOrientation: function(){
        var handleOrientation = _.bind(function(responder, e){
            this._normalizeTrackBoundsForAvailableHandles();
            this._initializeSteps();

            var self = this;

            _.each(this.ranges, function(obj){
                var $h = obj.$handle;
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

        var process = _.bind(function(obj){
            var responder = new TouchResponder({
                el: obj.$handle,
                touchStart: touchStart,
                touchMove: touchMove,
                touchEnd: touchEnd
            });
        }, this);

        _.each(this.ranges, process);
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

        var process = _.bind(function(obj){
            var responder = new MouseResponder({
                el: obj.$handle,
                mouseDragged: mouseDragged,
                mouseDown: mouseDown,
                mouseUp: mouseUp
            });
        }, this);

        _.each(this.ranges, process);
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
            var step = this._calculateStepWithRangeAndPosition(obj, position);
            if(step != obj.step){
                this.setStepForObj(step, obj);
            }
        } else {
            this.setPositionForObj(position, obj);
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

    _normalizeTrackBoundsForAvailableHandles: function(){
        var process = _.bind(function(obj){
            obj.range.setMax(this._normalizeTrackBoundsForHandle(obj.$handle));

        }, this);

        _.each(this.ranges, process);
    },

    _normalizeTrackBoundsForHandle: function($h){
        var $track = this.$trackView;
        var trackRect = $track[0].getBoundingClientRect();
        var handleRect = $h[0].getBoundingClientRect();
        return trackRect.width - handleRect.width;
    },

    _moveTo: function($el, posX){
        $el.css({left: posX});
    },

    // 'Public' methods
    setPositionForObj: function(position, obj){
        obj.range.setPosition(position);
        this._moveTo(obj.$handle, obj.range.getValue());
        this.trigger('change', this);
    },

    setStepForObj: function(value, obj){
        var target = Math.min(this.steps, parseInt(value, 10));
        target = Math.max(0, target);

        obj.step = target;
        this.setPositionForObj(target * this.stepUnit, obj);
    },

    getPositions: function(){
        return _.map(this.ranges, function(x){
            return x.range.getPosition();
        });
    },

    getPositionAt: function(index){
        return this.ranges[index].range.getPosition();
    },

    setPositionAt: function(position, index){
        var obj = this.ranges[index];
        this.setPositionForObj(position, obj);
    },

    getSteps: function(){
        return _.map(this.ranges, function(x){
            return x.step;
        });
    },

    getStepAt: function(index){
        return this.ranges[index].step;
    },

    setStepAt: function(step, index){
        var obj = this.ranges[index];
        this.setStepForObj(step, index);
    },

    // Convenience
    getPosition: function(){
        return this.getPositionAt(0);
    },

    getStep: function(){
        return this.getStepAt(0);
    }

}); // eof HorizontalSlider

// Exports
module.exports = HorizontalSlider;

}); // eof define
