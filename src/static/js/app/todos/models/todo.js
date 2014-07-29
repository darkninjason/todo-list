define(function(require, exports, module) {

	var backbone = require('backbone');

	var Todo = backbone.Model.extend({
	   defaults: {
	    title: 'Default task',
	    completed: false,
	    order: 0
	   },

	   toggleState: function(){
	    this.save({completed: !this.get('completed')});
	   }
	});

	exports.Todo = Todo;

});
