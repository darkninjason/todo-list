define(function(require, exports, module){

// Imports
var Backbone   = require('backbone');
var Marionette = require('marionette');
var _          = require('underscore');

var Helpers         = require('auf/utils/helpers');
var ScrollResponder = require('auf/ui/responders/scroll');
var RangeManager    = require('auf/ui/managers/range');

// Module

// TODO:
// - WindowResponder, resize event implementation. Compose here to get resize.

// - implement calculateMaxScroll
// - implement add markers for elements

// - setPosition|Value -> setPositions|Values that takes *args

// - Move markers funct to range or marked ranges

// - SmoothScroll, composes scroll manager

// - Forward a 'scroll' event that sends range position / value

// - Use _.uniq to filter out duplicate markers

var ScrollManager = Marionette.Controller.extend({

    EVENT_MARKER: 'marker',
    EVENT_CHANGE: 'change',

    scrollResponder: null,
    rangeManager   : null,
    scrollable     : null,

    markers          : [],
    prevPosition     : null,

    _defaults: {
        el     : null,
        smooth : false,
        markers: null
    },

    // Backbone & Marionette overrides

    /**
     * initialize the ScrollManager
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * var scrollManager = new ScrollManager(
     *     {
     *         el : $(window), // required, can be any element
     *     }
     * );
     */
    initialize: function(options) {
        _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.$el             = Helpers.getElement(this.options.el);
        this.scrollResponder = this._initializeScrollResponder(this.options);
        this.rangeManager    = this._initializeRangeManager(this.options);
    },

    onClose: function() {
        this.scrollResponder.close();
        this.rangeManager.close();
    },

    // Initialization

    _initializeScrollResponder: function(options) {
        return new ScrollResponder({
            el: options.el,
            scroll: _.bind(this._didReceiveScroll, this)
        });
    },

    _didReceiveScroll: function(responder, e) {
        var scroll, position;

        scroll = this._getElementScroll(this.$el);

        // TODO: Revisit - Horizontal will need update
        position = this.rangeManager.calculatePositionForValue(scroll.y);

        this._updateRangePosition(position);
    },

    _initializeRangeManager: function(options) {
        var manager, max, listener, scrollable, start;

        // TODO: Revisit - Horizontal will need upate.
        scrollable = this.getScrollable(this.$el);
        max        = scrollable.scrollHeight - scrollable.displayHeight;
        listener   = _.bind(this._rangeManagerDidChange, this);

        manager = new RangeManager({
            min: 0,
            max: max
        });

        this.listenTo(manager, 'change', listener);

        return manager;
    },

    _elementIsWindow: function($el) {
        return window === _.identity($el[0]);
    },

    _rangeManagerDidChange: function(sender, position, value) {
        var reached, iterator, direction, inBetween; //, tollerance, lower, upper;

        function down_iterator(marker, i, list) {
            inBetween = marker >= this.prevPosition && marker <= position;

            if(inBetween) {
                reached.push(marker);
            }
        }

        function up_iterator(marker, i, list) {
            inBetween = marker <= this.prevPosition && marker >= position;

            if(inBetween) {
                reached.unshift(marker);
            }
        }

        reached   = [];
        direction = (this.prevPosition < position) ? 'down' : 'up';
        iterator  = direction === 'down' ? down_iterator : up_iterator;

        // loop over all markers to see if we're in range
        _.each(this.markers, iterator, this);

        if(reached.length > 0) {
            this._dispatchMarker(reached, direction);
        }

        // finally update our local storage of position
        // used to calculate direction
        this.prevPosition = position;
    },

    // All updates to range manager position should route through here.
    _updateRangePosition: function(position) {
        this.rangeManager.setPosition(position);
    },

    // "Private" internal methods

    _sortArrayAscending: function(a, b) {
        // see: http://bit.ly/1c0cPTU
        return a - b;
    },

    // Public API

    getScrollable: function($el) {
        var el, bounds;

        // If the window was provided, use the
        // documenetElement, usually 'html', for dimensions.
        // TODO: Revisit - Not sure about mobile compat.
        $el = (this._elementIsWindow($el)) ? $(document.documentElement) : $el;
        el  = $el[0];

        // see: http://mzl.la/19VEUIo
        // for a guide to these properties
        return {
            height       : el.offsetHeight,
            width        : el.offsetHeight,
            displayHeight: el.clientHeight,
            displayWidth : el.clientWidth,
            scrollHeight : el.scrollHeight,
            scrollWidth  : el.scrollWidth
        };
    },

    getMarkers: function() {
        // return (shallow) copy of markers
        return this.markers.slice();
    },

    addMarkerPosition: function(position) {
        var markerExists;

        markerExists = _.indexOf(this.markers, position, true) != -1;

        if(markerExists) {
            return false;
        }

        this.markers.push(position);
        this.markers.sort(this._sortArrayAscending);

        return true;
    },

    removeMarkerPosition: function(position) {
        var markerIndex, markerDoesNotExist;

        markerIndex        = _.indexOf(this.markers, position);
        markerDoesNotExist = markerIndex == -1;

        if(markerDoesNotExist) {
            return false;
        }

        this.markers.splice(markerIndex, 1);
        this.markers.sort(this._sortArrayAscending);

        return true;
    },

    addMarkerValue: function(value) {
        position = this.rangeManager.calculatePositionForValue(value);
        return this.addMarkerPosition(position);
    },

    removeMarkerValue: function(value) {
        position = this.rangeManager.calculatePositionForValue(value);
        return this.removeMarkerPosition(position);
    },

    addMarkersUsingElements: function($els) {
        // should return dict with resulting markers for keys.
        console.log('addMarkersUsingElements not implemented', $els);
    },

    removeMarkersUsingElements: function($els) {
        // return dict with success / fail?
        console.log('removeMarkersUsingElements not implemented', $els);
    },

    // Event dispatchers

    _dispatchChange: function() {
        var position, value;

        position = this.rangeManager.getPosition();
        value    = this.rangeManager.getValue();

        this.trigger(this.EVENT_CHANGE, this, position, value);
    },

    _dispatchMarker: function(markers, direction) {
        var position, value;

        position = this.rangeManager.getPosition();
        value    = this.rangeManager.getValue();

        this.trigger(this.EVENT_MARKER, this, markers, direction);
    }

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
