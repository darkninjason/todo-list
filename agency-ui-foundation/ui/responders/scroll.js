define(function(require, exports, module){

// Imports
var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

var ScrollResponder = Marionette.Controller.extend({

    el: null,

    // Backbone & Marionette overrides

    /**
     * Initialize ScrollResponder
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * var scrollResponder = new ScrollResponder(
     *     {
     *         el: $('.scrollable-element'),  // required, window must be passed in as $(window)
     *         scroll: this.scrollCallback,   // default, no-op function
     *     }
     * );
     */
    initialize: function(options) {
        // apply options to this scope
        _.extend(this, options);

        // bind correct scope
        _.bindAll(
            this,
            '_didReceiveScroll'
        );

        if(!this.el) {
            throw 'No input element provided.';
        }

        this.$el = helpers.getElement(this.el);
        this.$el.on('scroll.auf.responders.scroll', this._didReceiveScroll);
    },

    onClose: function() {
        this.$el.off('scroll.auf.responders.scroll', this._didReceiveScroll);
    },

    // Internal event delegates

    // Binding to internal callbacks, instead of straight to
    // whatever the user passes in for "scroll" allows a known,
    // single-point to detach listeners. This should prevent most
    // memory leaks typically associated with event delegates when
    // "close" is run on this object.
    _didReceiveScroll: function(e) {

        // Forward on to assigned callback.
        var scrollIsFunction = _.isFunction(this.scroll);

        if(scrollIsFunction) {
            this.scroll(this, e);
        }
    },

    // Optional, user-defined delegates

    scroll: function(responder, e) {
        // noop
    },


}); // eof ScrollResponder

// Exports
module.exports = ScrollResponder;

}); // eof define
