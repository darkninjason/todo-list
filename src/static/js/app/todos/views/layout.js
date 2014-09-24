define(function(require, exports, module) {

    var marionette = require('marionette'),
        templateLayout = require('hbs!app/todos/templates/layout');

    // models
    var TodoFooter = require('app/todos/models/todo-footer').TodoFooter,
        Placeholder = require('app/todos/models/placeholder').Placeholder;

    // collection
    var TodoList      = require('app/todos/collections/todo-list').TodoList;

    // views
    var PlaceholderView   = require('app/todos/views/placeholder').PlaceholderView,
        TodoFooterView    = require('app/todos/views/todo-footer').TodoFooterView,
        TodoCollectionView       = require('app/todos/views/todo-collection').TodoCollectionView;

    var TodoLayoutView = marionette.Layout.extend({
        template: templateLayout,

        regions: {
            header: '#header',
            main: '#main',
            footer: '#footer'
        },

        onShow: function(){
            var todoList = new TodoList();

            this.header.show(new PlaceholderView({collection: todoList, model: new Placeholder()}));
            this.main.show(new TodoCollectionView({collection: todoList}));
            this.footer.show(new TodoFooterView({collection: todoList, model: new TodoFooter()}));

            // todoList.fetch();
        }
    });

    exports.TodoLayoutView = TodoLayoutView;

});