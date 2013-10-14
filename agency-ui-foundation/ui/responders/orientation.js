define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');

// Module

var OrientationResponder = Marionette.Controller.extend({

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, 'orientationChange');

        $(window).on('orientationchange.auf.responders.orientation', this.orientationChange);
    },

    orientationChange: function(e){
        this.interpretOrientationEvent(e);
    },

    portrait: function(responder, e){
         // noop
    },

    landscape: function(responder, e){
         // noop
    },

    interpretOrientationEvent: function (e){
        var orientation = window.orientation;

        if (orientation == 90 || orientation == -90){
            this.landscape(this, e);
            return;
        }

        if(orientation === 0){
            this.portrait(this, e);
        }
    },

    onClose: function(){
        $(window).off('orientationchange.auf.responders.orientation', this.orientationChange);
    }
}); // eof OrientationResponder

// Exports

module.exports = OrientationResponder;

}); // eof define
