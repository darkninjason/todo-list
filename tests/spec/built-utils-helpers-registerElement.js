define(function(require, exports, module) {

// Imports
var registerElement = require('built/core/utils/helpers').registerElement;
var getElementId = require('built/core/utils/helpers').getElementId;


describe('Core Helpers: registerElement', function() {


    // Set Up

    beforeEach(function() {
        loadFixtures('utils-helpers.html');
    });

    afterEach(function() {
    });

    it('expects registered element for $element', function() {
        var selector = '#helper-target';
        var $el = $(selector);

        expect(getElementId($el)).toEqual(undefined);

        $el = registerElement($el);
        expect(getElementId($el)).not.toEqual(undefined);
    });

    it('expects registered element for string', function() {
        var selector = '#helper-target';
        var $el = $(selector);

        expect(getElementId($el)).toEqual(undefined);

        $el = registerElement(selector);
        expect(getElementId($el)).not.toEqual(undefined);
    });

    it('expects registered elements for multiple targets', function() {
        var selector = '#helper-target';
        var $el = $(selector);

        $el.after($(
            '<div class="foo">Lucy</div>' +
            '<div class="foo">Ollie</div>' +
            '<div class="foo">Clark</div>'
            ));

        $targets = $('.foo');
        expect($targets.length).toEqual(3);

        expect(getElementId($targets.eq(0))).toEqual(undefined);
        expect(getElementId($targets.eq(1))).toEqual(undefined);
        expect(getElementId($targets.eq(2))).toEqual(undefined);

        $targets = registerElement($targets);

        expect(getElementId($targets.eq(0))).not.toEqual(undefined);
        expect(getElementId($targets.eq(1))).not.toEqual(undefined);
        expect(getElementId($targets.eq(2))).not.toEqual(undefined);
    });

    it('does not replace ID for previously registered element', function() {
        var selector = '#helper-target';
        var $el = $(selector);
        var builtId = getElementId($el);
        var testId;

        expect(builtId).toEqual(undefined);

        $el = registerElement($el);
        builtId = getElementId($el);

        expect(builtId).not.toEqual(undefined);

        // re-register the same element to ensure
        // the BUILT ID does not change.
        $el = registerElement($el);

        testId = getElementId($el);
        expect(builtId).toEqual(testId);
    });


}); // Eof describe
}); // Eof define




