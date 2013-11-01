define(function(require, exports, module){

// Imports
var _          = require('underscore');
var Backbone   = require('backbone');
var Marionette = require('marionette');

var Helpers         = require('auf/utils/helpers');
var ScrollResponder = require('auf/ui/responders/scroll');
var RangeManager    = require('auf/ui/managers/range');

// Module

var ScrollManager = Marionette.Controller.extend({

    EVENT_SCROLL: 'scroll',

    $scrollable: null,
    $viewport  : null,

    _defaults       : null,
    _scrollResponder: null,
    _rangeManager   : null,

    // Backbone & Marionette overrides

    /**
     * initialize the ScrollManager
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * var scrollManager = new ScrollManager(
     *     {
     *         el : $(window),     // required, can be any element or $element;
     *                               though window must be passed in as $(window)
     *         scrollDebounce: 0,  // optional, default 0, debounces calls to scroll listeners
     *     }
     * );
     */
    initialize: function(options) {
        this._defaults = {
            el: null,
            scrollDebounce: 0
        };

        // apply defaults to options
        this.options = _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.$el              = Helpers.getElement(this.options.el);
        this.$viewport        = this._initializeViewport(this.$el);
        this.$scrollable      = this._initializeScrollable(this.$el);
        this._scrollResponder = this._initializeScrollResponder(this.options);
        this._rangeManager    = this._initializeRangeManager(this.options);

        // compose range manager methods
        Helpers.composeAll(
            this,
            this._rangeManager,
            'getMarkers',
            'addMarkerPositions',
            'removeMarkerPositions',
            'addMarkerValues',
            'removeMarkerValues'
        );

        // call this for initial max scroll setting
        this.calculateMaxScroll();
    },

    onClose: function() {
        this._scrollResponder.close();
        this._rangeManager.close();
    },

    // Initialization

    _initializeViewport: function($el) {
        var isWindow;

        isWindow = window === _.identity($el[0]);
        $el = (isWindow) ? $(document.documentElement) : $el;
        return $el;
    },

    _initializeScrollable: function($el) {
        var isWindow;

        isWindow = window === _.identity($el[0]);
        $el = (isWindow) ? this._getWindowScrollable() : $el;
        return $el;
    },

    _getWindowScrollable: function() {
        var docElement, body, scrollables, scrollable, old;

        docElement  = document.documentElement;
        body        = document.body;
        scrollables = [docElement, body];

        // iterate over scrollable elements
        // setting scrollTop on an unsupported element should not update it's value
        // so do a check to see if the assignment actually changed the value
        // if it is, set scrollable to that element
        // reset value added by test
        //
        // see: http://mzl.la/19SZOty
        function iterator(el, i, scrollables) {
            old = el.scrollTop;
            el.scrollTop = el.scrollTop + 1;

            if(el.scrollTop > old) {
                scrollable   = el;
                el.scrollTop = old;
            }
        }

        _.each(scrollables, iterator, this);
        return $(scrollable);
    },

    _initializeScrollResponder: function(options) {
        return new ScrollResponder({
            el: options.el,
            scroll: _.bind(this._didReceiveScroll, this),
            scrollDebounce: options.scrollDebounce
        });
    },

    _didReceiveScroll: function(responder, e) {
        var scrollable, position;

        scrollable = this.$scrollable[0];

        position = this._rangeManager.calculatePositionForValue(
            scrollable.scrollTop
        );

        this._updateRangePosition(position);
    },

    _initializeRangeManager: function(options) {
        var manager, max, listener, scrollable, start;

        manager = new RangeManager();

        this.listenTo(manager, 'change', _.bind(this._dispatchScroll, this));
        this.listenTo(manager, 'marker', _.bind(this._dispatchMarker, this));

        return manager;
    },

    // Helpers

    _updateRangePosition: function(position) {
        // All updates to range manager position route through this func.
        this._rangeManager.setPosition(position);
    },

    _scrollElement: function($el, value) {
        $el[0].scrollTop = value;
    },

    // Public API

    calculateMaxScroll: function() {
        var viewport, scrollable, max;

        viewport   = this.$viewport[0];
        scrollable = this.$scrollable[0];

        // see: http://mzl.la/19VEUIo
        max = scrollable.scrollHeight - viewport.clientHeight;

        this._rangeManager.setMax(max);
    },

    getMaxScrollValue: function() {
        return this._rangeManager.getMax();
    },

    getScrollPosition: function() {
        return this._rangeManager.getPosition();
    },

    setScrollPosition: function(position) {
        var value;
        value = this._rangeManager.calculateValueForPosition(position);
        this.setScrollValue(value);
    },

    getScrollValue: function() {
        return this._rangeManager.getValue();
    },

    setScrollValue: function(value) {
        this._scrollElement(this.$scrollable, value);
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
            $el       = $(el);
            $position = $el.position();
            top       = $position.top;

            // Only add a marker that is less than range max.
            // This seems redundant, but this avoids a bunch of
            // mysterious markers at position 1 (range will squash any value
            // that results in a position > 1). I would rather avoid
            // adding these all together, than filtering them out later.
            shouldAddMarker = top < this._rangeManager.getMax();

            if(shouldAddMarker) {
                position            = this._rangeManager.calculatePositionForValue(top);
                dict[position + ''] = $el;

                positions.push(position);
            }
        }

        positions = [];
        dict      = {};

        // iterate over elements
        _.each($elements, iterator, this);

        this.addMarkerPositions.apply(this, positions);

        // This is a convenience return value that maps {markerPosition: $element}
        // I thought it would be useful information for the user.
        // example: {'0.1': $elementRef}
        return dict;
    },

    removeMarkersUsingElements: function($elements) {
        var $el, $position, top, position, positions;

        function iterator(el, i, list) {
            $el       = $(el);
            $position = $el.position();
            top       = $position.top;

            return this._rangeManager.calculatePositionForValue(top);
        }

        positions = _.map($elements, iterator, this);

        this.removeMarkerPositions.apply(this, positions);
    },

    // Event dispatchers

    _dispatchScroll: function(sender, position, value) {
        this.trigger(this.EVENT_SCROLL, this, position, value);
    },

    _dispatchMarker: function(sender, markers, direction) {
        this.trigger(this._rangeManager.EVENT_MARKER, this, markers, direction);
    }

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
