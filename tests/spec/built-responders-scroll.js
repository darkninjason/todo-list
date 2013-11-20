define(function(require, exports, module) {

// Imports

var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollResponder = require('built/ui/responders/scroll').ScrollResponder;

describe('Scroll Responder', function() {

    // Setup

    beforeEach(function() {
        loadFixtures('responder-scroll.html');
    });

    afterEach(function() {
        $(window).scrollTop();
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

    it('throws when no el is provided.', function() {
        function throwable() {
            var responder = getResponder({
                el: undefined
            });
        }

        expect(throwable).toThrow();
    });

    it('calls scroll on window', function() {
        var scroll, responder;

        scroll    = jasmine.createSpy('scroll');
        responder = getResponder({
            scroll: scroll
        });

        EventHelpers.simulateScrollEvent($(window));

        expect(scroll).toHaveBeenCalled();
    });

    it('calls scroll on element', function() {
        var scroll, $el, responder;

        scroll    = jasmine.createSpy('scroll');
        $el       = getPageElements().$container;
        responder = getResponder({
            el: $el,
            scroll: scroll
        });

        EventHelpers.simulateScrollEvent($el);
        expect(scroll).toHaveBeenCalled();
    });

    it('expects scroll to be removed', function() {
        var scroll, responder;

        scroll    = jasmine.createSpy('scroll');
        responder = getResponder({
            scroll: scroll
        });

        responder.close();

        EventHelpers.simulateScrollEvent($(window));
        expect(scroll).not.toHaveBeenCalled();
    });

    it('debounces scroll calls', function() {
        var responder, scrollSpy, id, count, flag;

        flag      = false;
        count     = 0;
        scrollSpy = jasmine.createSpy('scrollSpy');
        responder = getResponder({
            scrollDebounce: 150,
            scroll: scrollSpy
        });

        runs(function() {
            id = setInterval(function() {
                EventHelpers.simulateScrollEvent($(window));
                count++;

            if(count > 4) {
                clearInterval(id);

                // allow time for debounce to execute
                setTimeout(function() {
                    flag = true;
                }, 200);
            }

            }, 100);
        });

        waitsFor(function() {
            return flag;
        }, 'Timeout expired', 1000);

        runs(function() {
            expect(scrollSpy.calls.length).toEqual(1);
        });
    });

}); // eof describe
}); // eof define
