define(function(require, exports, module) {
var helpers = require('built/ui/helpers/dom');
// Imports



describe('ui dom helpers', function() {


    // Set Up

    beforeEach(function() {
        loadFixtures('ui-helpers-option.html');
    });

    afterEach(function() {
    });

    // Helpers


    // Test Suite
    it('converts an option to an object', function(){
        var $element = $('option').eq(0);
        var output = helpers.objectFromElement($element);
        expect(output).toEqual({test: "talk", value: "fooval", content: "fooopt"});
    });

    it('converts option to object using map', function(){
        var $element = $('option').eq(0);
        var output = helpers.objectFromElement($element, {'content':'option'});
        expect(output).toEqual({test: "talk", value: "fooval", option: "fooopt"});
    });

    it('converts an option to a Model', function(){
        var $element = $('option').eq(0);
        var output = helpers.modelFromElement($element);
        var outputModel = new Backbone.Model({test: "talk", value: "fooval", content: "fooopt"});
        expect(output.toJSON()).toEqual(outputModel.toJSON());
    });

    it('converts option to Model using map', function(){
        var $element = $('option').eq(0);
        var output = helpers.modelFromElement($element, null, {'content':'option'});
        var outputModel = new Backbone.Model({test: "talk", value: "fooval", option: "fooopt"});
        expect(output.toJSON()).toEqual(outputModel.toJSON());
    });


}); // Eof describe
}); // Eof define




