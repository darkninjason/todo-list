define(function(require, exports, module){

    var Marionette = require('marionette'),
        _ = require('underscore');
        mouse = require('blitz/ui/responders/mouse');
        touches = require('blitz/ui/responders/touches');
        OrientationResponder = require('blitz/ui/responders/orientation').OrientationResponder;

    var HorizontalSlider = Marionette.Controller.extend({
        $handleView: null,
        $trackView: null,
        steps: 0,

        initialize: function(options){
            var filtered = _.pick(options, '$handleView', '$trackView', 'steps');
            _.extend(this, filtered);
            _.bindAll(this, 'updateHandleOffset');

            this.currentPosition = 0.0;
            this.trackWidth = this.normalizeTrack();
            this.initializeSteps();
            this.updateHandleOffset();

            this._touchResponder = new touches.TouchResponder({
                el: this.$handleView,

                touchStart: _.bind(function(ctx, e){
                    e.preventDefault();
                }, this),

                touchMove: _.bind(function(ctx, e){
                    e.preventDefault();
                    this.responderWantsMove(ctx);
                }, this),

                touchEnd: this.updateHandleOffset
            });

            this._mouseResponder = new mouse.MouseResponder({
                el: this.$handleView,

                mouseDragged: _.bind(function(ctx, e){
                    e.preventDefault();
                    this.responderWantsMove(ctx);
                }, this),

                mouseDown: _.bind(function(ctx, e){
                    e.preventDefault();
                }, this),

                mouseUp: this.updateHandleOffset
            });

            this._orientationResponder = new OrientationResponder({
                portrait: _.bind(function(ctx, e){
                    this.trackWidth = this.normalizeTrack();
                    this.initializeSteps();
                    this.setPercent(this.currentPosition);
                    this.updateHandleOffset();
                }, this),

                landscape: _.bind(function(ctx, e){
                    this.trackWidth = this.normalizeTrack();
                    this.initializeSteps();
                    this.setPercent(this.currentPosition);
                    this.updateHandleOffset();
                }, this)
            });
        },

        initializeSteps: function (){
            if(this.steps){
                this.stepUnit = 1 / this.steps;
            } else {
                this.stepUnit = 0;
            }
        },

        updateHandleOffset: function(){
            this.handleOffsetX = parseInt(this.$handleView.css('left'), 10);
        },

        responderWantsMove: function(responder){
            var posX = this.handleOffsetX + responder.deltaX();
            var position = posX / this.trackWidth;
            position = Math.min(1, position);
            position = Math.max(0, position);

            if(this.steps){
                action = position < this.currentPosition ? Math.ceil : Math.floor;
                var s = action(position * this.steps);

                if(s != this.currentStep){
                    this.setStep(s);
                }
            } else {

                this.setPercent(position);
            }
        },

        normalizeTrack: function(){
            var $track = this.$trackView;
            var $handle = this.$handleView;
            var trackRect = $track[0].getBoundingClientRect();
            var handleRect = $handle[0].getBoundingClientRect();

            return trackRect.width - handleRect.width;
        },

        setPercent: function (percent){
            var x = percent * this.trackWidth;
            this.moveTo(this.$handleView, x);
            this.currentPosition = percent;
        },

        setStep: function(value){
            var target = Math.min(this.steps, parseInt(value, 10));
            target = Math.max(0, target);

            this.currentStep = target;
            this.setPercent(target * this.stepUnit);
        },

        moveTo: function($el, posX){
            $el.css({left: posX});
        }

    });

    module.exports.HorizontalSlider = HorizontalSlider;
});
