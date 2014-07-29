define(function(require, exports, module) {

    var marionette = require('marionette'),
        templatePlaceholder = require('hbs!app/todos/templates/placeholder'),
        Todo = require('app/todos/models/todo').Todo;

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
                var todo = new Todo({title: this.ui.newTodo.val(), order: this.collection.length});
                this.collection.addTodo(todo);
                this.ui.newTodo.val('');
                todo.save();
            }
        },

        toggleAll: function(){
            if(this.collection.where({completed: true}).length === this.collection.length){
                this.uncompleteAll();
            } else {
                this.completeAll();
            }
        },

        completeAll: function(){

            this.collection.forEach(function(model){
                if(!model.get('completed')){
                    model.toggleState();
                }
            });
        },

        uncompleteAll: function(){

            this.collection.forEach(function(model){
                if(model.get('completed')){
                    model.toggleState();
                }
            });
        }
    });

    exports.PlaceholderView = PlaceholderView;

});