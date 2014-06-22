define(function(require, exports, module) {

	var backbone = require('backbone');

	var Placeholder = backbone.Model.extend({
	   defaults: {
	    label: 'What needs to be done?'
	   },

	   toggleState: function(){
	    this.set('completed', !this.get('completed'));
	   },

	   addTodo: function(e){
	   	console.log('haa');
	   }
	});

	exports.Placeholder = Placeholder;
});
