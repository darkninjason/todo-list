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
        // console.log('before', this.description);
    });

    afterEach(function() {

    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el: $(window),
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
            $paragraphs: $('p'),
        };
    }

    function elementIsWindow($el) {
        return window === _.identity($el[0]);
    }

    // Test Suite

    it('throws when no el is provided', function(){
        function throwable() {
            var manager = getManager({
                el: undefined
            });

            manager.close();
        }

        expect(throwable).toThrow();
    });

    it('adds marker positions from elements', function(){
        var manager, $elements, markerElDict, expectedMarkers, markerValues;

        manager         = getManager();
        $elements       = getPageElements().$paragraphs;
        expectedMarkers = _.map($elements, function(el, i, $elements){
            var $el, top, range;

            $el   = $(el);
            top   = $el.position().top;
            range = manager._rangeManager;

            return range.calculatePositionForValue(top);
        });
        markerElDict = manager.addMarkersUsingElements($elements);
        markerValues = _.map(_.keys(markerElDict), parseFloat);

        expect(markerValues).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);

        manager.close();
    });

    it('removes marker positions from elements', function(){
        var manager, $elements;

        manager   = getManager();
        $elements = getPageElements().$paragraphs;

        manager.addMarkersUsingElements($elements);
        manager.removeMarkersUsingElements($elements);

        expect(manager.getMarkers()).toEqual([]);

        manager.close();
    });

    it('dispatches scroll for window', function(){
        var manager, spy;

        manager = getManager();
        spy     = jasmine.createSpy('spy');

        manager.on('scroll', spy);
        EventHelpers.simulateScrollEvent($(window), 0, 100);

        expect(spy.calls.length).toEqual(1);

        manager.close();
    });

    // TODO: Revisit - Testing "scroll" from the fixture
    // is proving very difficult. The below code works when
    // done manually; but when done in the fixture it fails.
    it('dispatches scroll for element', function(){
        var manager, spy, $container;

        manager = getManager();
        spy = jasmine.createSpy('spy');
        $container = getPageElements().$container;

        manager.on('scroll', spy);

        EventHelpers.simulateScrollEvent($container, 0, 100);

        expect(spy.calls.length).toEqual(1);
    });


    xit('expects events to be removed', function(){
        // TODO: implement
    });



}); // eof describe
}); // eof define
