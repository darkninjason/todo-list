define(function(require, exports, module){

// Imports
var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

// TODO:
// - Check out waypoints
// - Check out twbs scrolly thing
// - Compose range manager?
// - Takes element position (x, y), dispatches event when reached.
// - Takes element scroll percentage, dispatches event when reached.
// - Can also set scroll position?

var ScrollManager = Marionette.Controller.extend({

    responder: null,

    _defaults: {
        el: null,
    },

    initialize: function(options) {
        _.defaults(options, defaults);

        if(!this.options.el) {
            throw 'No input element provided.';
        }

        this.$el = helpers.getElement(this.options.el);
    },

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
