define(function(require, exports, module) {

	var backbone = require('backbone');

	var Todo = backbone.Model.extend({
	   defaults: {
	    title: 'Default task',
	    completed: false
	   },

	   toggleState: function(){
	    this.save({completed: !this.get('completed')});
	   }
	});

	exports.Todo = Todo;

});
