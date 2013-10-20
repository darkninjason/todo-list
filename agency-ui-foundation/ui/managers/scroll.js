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
// - Move markers funct to range or marked ranges
// - SmoothScroll, composes scroll manager
// - Forward a 'scroll' event that sends range position / value

var ScrollManager = Marionette.Controller.extend({

    EVENT_MARKER: 'marker',
    EVENT_SCROLL: 'scroll',

    _defaults: null,

    scrollResponder: null,
    rangeManager   : null,
    scrollable     : null,

    // marker values should be unique
    // sort markers after adding a value
    markers       : null,
    lastDispatched: null,
    prevPosition  : null,

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
        this._defaults = {
            el: null
        };

        // apply defaults to options
        _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.markers         = [];
        this.lastDispatched  = [];
        this.$el             = Helpers.getElement(this.options.el);
        this.scrollResponder = this._initializeScrollResponder(this.options);
        this.rangeManager    = this._initializeRangeManager(this.options);

        // call this for initial max scroll setting
        this.calculateMaxScroll();

        // listen to range manager
        this.listenTo(
            this.rangeManager, 'change', _.bind(this._rangeManagerDidChange, this)
        );
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
        var scrollable, position;

        scrollable = this.getScrollable(this.$el);
        position   = this.rangeManager.calculatePositionForValue(
            scrollable.scrollTop
        );

        this._updateRangePosition(position);
    },

    _initializeRangeManager: function(options) {
        var manager, max, listener, scrollable, start;

        manager = new RangeManager();
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

        reached = _.difference(reached, this.lastDispatched);

        if(reached.length > 0) {
            this._dispatchMarker(reached, direction);
            this.lastDispatched = reached;
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
        var el, isWindow, documentElement, body, scrollTop, scrollLeft;

        isWindow        = this._elementIsWindow($el);
        documentElement = document.documentElement;
        body            = document.body;

        $el        = (isWindow) ? $(documentElement) : $el;
        el         = $el[0];

        // see: http://mzl.la/19SZOty
        // for detailed explanation of ternary test below
        //
        // essentially:
        // documentElement will sometimes return zero for scroll top,
        // even when the window is scrolled. If it does return zero,
        // check the body for it's scroll top. This technique should
        // always return a value equal to the what window's pageYOffset
        // would have been should pageYOffset be unsupported.
        scrollTop  = (isWindow) ? (window.pageYOffset || documentElement.scrollTop  || body.scrollTop ) : el.scrollTop;
        scrollLeft = (isWindow) ? (window.pageXOffset || documentElement.scrollLeft || body.scrollLeft) : el.scrollLeft;

        // see: http://mzl.la/19VEUIo
        // for a guide to these properties
        return {
            height       : el.offsetHeight,
            width        : el.offsetHeight,
            displayHeight: el.clientHeight,
            displayWidth : el.clientWidth,
            scrollHeight : el.scrollHeight,
            scrollWidth  : el.scrollWidth,
            scrollTop    : scrollTop,
            scrollLeft   : scrollLeft
        };
    },

    getMarkers: function() {
        // return (shallow) copy of markers
        return this.markers.slice();
    },

    calculateMaxScroll: function() {
        var scrollable, max;

        scrollable = this.getScrollable(this.$el);
        max = scrollable.scrollHeight - scrollable.displayHeight;

        this.rangeManager.setMax(max);
    },

    /**
     * add positions (values between 0 and 1) to the markers array
     * @param {arguments} __args__ position arguments
     *
     * @usage addMarkerPositions([*positions])
     * @example addMerkerPositions(0.1, 0.2, 0.3)
     */
    addMarkerPositions: function(__args__) {
        // __args__ is there to denote that this function takes 'arguments'
        // if you're familiar with python it's inspired by *args.
        // unfortunately, * is not a legal character for function args in js.
        // I added it to make the signature more explicit
        var sorted;

        function iterator(position, i, list) {
            if(position < 0 || position > 1) {
                throw 'Position out of range. Valid positions are between 0 and 1, position: ' + position;
            }

            this.markers.push(position);
        }

        sorted = true;

        // add positions to this.markers
        _.each(arguments, iterator, this);

        this.markers.sort(this._sortArrayAscending);
        this.markers = _.uniq(this.markers, sorted);
    },

    removeMarkerPositions: function(__args__) {
        var markerIndex;

        function iterator(arg, i, list) {
            markerIndex = _.indexOf(this.markers, arg);

            if(markerIndex == -1) {
                return;
            }

            this.markers.splice(markerIndex, 1);
        }

        // attempt removal of requested positions
        // non-existing positions are ignored
        _.each(arguments, iterator, this);
    },

    addMarkerValues: function(__args__) {
        var positions;

        positions = _.map(
            arguments,
            this.rangeManager.calculatePositionForValue,
            this.rangeManager
        );

        this.addMarkerPositions.apply(this, positions);
    },

    removeMarkerValues: function(__args__) {
        var positions;

        positions = _.map(
            arguments,
            this.rangeManager.calculatePositionForValue,
            this.rangeManager
        );

        this.removeMarkerPositions.apply(this, positions);
    },

    /**
     * Add markers using the 'top' position of the elements
     * @param {jquery selector} $elements the elements to add markers for
     *
     * @returns {object} a reference dictionary, {position: $element}
     *
     * @notes
     * - This function WILL NOT add markers for element's who's top is
     *   greater than the max scroll.
     */
    addMarkersUsingElements: function($elements) {
        var $el, $position, dict, top, position, positions;

        function iterator(el, i, list) {
            $el = $(el);
            $position = $el.position();
            top = $position.top;

            if(top < this.rangeManager.getMax()) {
                position = this.rangeManager.calculatePositionForValue(top);

                dict[position+''] = $el;

                positions.push(position);
            }
        }

        positions = [];
        dict = {};

        _.each($elements, iterator, this);

        this.addMarkerPositions.apply(this, positions);

        return dict;
    },

    removeMarkersUsingElements: function($elements) {
        var $el, $position, top, position, positions;

        function iterator(el, i, list) {
            $el = $(el);
            $position = $el.position();
            top = $position.top;

            return this.rangeManager.calculatePositionForValue(top);
        }

        positions = _.map($elements, iterator, this);

        this.removeMarkerPositions.apply(this, positions);
    },

    // Event dispatchers

    _dispatchScroll: function() {
        var position, value;

        position = this.rangeManager.getPosition();
        value    = this.rangeManager.getValue();

        this.trigger(this.EVENT_SCROLL, this, position, value);
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
