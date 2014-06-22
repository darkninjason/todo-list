define(function(require, exports, module) {

    var marionette = require('marionette'),
        templatePlaceholder = require('hbs!app/todos/templates/placeholder'),
        Todo = require('app/todos/models/todo').Todo,
        TodoList = require('app/todos/collections/todo-list').TodoList,
        app = require('app/app');

    var PlaceholderView = marionette.ItemView.extend({
        template: templatePlaceholder,

        ui: {
            newTodo: '#new-todo'
        },

        events:{
            'keypress input' : 'addTodo',
            'click .toggle-all' : 'toggleAll'
        },

        addTodo: function(e){
            if(e.keyCode == 13 && (this.ui.newTodo.val().length > 0)){
                var todo = new Todo({title: this.ui.newTodo.val()});
                app.Todos.addTodo(todo);
                this.ui.newTodo.val('');
            }
        },

        toggleAll: function(){
            if(app.Todos.where({completed: true}).length === app.Todos.length){
                this.uncompleteAll();
            } else {
                this.completeAll();
            }
        },

        completeAll: function(){

            app.Todos.forEach(function(model){
                if(!model.get('completed')){
                    model.toggleState();
                }
            });
        },

        uncompleteAll: function(){

            app.Todos.forEach(function(model){
                if(model.get('completed')){
                    model.toggleState();
                }
            });
        }
    });

    exports.PlaceholderView = PlaceholderView;

});