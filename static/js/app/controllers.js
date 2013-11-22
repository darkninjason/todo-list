define(function(require, exports, module) {

var app = require('app/app');
var marionette = require('marionette');
var ScrollerView = require('app/modules/demo-scroller/views/scroller').ScrollerView;
var InputSelectView = require('app/modules/demo-input-select/views/input-select').InputSelectView;
var InputSelectScrollableView = require('app/modules/demo-input-select/views/input-select').InputSelectScrollableView;
var DragAndDropCollectionView = require('app/modules/demo-dnd/views/dnd').DragAndDropCollectionView;

var ColorDropList = require('app/modules/demo-dnd/views/color-list').ColorDropList;

var AppController =  marionette.Controller.extend({

    initialize:function (options) {
        app.scroller.show(new ScrollerView());
        app.inputSelect.show(new InputSelectView());
        app.inputSelectScrollable.show(new InputSelectScrollableView());
        app.dndTop.show(new DragAndDropCollectionView());
        app.dndMid.show(new DragAndDropCollectionView());
        app.dndBottom.show(new DragAndDropCollectionView());

        var $colorLists = $('section.dnd.classic ul');

        _.each($colorLists, function(each){
             var $el = $(each);
             var l = new ColorDropList();
             l.setDropElement($el);
             l.reset($el.children());
        });

    },
    index:function () {

    }
});

exports.AppController = AppController;

});
