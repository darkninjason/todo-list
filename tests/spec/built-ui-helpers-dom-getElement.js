define(function(require, exports, module) {

// Imports
var getElement = require('built/ui/helpers/dom').getElement;


describe('DOM Helpers: getElement', function() {


    // Set Up

    beforeEach(function() {
        loadFixtures('utils-helpers.html');
    });

    afterEach(function() {
    });

    it('expects $element for string', function() {
        var $el = getElement('#helper-target');
        expect($el instanceof $).toEqual(true);
    });

    it('expects $element for $element', function() {
        var $target = $('#helper-target');
        var $el = getElement($target);
        expect($el instanceof $).toEqual(true);
    });

    it('expects $element for string in $context', function() {
        var target = '#target';
        var $context = $('#context');
        var $el = getElement(target, $context);

        expect($el instanceof $).toEqual(true);
    });


}); // Eof describe
}); // Eof define




