define(function(require, exports, module) {

	var backbone = require('backbone');

	var Placeholder = backbone.Model.extend({
	   defaults: {
	   	label: 'What needs to be done?'
	   }
	});

	exports.Placeholder = Placeholder;
});
