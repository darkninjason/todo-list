define(function(require, exports, module) {

    var marionette = require('marionette'),
        TodoView = require('app/todos/views/todo').TodoView,
        DragAndDropCollectionView = require('vendor/built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;

    var DragDropList = require('built/core/controls/dragdrop/list').DragDropList;

    var TodoCollectionView = DragAndDropCollectionView.extend({
        tagName: "ul",
        itemView: TodoView,
        renderPlaceholderForData: function(){
            return $('<li class="row placeholder">--> HERE <--</li>');
        }
    });

    exports.TodoCollectionView = TodoCollectionView;

});