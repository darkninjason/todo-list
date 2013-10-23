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

    it('returns a list of markers for getMarkers', function(){
        var manager, positions;

        manager   = getManager();
        positions = [0, 0.25, 0.5, 0.75, 1];

        manager.addMarkerPositions.apply(manager, positions);

        expect(manager.getMarkers()).toEqual(positions);

        manager.close();
    });

    it('adds marker positions from elements', function(){
        var manager, $elements, markerElDict, expectedMarkers, markerValues;

        manager         = getManager();
        $elements       = getPageElements().$paragraphs;
        expectedMarkers = _.map($elements, function(el, i, $elements){
            var $el, top, range;

            $el   = $(el);
            top   = $el.position().top;
            range = manager.rangeManager;

            return range.calculatePositionForValue(top);
        });
        markerElDict = manager.addMarkersUsingElements($elements);
        markerValues = _.map(_.keys(markerElDict), parseFloat);

        expect(markerValues).toEqual(expectedMarkers);
        expect(manager.getMarkers()).toEqual(expectedMarkers);
    });

    it('removes marker positions from elements', function(){
        var manager, $elements;

        manager   = getManager();
        $elements = getPageElements().$paragraphs;

        manager.addMarkersUsingElements($elements);
        manager.removeMarkersUsingElements($elements);

        expect(manager.getMarkers()).toEqual([]);
    });

    xit('dispatches marker event when marker is reached', function(){
        // TODO: implement
    });

    xit('dispatches scroll for window', function(){
        var manager, spy;

        manager = getManager();
        // spy = jasmine.createSpy('spy');
        spy = function(){
            console.log('spy', arguments);
        };

        manager.on('scroll', spy);

        $('body')[0].scrollTop = 1000;


    });

    xit('dispatches scroll for element', function(){

    });


    xit('expects events to be removed', function(){
        // TODO: implement
    });



}); // eof describe
}); // eof define
