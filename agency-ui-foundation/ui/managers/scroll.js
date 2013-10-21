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
// - SmoothScroll, composes scroll manager

var ScrollManager = Marionette.Controller.extend({

    EVENT_SCROLL: 'scroll',

    _defaults: null,

    scrollResponder: null,
    rangeManager   : null,

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
            el: null,
            scrollDebounce: 0
        };

        // apply defaults to options
        _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.$el             = Helpers.getElement(this.options.el);
        this.scrollResponder = this._initializeScrollResponder(this.options);
        this.rangeManager    = this._initializeRangeManager(this.options);

        // call this for initial max scroll setting

        // compose range manager methods
        Helpers.composeAll(
            this,
            this.rangeManager,
            'getMarkers',
            'addMarkerPositions',
            'removeMarkerPositions',
            'addMarkerValues',
            'removeMarkerValues'
        );

        this.calculateMaxScroll();
    },

    onClose: function() {
        this.scrollResponder.close();
        this.rangeManager.close();
    },

    // Initialization

    _initializeScrollResponder: function(options) {
        return new ScrollResponder({
            el: options.el,
            scroll: _.bind(this._didReceiveScroll, this),
            scrollDebounce: options.scrollDebounce
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

        this.listenTo(manager, 'change', _.bind(this._dispatchScroll, this));
        this.listenTo(manager, 'marker', _.bind(this._dispatchMarker, this));

        return manager;
    },

    // Helpers

    _updateRangePosition: function(position) {
        // All updates to range manager position route through this func.
        this.rangeManager.setPosition(position);
    },

    _elementIsWindow: function($el) {
        return window === _.identity($el[0]);
    },

    // Public API

    getScrollable: function($el) {
        var el, isWindow, documentElement, body, scrollTop, scrollLeft;

        isWindow        = this._elementIsWindow($el);
        documentElement = document.documentElement;
        body            = document.body;

        $el = (isWindow) ? $(documentElement) : $el;
        el  = $el[0];

        // see: http://mzl.la/19SZOty
        // for detailed explanation of ternary test below
        //
        // essentially:
        // documentElement will sometimes return zero for scroll top,
        // even when the window was scrolled. If it does return zero,
        // we check the body for it's scroll top. This technique should
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

    calculateMaxScroll: function() {
        var scrollable, max;

        scrollable = this.getScrollable(this.$el);
        max = scrollable.scrollHeight - scrollable.displayHeight;

        this.rangeManager.setMax(max);
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

    _dispatchScroll: function(sender, position, value) {
        this.trigger(this.EVENT_SCROLL, this, position, value);
    },

    _dispatchMarker: function(sender, markers, direction) {
        this.trigger(this.rangeManager.EVENT_MARKER, this, markers, direction);
    }

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
