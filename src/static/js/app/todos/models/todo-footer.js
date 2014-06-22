define(function(require, exports, module) {

	var backbone = require('backbone');

	var TodoFooter = backbone.Model.extend({
		defaults: {
	    	itemsLeft: 0
	    }
	});

	exports.TodoFooter = TodoFooter;	

});