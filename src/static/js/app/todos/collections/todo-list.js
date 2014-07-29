define(function(require, exports, module) {

    var Todo     = require('app/todos/models/todo').Todo,
        backbone = require('backbone');

    var TodoList = backbone.Collection.extend({
        model: Todo,

        comparator: 'order',

        localStorage: new backbone.LocalStorage('Todos'),

        addTodo: function(Todo) {
        	this.push(Todo);
        },

        save: function(){
            this.forEach(function(model, index){
                console.log(model);
                model.save({ order: index});
            });
        }
    });

    exports.TodoList = TodoList; 

});
