define(function(require, exports, module){

// Imports

var _ = require('underscore');
var Marionette = require('marionette');
var Helpers = require('auf/utils/helpers');
var ScrollManager = require('auf/ui/managers/scroll');

// Module

var Scroller = Marionette.Controller.extend({

    MODE_SMOOTH: 'smooth',
    MODE_BASIC: 'basic',

    EASING_LINEAR: 'linear',
    EASING_SWING: 'swing',

    _rangeManager : null,
    _scrollManager: null,
    _defaults     : null,

    /**
     * initialize the Scroller
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * var scroller = new Scroller({
     *     el            : $(window),  // required, can be any element or $element;
     *                                    though window must be passed in as $(window)
     *     scrollDebounce: 0,          // optional, default 0, debounces calls to scroll listeners
     *     mode          : 'smooth',   // optional, default 'smooth', supports 'smooth' or 'basic'
     *     easing        : 'swing',    // optional, defulat 'swing', maps directly to default jquery easing
     *     duration      : 300,        // optional, default 300 (milliseconds), animation duration
     * });
     */
    initialize: function(options) {
        this._defaults = {
            el: null,
            scrollDebounce: 0,
            mode: this.MODE_SMOOTH,
            easing: this.EASING_SWING,
            duration: 300
        };

        // apply defaults to options
        this.options = _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)){
            throw 'No imput element provided.';
        }

        this.$el            = Helpers.getElement(this.options.el);
        this._scrollManager = this._initializeScrollManager(this.options);
        this._rangeManager  = this._scrollManager._rangeManager;

        // Proxy scroll manager methods
        Helpers.composeAll(
            this,
            this._scrollManager,
            'calculateMaxScroll',
            'getMaxScrollValue',
            'getScrollPosition',
            'getScrollValue',
            'addMarkersUsingElements',
            'removeMarkersUsingElements'
        );

        // Proxy scroll manger, range manager methods
        Helpers.composeAll(
            this,
            this._rangeManager,
            'getMarkers',
            'addMarkerPositions',
            'removeMarkerPositions',
            'addMarkerValues',
            'removeMarkerValues'
        );
    },

    onClose: function() {
        this._scrollManager.close();
    },

    // Initialization

    _initializeScrollManager: function(options) {
        var manager;

        manager = new ScrollManager({
            el: this.$el,
            scrollDebounce: this.options.scrollDebounce
        });

        // simply bubble events
        // this is necessary to make sure sender is correctly set
        this.listenTo(manager, 'scroll', _.bind(this._dispatchScroll, this));
        this.listenTo(manager, 'marker', _.bind(this._dispatchMarker, this));

        return manager;
    },

    // Private Methods

    _animateScroll: function(startPosition, endPosition, duration) {
        function step(now, tween) {
            this._scrollManager.setScrollPosition(now);
        }

        function complete() {
            // dispatch scroll complete?
        }

        $({position:startPosition}).animate(
            {position: endPosition },
            {
                duration: duration,
                step    : _.bind(step, this),
                complete: _.bind(complete, this)
            }
        );
    },

    // Public API

    setScrollPosition: function(position) {
        var startPosition, endPosition;

        if(this.options.smooth) {

            startPosition = this._scrollManager.getScrollPosition();
            endPosition   = Helpers.normalizeInt(position);

            this._animateScroll(
                startPosition, endPosition, this.options.duration
            );

            return;
        }

        this._scrollManager.setScrollPosition(position);
    },

    setScrollValue: function(value) {
        var position;

        position = this._rangeManager.calculatePositionForValue(value);

        this.setScrollPosition(position);
    },

    // Event Dispatchers

    _dispatchScroll: function(sender, position, value) {
        this.trigger(this._scrollManager.EVENT_SCROLL, this, position, value);
    },

    _dispatchMarker: function(sender, markers, direction) {
        this.trigger(this._rangeManager.EVENT_MARKER, this, markers, direction);
    }


}); // eof Scroller

// Exports
module.exports = Scroller;

}); // eof define
