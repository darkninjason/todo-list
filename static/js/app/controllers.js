define(function(require, exports, module) {

var app                       = require('app/app');
var marionette                = require('marionette');
var ScrollerView              = require('app/modules/demo-scroller/views/scroller').ScrollerView;
var InputSelectView           = require('app/modules/demo-input-select/views/input-select').InputSelectView;
var InputSelectScrollableView = require('app/modules/demo-input-select/views/input-select').InputSelectScrollableView;
var DragAndDropDemoView = require('app/modules/demo-dnd/views/dnd').DragAndDropDemoView;


var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.scroller.show(new ScrollerView());
        app.inputSelect.show(new InputSelectView());
        app.inputSelectScrollable.show(new InputSelectScrollableView());
        app.dndTop.show(new DragAndDropDemoView());
        app.dndMid.show(new DragAndDropDemoView());
        app.dndBottom.show(new DragAndDropDemoView({dataType:'foo'}));
    },
    index:function () {

    }
});

exports.AppController = AppController;

});
