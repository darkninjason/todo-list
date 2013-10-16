define(function(require, exports, module) {

// Imports

var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollManager = require('auf/ui/managers/scroll');

describe('Scroll Manager', function() {

    // Setup

    beforeEach(function() {
        loadFixtures('manager-scroll.html');
    });

    afterEach(function() {

    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el: $(window)
        };

        return _.exend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new ScrollManager(getOptions(augments));
    }

    function getPageElements(){
        // TODO: Stub
        return {
            container: $('.container')
        };
    }

    // Test Suite

    it('throws when no el is provided', function(){
        function throwable() {
            var manager = getManager({
                el: undefined
            });
        }

        expect(throwable).toThrow();
    });

}); // eof describe
}); // eof define
