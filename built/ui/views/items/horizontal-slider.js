define(function (require, exports, module) {

var marionette = require('marionette');
var Slider = require('built/ui/controls/slider').Slider;


var HorizontalSliderBase =  marionette.ItemView.extend({

    initializeSliderControl: function(){

        var options = {
            $container: this.$el,
            $track: this.$('.track'),
            $handles: this.$('.handle')};

        this.slider = new Slider({
            driver: this.getDriver(options),
            $container:options.$container,
            $track: options.$track,
            $handles: options.$handles
        });
    },

    getDriver: function(options){
        throw 'Not Implemented';
    }
});

exports.HorizontalSliderBase = HorizontalSliderBase;

});
