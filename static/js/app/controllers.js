define(function(require, exports, module) {

var app = require('app/app');
var marionette = require('marionette');
var SliderView = require('app/views/slider-view').SliderView;
    
var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.slider.show(new SliderView());
    },
    index:function () {
        
    }
});

exports.AppController = AppController;

});
