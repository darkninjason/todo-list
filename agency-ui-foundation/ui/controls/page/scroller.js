define(function(require, exports, module){
// Imports

var _ = require('underscore');
var Marionette = require('marionette');
var Helpers = require('auf/utils/helpers');
var ScrollManager = require('auf/ui/managers/scroll');

// Module

var Scroller = Marionette.Controller.extend({

    EASING_LINEAR: 'linear',
    EASING_SWING: 'swing',

    _rangeManager : null,
    _scrollManager: null,
    _defaults     : null,

    initialize: function(options) {
        this._defaults = {
            el: null,
            scrollDebounce: 0,
            smooth: true,
            duration: 300,
            easing: this.EASING_SWING
        };

        this.options = options;
        this.options = _.defaults(options, this._defaults);

        if(_.isEmpty(this.options.el)){
            throw 'No imput element provided.';
        }

        this.$el            = Helpers.getElement(this.options.el);
        this._scrollManager = this._initializeScrollManager(this.options);

        // add a local ref to this for convenience
        // removed in close
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
        this._rangeManager = null;
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
        console.log('_setSmoothScroll not implemented.', startPosition, endPosition, duration);

        // animate from startPosition to endPosition
        // each step calls _scrollManager's setScrollPosition

        function step(now, tween) {
            // console.log('step', arguments);
            this._scrollManager.setScrollPosition(now);
        }

        function complete() {
            // console.log('complete');
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

        console.log('setScrollPosition not implemented.', position);

        // check if smooth is enabled
        // true, _animateScroll(this._scrollManager.getPosition(), position);
        // else, call straight into this._scrollManager.setPosition(positin);

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

        console.log('setScrollValue not implemented.', value);

        // get position for value
        // call setScrollPosition(position)

        position = this._rangeManager.calculatePositionForValue(value);
        this.setScrollPosition(position);
    },

    // Event Dispatchers

    _dispatchScroll: function(sender, position, value) {
        console.log('_dispatchScroll not implemented.', sender, position, value);
    },

    _dispatchMarker: function(sender, markers, direction) {
        console.log('_dispatchMarker not implemented.', sender, markers, direction);
    },


}); // eof Scroller

// Exports
module.exports = Scroller;

}); // eof define
