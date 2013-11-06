define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers  = require('lib/spec-helpers').Events;
Scroller      = require('auf/ui/controls/page/scroller');

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

   it('animates scroll when setting scroll value', function(){

   });

   it('animates scroll when setting scroll position', function(){

   });

}); // eof describe
}); // eof define
