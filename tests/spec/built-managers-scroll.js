define(function(require, exports, module) {

// Imports

var _               = require('underscore');
var $               = require('jquery');
var EventHelpers    = require('lib/spec-helpers').Events;
var ScrollManager   = require('built/core/managers/scroll').ScrollManager;
var events          = require('built/core/events/event');

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

    function getWindowViewportSize($el) {
        // copied from scroll manager internals
        var height, width, win, doc, docEl, body;

        // local refs
        win = $el[0];
        doc = $el[0].document;

        docEl = doc.documentElement;
        body = doc.getElementsByTagName('body')[0];
        width = win.innerWidth || docEl.clientWidth || body.clientWidth;
        height = win.innerHeight || docEl.clientHeight || body.clientHeight;

        return {width: width, height: height};
    }

    function getWindowScrollSize($el) {
        // copied from sroll manager internals
        var doc, docEl, width, height;

        doc = document;
        docEl = doc.documentElement;
        body = doc.body;

        width = Math.max(
            body.scrollWidth, docEl.scrollWidth,
            body.offsetWidth, docEl.offsetWidth,
            body.clientWidth, docEl.clientWidth
        );
        height = Math.max(
            body.scrollHeight, docEl.scrollHeight,
            body.offsetHeight, docEl.offsetHeight,
            body.clientHeight, docEl.clientHeight
        );

        return {width: width, height: height};
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
        var elements, manager, viewportSize, scrollSize, max;

        elements = getPageElements();
        manager  = getManager();
        viewportSize = getWindowViewportSize($(window));
        scrollSize = getWindowScrollSize($(window));
        max = scrollSize.height - viewportSize.height;

        expect(manager.getMaxScrollValue()).toEqual(max);
    });

    it('gets max scroll for container', function(){
        var elements, viewport, scrollable, max;

        elements   = getPageElements();
        scrollable = elements.$container[0];
        max        = scrollable.scrollHeight - scrollable.clientHeight;
        manager    = getManager({el: elements.$container});

        expect(manager.getMaxScrollValue()).toEqual(max);
    });

    it('properly recaculates max scroll', function(done){
        var elements = getPageElements();
        var content  = elements.$content;
        var asyncTimeout = 50;

        manager      = getManager({el: elements.$container});

        function action(){
            var deferred = $.Deferred();

            origMax = manager.getMaxScrollValue();
            manager.setScrollPosition(0.5);

            setTimeout(function() {
                origValue = manager.getScrollValue();

                content.append(content.find('p').clone());
                manager.calculateMaxScroll();

                newMax = manager.getMaxScrollValue();
                newValue = manager.getScrollValue();

                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }


        action().then(function(){
            // The content should be taller
            expect(origMax).toBeLessThan(newMax);

            // But the scroll position / value should not have changed
            expect(origValue).toEqual(newValue);
            done();
        });
    });

    it('gets min scroll value for window', function(){
        expect(getManager().getMinScrollValue()).toEqual(0);
    });

    it('gets min scroll value for container', function(){
        expect(getManager({el:getPageElements().$container}).getMinScrollValue()).toEqual(0);
    });

    it('gets sets current scroll position for window', function(done){
        var manager = getManager();
        var elements = getPageElements();
        var scrollable = manager._getWindowScrollable()[0];
        var viewportSize = getWindowViewportSize($(window));
        var scrollSize = getWindowScrollSize($(window));
        var max = scrollSize.height - viewportSize.height;
        var asyncTimeout = 50;

        // see note below about math.floor
        var expectedPosition = manager.calculatePositionForValue(Math.floor(max*0.5));

        function action(){
            var deferred = $.Deferred();

            manager.setScrollPosition(expectedPosition);

            setTimeout(function() {
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }

        expect(manager.getScrollPosition()).toEqual(0);
        expect(manager.getScrollValue()).toEqual(0);

        action().then(function(){
            expect(manager.getScrollPosition()).toEqual(expectedPosition);

            // Math.floor is used because scrollTop can only be whole pixels
            // Chrome, at least, seems to floor fractional scroll top values
            expect(manager.getScrollValue()).toEqual(Math.floor(max * 0.5));
            done();
        });
    });

    it('gets sets current scroll position for container', function(done){
        var elements     = getPageElements();
        var scrollable   = elements.$container[0];
        var max          = scrollable.scrollHeight - scrollable.clientHeight;
        var asyncTimeout = 100;

        manager          = getManager({el: elements.$container});

        function action(){
            var deferred = $.Deferred();

            manager.setScrollPosition(0.5);

            setTimeout(function(){
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }

        expect(manager.getScrollPosition()).toEqual(0);
        expect(manager.getScrollValue()).toEqual(0);

        action().then(function(){
            expect(manager.getScrollPosition()).toEqual(0.5);
            expect(manager.getScrollValue()).toEqual(max * 0.5);
            done();
        });
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

    it('dispatches markers for elements', function(done){
        var spy      = jasmine.createSpy('spy');
        var elements = getPageElements();
        var asyncTimeout = 100;

        manager      = getManager({el: elements.$container});

        function action(){
            var deferred = $.Deferred();

            setTimeout(function(){
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }

        manager.addMarkersUsingElements(elements.$paragraphs);
        manager.on(events.MARKER, spy);

        manager.setScrollPosition(1);

        action().then(function(){
            expect(spy).toHaveBeenCalled();
            done();
        });
    });

    it('dispatches scroll for window', function(){
        var spy;

        manager = getManager();
        spy     = jasmine.createSpy('spy');

        manager.on(events.SCROLL, spy);
        EventHelpers.simulateScrollEvent($(window), 0, 100);

        expect(spy.calls.count()).toEqual(1);
    });

    it('dispatches scroll for element', function(){
        var elements   = getPageElements();
        var spy        = jasmine.createSpy('spy');
        var $container = getPageElements().$container;

        manager        = getManager({el: elements.$container});

        manager.on(events.SCROLL, spy);
        EventHelpers.simulateScrollEvent($container, 0, 100);
        expect(spy.calls.count()).toEqual(1);
    });

}); // eof describe
}); // eof define
