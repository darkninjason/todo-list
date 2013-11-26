define(function (require, exports, module) {

var marionette = require('marionette');
var _ = require('underscore');
var Slider = require('built/ui/controls/slider').Slider;


var HorizontalSliderBase =  marionette.ItemView.extend({
    _defaults:{
        steps: 0,
        snap: false
    },

    initialize: function(options){
        options = options || {};
        options = _.defaults(options, this._defaults);

        this.steps = options.steps ;
        this.snap = options.snap;
    },

    initializeSliderControl: function(){

        var options = {
            $container: this.$el,
            $track: this.$('.track'),
            $handles: this.$('.handle'),
            steps: this.steps,
            snap: this.snap
        };

        this.slider = new Slider({
            driver: this.getDriver(options),
            $container:options.$container,
            $track: options.$track,
            $handles: options.$handles
        });
    },

    getPosition: function() {
        return this.slider._driver.getPosition(value);
    },

    setPosition: function(value) {
        this.slider._driver.setPosition(value);
    },

    getStep: function() {
        return this.slider._driver.getStepAt(0);
    },

    setStep: function(value) {
        this.slider._driver.setStepAt(value, 0);
    },

    getDriver: function(options){
        throw new Error('getDriver Not Implemented');
    }
});

exports.HorizontalSliderBase = HorizontalSliderBase;

});
