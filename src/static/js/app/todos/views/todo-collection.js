define(function(require, exports, module) {

    var marionette = require('marionette'),
        TodoView = require('app/todos/views/todo').TodoView;

    var TodoCollectionView = marionette.CollectionView.extend({
        tagName: "ul",
        itemView: TodoView
    });

    exports.TodoCollectionView = TodoCollectionView;

});