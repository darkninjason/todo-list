define(function(require, exports, module){
    var Marionette = require('marionette'),
        _ = require('underscore');

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
    });

    module.exports.OrientationResponder = OrientationResponder;
});
