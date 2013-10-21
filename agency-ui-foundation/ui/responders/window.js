define(function(require, exports, module) {

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var WindowResponder = Marionette.Controller.extend({

    acceptsOrientation: false,
    acceptsResize     : false,
    resizeDebounce    : 300,

    // Backbone & Marionette overrides

    /**
     * Initialize WindowResponder
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * var windowResponder = new WindowResponder(
     *     {
     *         acceptsOrientation: true, // optional, default false, enables orientation delegation
     *         acceptsResize     : true, // optional, default false, enables resize delegation
     *         resizeDebounce    : 600,  // optional, default 300, debounces (or throttles) resize delegate calls
     *     }
     * );
     */
    initialize: function(options) {
        _.extend(this, options);

        _.bindAll(
            this,
            '_orientationChange',
            '_resize'
        );

        if(this.acceptsOrientation) {
            $(window).on('orientationchange.auf.responders.orientation', this._orientationChange);
        }
        if(this.acceptsResize) {
            $(window).on('resize.auf.responder.resize', this._resize);
        }
    },

    onClose: function() {
        $(window).off('orientationchange.auf.responders.orientation', this._orientationChange);
        $(window).off('resize.auf.responders.window', this._resize);
    },

    // Internal responder delgates

    _orientationChange: function(e) {
        this._interpretOrientationEvent(e);
    },

    _resize: function(e) {
        _.debounce(this.resize, this.resizeDebounce);
    },

    // User defined delegates

    resize: function(responder, e) {
        // noop
    },

    portrait: function(responder, e) {
         // noop
    },

    landscape: function(responder, e) {
         // noop
    },

    // Helpers

    _interpretOrientationEvent: function (e) {
        var orientation = e.target.orientation;

        if (orientation == 90 || orientation == -90) {
            this.landscape(this, e);
            return;
        }

        if(orientation === 0) {
            this.portrait(this, e);
            return;
        }
    }

}); // eof WindowResponder

// Exports

module.exports = WindowResponder;

}); // eof define
