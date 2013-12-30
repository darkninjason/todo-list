define(function(require, exports, module) {

// Imports

var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollResponder = require('built/core/responders/scroll').ScrollResponder;

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

    it('debounces scroll calls', function(done) {
        var count     = 0;
        var scrollSpy = jasmine.createSpy('scrollSpy');

        var responder = getResponder({
            scrollDebounce: 150,
            scroll: scrollSpy
        });

        function action(){
            var deferred = $.Deferred();

            EventHelpers.simulateScrollEvent($(window));
            expect(scrollSpy.calls.count()).toEqual(0);

            var id = setInterval(function() {
                EventHelpers.simulateScrollEvent($(window));
                count++;

                if(count > 4) {
                    clearInterval(id);

                    // allow time for debounce to execute
                    setTimeout(function() {
                        deferred.resolve();
                    }, 200);
                }

            }, 100);

            return deferred.promise();
        }

        action().then(function(){
            expect(scrollSpy.calls.count()).toEqual(1);
            done();
        });

    });

}); // eof describe
}); // eof define
