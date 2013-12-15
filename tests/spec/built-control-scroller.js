define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers  = require('lib/spec-helpers').Events;
Scroller      = require('built/core/controls/page/scroller').Scroller;
var events = require('built/core/events/event');

describe('Scroller', function() {

    var control = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-scroll.html');
    });

    afterEach(function() {
        $(window).scrollTop();

        if(!_.isEmpty(control)) {
            control.close();
            control = null;
        }
    });

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el:$(window),
            duration: 100
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getPageElements() {
        return {
            $window: $(window),
            $body: $('body'),
            $container: $('.container'),
            $content: $('.content'),
            $paragraphs: $('p'),
        };
    }

    function getControl(augments) {
        return new Scroller(getOptions(augments));
    }

    // Test Suite

    it('fires events after dom modified', function() {
        var elements, control, asyncTimeout, spy;

        spy      = jasmine.createSpy('spy');
        elements  = getPageElements();
        control   = getControl({el: elements.$container});

        control.addMarkerPositions(0.9);

        control.$el.scrollTop(800);
        control.$el.trigger('scroll');
        control.$el.append(control.$el.find('p').clone());
        control.calculateMaxScroll();
        control.on(events.MARKER, spy);
        control.$el.scrollTop(800);
        control.$el.trigger('scroll');
        expect(spy).not.toHaveBeenCalled();

    });

    xit('animates scroll when setting scroll value for window', function() {
        var elements, asyncTimeout, positions, flag;

        elements  = getPageElements();
        control   = getControl();
        positions = 0;

        asyncTimeout = 150;
        flag         = false;

        function scroll(sender, position, value) {
            positions += position;
        }
        function doesAsync() {
            control.setScrollPosition(1);

            setTimeout(function(){
                flag = true;
            }, asyncTimeout);
        }
        function waits() {
            return flag;
        }
        function doesExpects() {
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
        }

        control.on('scroll', scroll);

        runs(doesAsync);
        waitsFor(waits,'Scroll position/value should change', asyncTimeout + 50);
        runs(doesExpects);

    });

    xit('animates scroll when setting scroll value for container', function() {
        var elements, control, asyncTimeout, positions;

        elements  = getPageElements();
        control   = getControl({el: elements.$container});
        positions = 0;

        asyncTimeout = 200;
        flag         = false;

        function scroll(sender, position, value) {
            positions += position;
        }
        function doesAsync() {
            control.setScrollPosition(1);

            setTimeout(function(){
                flag = true;
            }, asyncTimeout);
        }
        function waits() {
            return flag;
        }
        function doesExpects() {
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
        }

        control.on('scroll', scroll);

        runs(doesAsync);
        waitsFor(waits,'Scroll position/value should change', asyncTimeout + 50);
        runs(doesExpects);
    });


    xit('animates scroll when setting scroll value for container', function() {
        var elements, control, asyncTimeout, positions;

        elements  = getPageElements();
        control   = getControl({el: elements.$container});
        positions = 0;

        asyncTimeout = 200;
        flag         = false;

        function scroll(sender, position, value) {
            positions += position;
        }
        function doesAsync() {
            control.setScrollPosition(1);

            setTimeout(function(){
                flag = true;
            }, asyncTimeout);
        }
        function waits() {
            return flag;
        }
        function doesExpects() {
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
        }

        control.on('scroll', scroll);

        runs(doesAsync);
        waitsFor(waits,'Scroll position/value should change', asyncTimeout + 50);
        runs(doesExpects);
    });



}); // eof describe
}); // eof define
