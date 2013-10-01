define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');

// Module

var MouseResponder = Marionette.Controller.extend({

    // Object vars

    el: null,
    acceptsMoveEvents: false,
    clickCountTimeout: 350,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_mouseDown', '_mouseUp', '_mouseDragged', '_mouseMoved');

        if(!this.el) return;
        var $el;

        if(_.isString(this.el)){
            $el = $(this.el);
        } else $el = this.el;

        this.$el = $el;

        this.$el.on('mousedown', {ctx: this}, this._mouseDown);
        this.$el.on('mouseup', {ctx: this}, this._mouseUp);

        // does not participate in the internal state system
        if (this.acceptsMoveEvents){
            this.$el.on('mousemove', {ctx: this}, this._mouseMoved);
        }
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

    /* In order to handle 'dragged' we need to handle some
    internal state. We don't want the user overriding these
    internal handlers so they are prefixed with an _ and will
    call the public handlers accordingly */

    // Internal Handlers
    _mouseDown: function(e){
        this._startX = e.pageX;
        this._startY = e.pageY;

        // multiple mouse clicks are conceptually treated as a single
        // mouse-down event within the clickCountTimeout window
        // (although they arrive in a series of mouseDown: messages).
        this._clickCounter();

        // watch for dragging
        $(document).on('mousemove', this._mouseDragged);
        $(document).on('mouseup', this._mouseUp);
        this.mouseDown(this, e);
    },

    _mouseUp: function(e){
        this._endX = e.pageX;
        this._endY = e.pageY;

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

        // disable for dragging
        $(document).off('mousemove', this._mouseDragged);
        $(document).off('mouseup', this._mouseUp);
        this.mouseUp(this, e);
    },

    _mouseDragged: function(e){
        this._endX = e.pageX;
        this._endY = e.pageY;
        this.mouseDragged(this, e);
    },

    _mouseMoved: function(e){
        this.mouseMoved(this, e);
    },

    // External Handlers
    mouseDown: function(responder, e){
        // noop
    },

    mouseUp: function(responder, e){
        // noop
    },

    mouseMoved: function(responder, e){
        // noop
    },

    mouseDragged: function(responder, e){
        // noop
    },

    deltaX: function(){
        return this._endX - this._startX;
    },

    deltaY: function(){
        return this._endY - this._startY;
    },

    clickCount: function(){
        return this._clicks;
    },

    // Marionette overrides

    onClose: function(){
        this.$el.off('mousedown', this._mouseDown);
        this.$el.off('mouseup', this._mouseUp);

        // to ensure it's gone
        $('body').off('mousemove', this._mouseDragged);

        if (this.acceptsMoveEvents){
            this.$el.off('mousemove', this._mouseMoved);
        }
    }

}); // eof MouseResponder

// Exports

module.exports = MouseResponder;

}); // eof define
