define(function(require, exports, module) {

// Imports

var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollResponder = require('auf/ui/responders/scroll');

describe('Scroll Responder', function() {

    // Setup

    beforeEach(function() {
        loadFixtures('responder-scroll.html');
    });

    afterEach(function() {
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el: $(window),
            scroll: null
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getResponder(augments) {
        return new ScrollResponder(getOptions(augments));
    }

    function getPageElements() {
        return {
            $container: $('.container')
        };
    }

    // Test Suite

    it('throws when no el is provided.', function(){
        function throwable() {
            var responder = getResponder({
                el: undefined
            });
        }

        expect(throwable).toThrow();
    });

    it('calls scroll on window', function(){
        var scroll    = jasmine.createSpy('scroll');
        var responder = getResponder({
            scroll: scroll
        });

        EventHelpers.simulateScrollEvent($(window));

        expect(scroll).toHaveBeenCalled();
    });

    it('calls scroll on element', function(){
        var scroll    = jasmine.createSpy('scroll');
        var $el       = getPageElements().$container;
        var responder = getResponder({
            el: $el,
            scroll: scroll
        });

        EventHelpers.simulateScrollEvent($el);
        expect(scroll).toHaveBeenCalled();
    });

    it('expects scroll to be removed', function(){
        var scroll    = jasmine.createSpy('scroll');
        var responder = getResponder({
            scroll: scroll
        });

        responder.close();

        EventHelpers.simulateScrollEvent($(window));
        expect(scroll).not.toHaveBeenCalled();
    });

}); // eof describe
}); // eof define
