define(function(require, exports, module) {
var modelFromElement = require('built/ui/helpers/dom').modelFromElement;
// Imports



describe('ui dom helpers', function() {


    // Set Up

    beforeEach(function() {
        loadFixtures('ui-helpers-option.html');
    });

    afterEach(function() {
    });

    // Helpers
    var $select = $('#jasmine-select');
    var $option = $select.find('option').eq(0);



    // Test Suite
    it('converts an option to a model', function(){

    });


}); // Eof describe
}); // Eof define




