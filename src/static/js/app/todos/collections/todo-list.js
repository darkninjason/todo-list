define(function(require, exports, module) {

    var Todo     = require('app/todos/models/todo').Todo,
        backbone = require('backbone');

    var TodoList = backbone.Collection.extend({
        model: Todo,

        localStorage: new backbone.LocalStorage('Todos'),

        addTodo: function(Todo) {
        	this.push(Todo);
        }
    });

    exports.TodoList = TodoList; 

});
