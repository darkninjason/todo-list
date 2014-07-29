define(function( require, exports, module ){

var backbone = require('backbone');
var Location = require('./models').Location;

var Locations =  backbone.Collection.extend({
    model: Location
});

exports.Locations = Locations;

});
