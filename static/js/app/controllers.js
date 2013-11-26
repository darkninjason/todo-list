define(function(require, exports, module) {

var app                       = require('app/app');
var marionette                = require('marionette');
var ScrollerView              = require('app/modules/demo-scroller/views/scroller').ScrollerView;
var InputSelectView           = require('app/modules/demo-input-select/views/input-select').InputSelectView;
var InputSelectScrollableView = require('app/modules/demo-input-select/views/input-select').InputSelectScrollableView;
var DragAndDropDemoView = require('app/modules/demo-dnd/views/dnd').DragAndDropDemoView;

var DragAndDropDemoCompositeView = require('app/modules/demo-dnd/views/dnd').DragAndDropDemoCompositeView;
var HorizontalSlider    = require('app/modules/demo-horizontal-slider/views/horizontal').HorizontalSlider;
var HorizontalRangeSlider    = require('app/modules/demo-horizontal-slider/views/horizontal-range').HorizontalRangeSlider;

var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.scroller.show(new ScrollerView());
        app.inputSelect.show(new InputSelectView());
        app.inputSelectScrollable.show(new InputSelectScrollableView());
        app.dndTop.show(new DragAndDropDemoView());
        app.dndMid.show(new DragAndDropDemoView());
        app.dndBottom.show(new DragAndDropDemoCompositeView({dataType:'foo'}));
        app.dndBottom.show(new DragAndDropDemoView({dataType:'foo'}));
        app.horizontalSliderFluid.show(new HorizontalSlider());
        app.horizontalSliderSnapping.show(new HorizontalSlider({snap: true, steps: 10}));
        app.horizontalRangeSliderFluid.show(new HorizontalRangeSlider());
        app.horizontalRangeSliderSnapping.show(new HorizontalRangeSlider({snap: true, steps: 10}));
    },
    index:function () {

    }
});

exports.AppController = AppController;

});
