define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers  = require('lib/spec-helpers').Events;
Scroller      = require('auf/ui/controls/page/scroller');

// Coverage
// not to animate when "basic" mode is set
// animates when "smooth" mode is set
// dispatches scroll
// debounces scroll
// dispatches marker
// events are removed

describe('Scroller', function() {

    // Setup

    beforeEach(function() {
    });

    afterEach(function() {
    });

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
        };

        return _.extend(testSuiteDefaults, augments);
    }
    function getControl(augments) {
        return new Scroller(getOptions(augments));
    }

    // Test Suite

    it('composes range and scroll api', function(){

    });

    it('does not animate when basic mode is set', function(){

    });

    it('animates when smooth mode is set', function(){

    });

    it('dispatches scroll', function(){

    });

    it('debounces scroll', function(){

    });

    it('dispatches marker', function(){

    });

}); // eof describe
}); // eof define
