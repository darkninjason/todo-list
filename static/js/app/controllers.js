define(function(require, exports, module) {

var app                          = require('app/app');
var marionette                   = require('marionette');
var InputSelectView              = require('app/modules/demo-input-select/views/input-select').InputSelectView;
var DragAndDropDemoView          = require('app/modules/demo-dnd/views/dnd').DragAndDropDemoView;
var DragAndDropDemoCompositeView = require('app/modules/demo-dnd/views/dnd').DragAndDropDemoCompositeView;
var SelectDemoComposite          = require('app/modules/demo-select/views/select').SelectDemoComposite;
var selectFromSelect             = require('built/ui/views/composite/select').selectFromSelect;
var modelFromElements            = require('built/ui/helpers/dom').modelFromElements;
var HorizontalSlider             = require('app/modules/demo-horizontal-slider/views/horizontal').HorizontalSlider;
var HorizontalRangeSlider        = require('app/modules/demo-horizontal-slider/views/horizontal-range').HorizontalRangeSlider;

var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.inputSelect.show(new InputSelectView());
        app.dndTop.show(new DragAndDropDemoView());
        app.dndMid.show(new DragAndDropDemoView());
        app.dndBottom.show(new DragAndDropDemoCompositeView({dataType:'com.built.foo'}));

        // // doesn't bind them
        // var selectData = modelFromElements($('#select-data').find('option').toArray(), null, {content:'option'});
        // var selectCollection = new Backbone.Collection(selectData);
        // app.select.show(new SelectDemoComposite({collection:selectCollection}));

        var select = selectFromSelect(SelectDemoComposite, $('#select-data'));
        app.select.show(select);

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
