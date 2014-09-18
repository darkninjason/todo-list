define(function(require, exports, module) {

	var backbone = require('backbone');

	var Todo = backbone.Model.extend({
	   defaults: {
	    title: 'Default task',
	    completed: false
	   },

	   toggleState: function(){
	   	// commenting out for unit testing
	    // this.save({completed: !this.get('completed')});

	    this.set('completed', !this.get('completed'));
	   }
	});

	exports.Todo = Todo;

});
