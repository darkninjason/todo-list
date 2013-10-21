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

/**
 * compose a function from one module to another and maintain original module scope.
 * @param  {object} intoScope the scope you wish to compose the method into
 * @param  {object} fromScope the scope you wish to retrieve the method from
 * @param  {string} func      the function name, as a string
 * @return {undefined}
 *
 * @example
 * compose(this, fooModule, 'fooModuleMethod');
 */
function compose (intoScope, fromScope, func) {
    intoScope[func] = _.bind(fromScope[func], fromScope);
}

/**
 * Identical to compose, but takes list of n-function names.
 * @param  {object} intoScope the scope you wish to compose the method into
 * @param  {object} fromScope the scope you wish to retrieve the method from
 * @return {undefined}
 *
 * @example
 * composeAll(
 *     this,
 *     fooModule,
 *     'fooModuleMethod1',
 *     'fooModuleMethod2',
 *     'fooModuleMethod3'
 * );
 */
function composeAll(intoScope, fromScope) {
    var args;

    function iterator(func, i, funcs) {
        compose(intoScope, fromScope, func);
    }

    funcs = Array.prototype.slice.call(arguments, 2);

    _.each(funcs, iterator);
}


// Exports

module.exports.getElement = getElement;
module.exports.compose    = compose;
module.exports.composeAll = composeAll;

});
