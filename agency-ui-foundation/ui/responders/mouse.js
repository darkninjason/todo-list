define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

var MouseResponder = Marionette.Controller.extend({

    // Object vars

    el: null,

    // Why rely on these accepts* flags? Why not use the presence of
    // the public user callbacks: mouseUp, mouseDown, etc to designate
    // which mouse events are importnat?
    // The user may or may pass mouseUp, mouseDown, etc at construction
    // time. It's entirely possible to do this:
    //
    // var m = new MouseResponder({el:'...', acceptsUpDown: true});
    // m.mouseUp = myHandler.mouseUp.
    //
    // in that case, we would have never known to even start listenting
    // for up or down events if we only relied on them being set at
    // initialization time.
    acceptsUpDown: true,
    acceptsMove: false,
    acceptsEnterExit: false,

    // Time window, in milliseconds,  to count clicks
    clickCountTimeout: 350,

    // Initialization
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_mouseDown', '_mouseUp',
            '_mouseEntered', '_mouseExited',
            '_mouseDragged', '_mouseMoved');

        if(!this.el) return;
        this.$el = helpers.getElement(this.el);

        if(this.acceptsUpDown){
            this.$el.on('mousedown', {ctx: this}, this._mouseDown);
            this.$el.on('mouseup', {ctx: this}, this._mouseUp);
        }

        if (this.acceptsMove){
            this.$el.on('mousemove', {ctx: this}, this._mouseMoved);
        }

        if (this.acceptsEnterExit){
            this.$el.on('mouseenter', {ctx: this}, this._mouseEntered);
            this.$el.on('mouseleave', {ctx: this}, this._mouseExited);
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

    // In order to handle 'dragged' we need to handle some
    // internal state. We don't want the user overriding these
    // internal handlers so they are prefixed with an _ and will
    // call the public handlers accordingly

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

    _mouseEntered: function(e){
        this.mouseEntered(this, e);
    },

    _mouseExited: function(e){
        this.mouseExited(this, e);
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

    mouseEntered: function(responder, e){
        // noop
    },

    mouseExited: function(responder, e){
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
        // to ensure it's gone
        $('body').off('mousemove', this._mouseDragged);

        if(this.acceptsUpDown){
            this.$el.off('mousedown', this._mouseDown);
            this.$el.off('mouseup', this._mouseUp);
        }

        if (this.acceptsEnterExit){
            this.$el.off('mouseenter', this._mouseEntered);
            this.$el.off('mouseleave', this._mouseExited);
        }

        if (this.acceptsMove){
            this.$el.off('mousemove', this._mouseMoved);
        }
    }

}); // eof MouseResponder

// Exports

module.exports = MouseResponder;

}); // eof define
