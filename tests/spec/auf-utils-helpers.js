define(function(require, exports, module) {

// Imports

var $       = require('jquery');
var helpers = require('auf/utils/helpers');


describe('Utils Helpers', function() {


    // Setup

    beforeEach(function() {
        loadFixtures('utils-helpers.html');
    });

    afterEach(function() {

    });

    // Test Suite

    it('expects $element for string', function(){

        var $el = helpers.getElement('#helper-target');
        expect($el instanceof $).toEqual(true);
    });

    it('expects $element for $element', function(){

        var $target = $('#helper-target');
        var $el = helpers.getElement($target);
        expect($el instanceof $).toEqual(true);
    });


}); // eof describe
}); // eof define
