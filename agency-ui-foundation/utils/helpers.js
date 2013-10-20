define(function(require, exports, module){

// Imports

var _ = require('underscore');

// Helper functions

var getElement = function(value){
    var $el;

    if(_.isString(value)){
        $el = $(value);
    } else {
        $el = value;
    }

    return $el;
};

// example:
// scope.func = _bind(origScope.func, origScope);
// compose(this, this.rangeManager, 'addMarkerPositions')
// compose(scope, orig, 'origFuncMember')

function compose (scope, orig, func) {
    scope[func] = _.bind(orig[func], orig);
}

function composeAll(scope, orig) {
    var args;

    function iterator(func, i, funcs) {
        compose(scope, orig, func);
    }

    funcs = Array.prototype.slice.call(arguments, 2);

    _.each(funcs, iterator);
}


// Exports

module.exports.getElement = getElement;
module.exports.compose    = compose;
module.exports.composeAll = composeAll;

});
