define(function(require, exports, module) {

var app = require('app/app');
var marionette = require('marionette');
var HorizontalRangeSliderView = require('app/views/horizontal-range-slider').HorizontalRangeSliderView;
var ScrollerView = require('app/views/scroller').ScrollerView;
    
var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        // app.hRangeSlider.show(new HorizontalRangeSliderView());
        app.scroller.show(new ScrollerView());
    },
    index:function () {
        
    }
});

exports.AppController = AppController;

});
