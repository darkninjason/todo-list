define(function(require, exports, module){

// Imports
var _          = require('underscore');

var getElement = function(value){
    var $el;

    if(_.isString(value)){
        $el = $(value);
    } else {
        $el = value;
    }

    return $el;
};


// Exports

module.exports.getElement = getElement;

});
