define(function(require, exports, module) {

// Imports

var _               = require('underscore');
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
            el: $(window),
            markers: [0.25, 0.5, 0.75, 0.8856]
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new ScrollManager(getOptions(augments));
    }

    function getPageElements(){
        return {
            container: $('.container'),
            scrollOuter: $('.scroll-outer').eq(0),
            scrollInner: $('.scroll-inner').eq(0),
            scrollers: $('.scroll-outer')
        };
    }

    function elementIsWindow($el) {
        return window === _.identity($el[0]);
    }

    function getScrollable($el) {
        var bounds, viewableHeight, viewableWidth;

        $el = (elementIsWindow($el)) ? $(document.documentElement) : $el;

        bounds         = $el[0].getBoundingClientRect();
        viewableHeight = $el[0].clientHeight;
        viewableWidth  = $el[0].clientWidth;

        return {
            height: bounds.height,
            width : bounds.width,
            viewableHeight: viewableHeight,
            viewableWidth: viewableWidth,
            scrollHeight: bounds.height - viewableHeight,
            scrollWidth: bounds.width - viewableWidth
        };
    }

    // Test Suite

    xit('throws when no el is provided', function(){
        function throwable() {
            var manager = getManager({
                el: undefined
            });

            manager.close();
        }

        expect(throwable).toThrow();
    });

    xit('returns a list of markers for getMarkers', function(){
        var manager, opts;

        manager = getManager();
        opts    = getOptions();

        // expect manager getMarkers to return the markers we passed in
        expect(manager.getMarkers()).toEqual(opts.markers);

        manager.close();
    });

    xit('adds a marker position', function(){
        var manager;

        manager = getManager({'markers': []});

        manager.addMarkerPosition(0.5);
        manager.addMarkerPosition(0.75);
        manager.addMarkerPosition(0.25);

        // manager should return sorted array
        expect(manager.getMarkers()).toEqual([0.25, 0.5, 0.75]);

        manager.close()
    });

    xit('does not add an existing marker position', function(){
        var manager;

        manager = getManager({'markers': [0.5]});

        manager.addMarkerPosition(0.5);

        expect(manager.getMarkers()).toEqual([0.5]);

        manager.close()
    });

    xit('removes a marker position', function(){
        var manager, opts;

        manager = getManager();
        opts    = getOptions();
        expectedMarkers = opts.markers.slice();

        // manually remove 0.5 from this array
        expectedMarkers.splice(1, 1);

        manager.removeMarkerPosition(0.5);

        expect(manager.getMarkers()).toEqual(expectedMarkers);

        manager.close();
    });

    xit('does not remove a non-existing marker position', function(){
        var manager, opts;

        manager = getManager();
        opts = getOptions();

        manager.removeMarkerPosition(0.65);

        expect(manager.getMarkers()).toEqual(opts.markers);

        manager.close();
    });

    xit('adds a marker position for value', function(){
        var manager, scrollable;

        manager    = getManager({'markers': null});
        scrollable = getScrollable($(window)).scrollHeight;

        // add a marker at half the scrollable area
        manager.addMarkerValue(scrollable/2);

        // should result in a position at 0.5
        expect(manager.getMarkers()).toEqual([0.5]);

        manager.close();
    });

    xit('removes a marker position for value', function(){
        var manager, scrollable;

        manager = getManager({'markers': [0.5]});
        scrollable = getScrollable($(window)).scrollHeight;

        manager.removeMarkerValue(scrollable/2);

        expect(manager.getMarkers()).toEqual([]);

        manager.close();
    });

    xit('adds marker positions from elements', function(){
        var manager, $elements;

        manager   = getManager({'markers': null});
        $elements = getPageElements().scrollers;

        manager.addMarkersUsingElements($elements);
    });

    xit('removes marker positions from elements', function(){
        var manager, $elements;

        manager   = getManager({'markers': null});
        $elements = getPageElements().scrollers;

        manager.addMarkersUsingElements($elements);
        manager.removeMarkersUsingElements($elements);
    });

    xit('sets scroll when element is window', function(){
        var manager, scrollable;

        manager    = getManager();
        scrollable = getScrollable($(window));

        manager.setScrollPosition(0.5);
        manager.setScrollValue(scrollable * 0.75);
    });

    xit('sets scroll when element is dom element', function(){
        var $elements, manager, scrollable;

        $elements  = getPageElements();
        manager    = getManager({el: $elements.scrollOuter});
        scrollable = getScrollable($elements.scrollOuter);

        manager.setScrollPosition(0.5);
        manager.setScrollValue(scrollable * 0.75);
    });

    xit('gets scroll when element is window', function(){
        var manager, scrollPos, scrollValue;

        manager = getManager();

        manager.setScrollPosition(0.5);

        scrollPos   = manager.getScrollPosition();
        scrollValue = manager.getScrollValue();
    });

    xit('gets scroll when element is dom element', function(){
        var $elements, manager, scrollPos, scrollValue;

        $elements = getPageElements();
        manager   = getManager({el: $elements.scrollOuter});

        manager.setScrollPosition(0.5);

        scrollPos   = manager.getScrollPosition();
        scrollValue = manager.getScrollValue();
    });

    xit('dispatches marker event when marker is reached', function(){
        // TODO: implement
    });

    xit('expects events to be removed', function(){
        // TODO: implement
    });



}); // eof describe
}); // eof define
