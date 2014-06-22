define(function(require, exports, module) {

	var Todo       = require('app/todos/models/todo').Todo;
	var backbone = require('backbone');

	var TodoList = backbone.Collection.extend({
        model: Todo,

        addTodo: function(Todo) {
        	this.push(Todo);
        }
    });

    exports.TodoList = TodoList; 

});
