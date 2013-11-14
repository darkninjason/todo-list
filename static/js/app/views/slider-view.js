define(function (require, exports, module) {
    
var marionette = require('marionette'),
template = require('hbs!tpl/slider');

var SliderView = marionette.ItemView.extend({
    template : template,
    ui : {
        
    },
    events : {
        
    },
    initialize : function(){
        
    }
});

exports.SliderView = SliderView;

});