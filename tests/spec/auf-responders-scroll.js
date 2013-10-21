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

    it('debounces scroll calls', function(){
        var responder, scroll, id, count;

        count = -1;
        scroll = jasmine.createSpy('scroll');
        responder = getResponder({
            scrollDebounce: 300,
            scroll: scroll
        });

        id = setInterval(function(){
            EventHelpers.simulateScrollEvent($(window));
            count++;

            if(count > 4) {
                clearInterval(id);
                // if debounce is working, scroll should have only
                // been called once.
                expect(scroll.calls.length).toEqual(1);
            }
        }, 200);
    });

}); // eof describe
}); // eof define
