define(function(require, exports, module) {

var app = require('app/app');
var marionette = require('marionette');
var ScrollerView = require('app/modules/demo-scroller/views/scroller').ScrollerView;
var InputSelectView = require('app/modules/demo-input-select/views/input-select').InputSelectView;

var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.scroller.show(new ScrollerView());
        app.inputSelect.show(new InputSelectView());

    },
    index:function () {

    }
});

exports.AppController = AppController;

});
