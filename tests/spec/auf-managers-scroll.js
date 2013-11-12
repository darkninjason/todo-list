define(function(require, exports, module) {

// Imports

var _               = require('underscore');
var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollManager   = require('auf/ui/managers/scroll');

describe('Scroll Manager', function() {

    var manager = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-scroll.html');
    });

    afterEach(function() {
        $(window).scrollTop();

        if(!_.isEmpty(manager)) {
            manager.close();
            manager = null;
        }
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el: $(window)
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new ScrollManager(getOptions(augments));
    }

    function getPageElements(){
        return {
            $window: $(window),
            $body: $('body'),
            $container: $('.container'),
            $content: $('.content'),
            $paragraphs: $('p')
        };
    }

    function elementIsWindow($el) {
        return window === _.identity($el[0]);
    }

    // Test Suite

    it('throws when no el is provided', function(){
        function throwable() {
            manager = getManager({
                el: undefined
            });
        }

        expect(throwable).toThrow();
    });

    it('gets max scroll for window', function(){
        var elements, viewport, scrollable;

        elements   = getPageElements();
        manager    = getManager();
        viewport   = document.documentElement;
        scrollable = manager._getWindowScrollable()[0];
        max        = scrollable.scrollHeight - viewport.clientHeight;

        expect(manager.getMaxScrollValue()).toEqual(max);
    });

    it('gets max scroll for container', function(){
        var elements, viewport, scrollable, max;

        elements   = getPageElements();
        scrollable = elements.$container[0];
        max        = scrollable.scrollHeight - scrollable.clientHeight;
        manager    = getManager({
            el: elements.$container
        });

        expect(manager.getMaxScrollValue()).toEqual(max);
    });

    it('gets min scroll value for window', function(){
        expect(getManager().getMinScrollValue()).toEqual(0);
    });

    it('gets min scroll value for container', function(){
        expect(getManager({el:getPageElements().$container}).getMinScrollValue()).toEqual(0);
    });

    it('gets sets current scroll position for window', function(){
        var elements, viewport, scrollable, flag, max, expectedPosition;

        elements   = getPageElements();
        manager    = getManager();
        scrollable = manager._getWindowScrollable()[0];
        viewport   = document.documentElement;
        max        = scrollable.scrollHeight - viewport.clientHeight;

        // see note below about math.floor
        expectedPosition = manager.calculatePositionForValue(Math.floor(max*0.5));

        flag         = false;
        asyncTimeout = 50;

        function doesAsync() {
            // using set position here because set position proxy's in to
            // set value.
            manager.setScrollPosition(expectedPosition);

            setTimeout(function() {
                flag = true;
            }, asyncTimeout);
        }
        function waits(){
            return flag;
        }
        function expectsAsync() {
            expect(manager.getScrollPosition()).toEqual(expectedPosition);

            // Math.floor is used because scrollTop can only be whole pixels
            // Chrome, at least, seems to floor fractional scroll top values
            expect(manager.getScrollValue()).toEqual(Math.floor(max * 0.5));
        }

        // expect scroll position/value to start at 0
        expect(manager.getScrollPosition()).toEqual(0);
        expect(manager.getScrollValue()).toEqual(0);

        // jasmine async test
        // used here because i suspect jasmine is
        // unloading the fixture too soon, breaking test.
        runs(doesAsync);
        waitsFor(waits,'Scroll position and value should change', asyncTimeout + 50);
        runs(expectsAsync);
    });

    it('gets sets current scroll position for container', function(){
        var elements, viewport, scrollable, asyncTimeout, flag, max;

        elements   = getPageElements();
        manager    = getManager({el: elements.$container});
        scrollable = elements.$container[0];
        max        = scrollable.scrollHeight - scrollable.clientHeight;

        flag         = false;
        asyncTimeout = 100;

        expect(manager.getScrollPosition()).toEqual(0);
        expect(manager.getScrollValue()).toEqual(0);

        function doesAsync() {
            manager.setScrollPosition(0.5);
            setTimeout(function(){flag=true;}, asyncTimeout);
        }
        function waits(){
            return flag;
        }
        function doesExpects() {
            expect(manager.getScrollPosition()).toEqual(0.5);
            expect(manager.getScrollValue()).toEqual(max * 0.5);
        }

        // jasmine async test
        runs(doesAsync);
        waitsFor(waits,'Scroll position and value should change', asyncTimeout + 50);
        runs(doesExpects);
    });

    it('adds marker positions from elements', function(){
        var $elements, markerElDict, expectedMarkers, markerValues;

        manager         = getManager();
        $elements       = getPageElements().$paragraphs;
        expectedMarkers = _.map($elements, function(el, i, $elements){
            var $el, top;

            $el = $(el);
            top = $el.position().top;

            return manager.calculatePositionForValue(top);
        });
        markerElDict = manager.addMarkersUsingElements($elements);
        markerValues = _.map(_.keys(markerElDict), parseFloat);

        expect(markerValues).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('removes marker positions from elements', function(){
        var $elements;

        manager   = getManager();
        $elements = getPageElements().$paragraphs;

        manager.addMarkersUsingElements($elements);
        manager.removeMarkersUsingElements($elements);

        expect(manager.getMarkers()).toEqual([]);
    });

    it('dispatches markers for elements', function(){
        var spy, elements, asyncTimeout, flag;

        spy      = jasmine.createSpy('spy');
        elements = getPageElements();
        manager  = getManager({el: elements.$container});

        asyncTimeout = 100;
        flag         = false;

        function doesAsync() {
            setTimeout(function(){flag=true;}, asyncTimeout);
        }
        function waits() {
            return flag;
        }
        function doesExpects() {
            expect(spy).toHaveBeenCalled();
        }

        manager.addMarkersUsingElements(elements.$paragraphs);
        manager.on('marker', spy);

        manager.setScrollPosition(1);

        runs(doesAsync);
        waitsFor(waits, 'Marker should have fired', asyncTimeout + 50);
        runs(doesExpects);
    });

    it('dispatches scroll for window', function(){
        var spy;

        manager = getManager();
        spy     = jasmine.createSpy('spy');

        manager.on('scroll', spy);
        EventHelpers.simulateScrollEvent($(window), 0, 100);

        expect(spy.calls.length).toEqual(1);
    });

    it('dispatches scroll for element', function(){
        var spy, $container;

        manager    = getManager();
        spy        = jasmine.createSpy('spy');
        $container = getPageElements().$container;

        manager.on('scroll', spy);

        EventHelpers.simulateScrollEvent($container, 0, 100);

        expect(spy.calls.length).toEqual(1);
    });

}); // eof describe
}); // eof define
