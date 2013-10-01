define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');

// Module

var TouchResponder = Marionette.Controller.extend({

    // Object vars

    el: null,
    clickCountTimeout: 350,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_touchStart', '_touchMove', '_touchEnd', '_touchCancel');

        if(!this.el) return;
        var $el;

        if(_.isString(this.el)){
            $el = $(this.el);
        } else $el = this.el;

        this.$el = $el;

        this.$el.on('touchstart', {ctx: this}, this._touchStart);
        this.$el.on('touchmove', {ctx: this}, this._touchMove);
        this.$el.on('touchend', {ctx: this}, this._touchEnd);
        this.$el.on('touchcancel', {ctx: this}, this._touchCancel);
    },

    _clickCounter: function(){
        if(!this._clickTimeout){
            this._clicks = 0;

            var handle = $.proxy(function(){
                this._clickTimeout = null;
            }, this);

            this._clickTimeout = setTimeout(handle, this.clickCountTimeout);
        }

        this._lastClick = new Date().getTime();
        return ++this._clicks;
    },

    // Internal Handlers

    _touchStart: function(e){
        this._startX = e.originalEvent.pageX;
        this._startY = e.originalEvent.pageY;

        // multiple mouse clicks are conceptually treated as a single
        // mouse-down event within the clickCountTimeout window
        // (although they arrive in a series of mouseDown: messages).
        this._clickCounter();
        this.touchStart(this, e);
    },

    _touchEnd: function(e){
        this._endX = e.originalEvent.pageX;
        this._endY = e.originalEvent.pageY;

        // Returns 0 for a mouse-up event if the clickCountTimeout
        // has passed since the corresponding mouse-down event.
        // This is because if the clickCountTimeout passes before
        // the mouse button is released, it is no longer considered
        // a mouse click, but a mouse-down event followed by a
        // mouse-up event. In other words, holding after a mouse-down
        // and then releasing after a period of time will yield a
        // click count of 0
        var now = new Date().getTime();
        this._clicks = (now - this._lastClick) > this.clickCountTimeout ? 0 : this._clicks;
        this.touchEnd(this, e);
    },

    _touchMove: function(e){
        this._endX = e.originalEvent.pageX;
        this._endY = e.originalEvent.pageY;
        this.touchMove(this, e);
    },

    _touchCancel: function(e){
        this.touchCancel(this, e);
    },

    touchStart: function(responder, e){
        // noop
    },

    touchMove: function(responder, e){
        // noop
    },

    touchEnd: function(responder, e){
        // noop
    },

    touchCancel: function(responder, e){
        // noop
    },

    clickCount: function(){
        return this._clicks;
    },

    deltaX: function(){
        return this._endX - this._startX;
    },

    deltaY: function(){
        return this._endY - this._startY;
    },

    // Marionette overrides

    onClose: function(){
        this.$el.off('touchstart', this._touchStart);
        this.$el.off('touchmove', this._touchMove);
        this.$el.off('touchend', this._touchEnd);
        this.$el.off('touchcancel', this._touchCancel);
    }

}); // eof TouchResponder

// Exports

module.exports = TouchResponder;

}); // eof define
