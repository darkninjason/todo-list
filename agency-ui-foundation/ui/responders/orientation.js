define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');

// Module

var OrientationResponder = Marionette.Controller.extend({

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, 'orientationChange');

        $(window).on('orientationchange', this.orientationChange);
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
        $(window).off('orientationchange', this.orientationChange);
    }
}); // eof OrientationResponder

// Exports

module.OrientationResponder = OrientationResponder;

}); // eof define
