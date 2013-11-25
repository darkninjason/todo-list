define(function (require, exports, module) {
var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var marionette = require('marionette');
var mixins = require('built/core/utils/helpers').mixins;

var DragAndDropCompositeView = marionette.CompositeView.extend({

});

mixins(DragAndDropCollectionView, DragAndDropCompositeView, [
    'initialize',
    'onShow',
    'onClose',
    'getViewForEl',
    '_onRender',
    'getDragImage',
    'renderPlaceholderForData',
    'getViewForId',
    'getDragDataForElement',
    'serializeModel',
    'deserializeModel',
    'dropResponderPerformDragOperation',
    'draggingEndedRestoreElementAtPosition',
    'appendHtml']);

exports.DragAndDropCompositeView = DragAndDropCompositeView;

});
