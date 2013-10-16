define(function(require, exports, module){

// Imports
var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

var ScrollResponder = Marionette.Controller.extend({

    el: null,

    initialize: function(options) {
        _.extend(this, options);

        if(!this.el) {
            throw 'No input element provided.';
        }

        this.$el = helpers.getElement(this.el);
    },

    _didReceiveScroll: function(e) {
        // TODO: Do something useful

        // Forward on to assigned callback.
        this.scroll(e);
    },

    scroll: function(e) {
        // noop
    }

}); // eof ScrollResponder

// Exports
module.exports = ScrollResponder;

}); // eof define
