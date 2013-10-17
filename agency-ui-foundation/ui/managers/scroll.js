define(function(require, exports, module){

// Imports
var Backbone   = require('backbone');
var Marionette = require('marionette');
var _          = require('underscore');

var Helpers         = require('auf/utils/helpers');
var ScrollResponder = require('auf/ui/responders/scroll');
var RangeManager    = require('auf/ui/managers/range');

// Module

var ScrollManager = Marionette.Controller.extend({

    EVENT_MARKER: 'marker',

    scrollResponder: null,
    rangeManager   : null,
    markers        : [],

    _defaults: {
        el: null,
        animates: false
    },

    // Backbone & Marionette overrides

    initialize: function(options) {
        _.defaults(options, defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.$el = Helpers.getElement(this.options.el);

        this.scrollResponder = this._initializeScrollResponder(this.options);
        this.rangeManager    = this._initializeRangeManager(this.options);
    },

    onClose: function() {
        // do something here
    },

    // Initialization

    _initializeScrollResponder: function(options) {
        return new ScrollResponder({
            el: options.el,
            scroll: _bind(this._didReceiveScroll, this)
        });
    },

    _didReceiveScroll: function(responder, e) {
        console.log('_didReceiveScroll not implemented');
        return;

        var scroll, position;

        scroll = this._getElementScroll(this.$el);

        // TODO: Revisit - Horizontal will need update
        position = this.rangeManager.getPositionForValue(scroll.x);
        this._updateRangePosition(position);
    },

    _initializeRangeManager: function(options) {
        var manager, max;

        max     = this._getElementBounds(this.$el);
        manager = new RangeManager({
            min: 0,
            max: max
        });

        this.listenTo(manager, _.bind(this._rangeManagerDidChange, this));

        return manager;
    },

    _getElementBounds: function($el) {
        // returns ClientRect: {'bottom', 'height', 'left', 'right', 'top', 'width'}
        // TODO: Simlar Code - see horzontal.js "_getElementBounds"
        // - May need to move this into utils?
        return $el[0].getBoundingClientRect();
    },

    _rangeManagerDidChange: function(sender, position, value) {
        console.log('_rangeManagerDidChange not implemented', position, value);
    },

    // All updates to range manager position should route through here.
    _updateRangePosition: function(position) {
        this.rangeManager.setPosition(position);
    },

    // "Private" internal methods

    _sortArrayAscending: function(arr) {
        // see: http://bit.ly/1c0cPTU
        arr.sort(function(a, b){
            return a - b;
        });
    },

    _getElementScroll: function($el) {
        var isWindow, el;

        el = $el[0];
        isWindow = window === _.identity(el);

        if(isWindow) {
            // TODO: Revisit - x-browser, ie8 does not support page[X|Y]Offset.
            // see: http://mzl.la/19SZOty
            return {
                x: el.pageXOffset,
                y: el.pageYOffset
            };

        }else{
            return {
                x: el.scrollLeft,
                y: el.scrollTop
            };
        }
    },

    _setElementScroll: function($el, x, y) {
        var isWindow, el;

        isWindow = window === _.identity($el[0]);

        if(isWindow) {
            // TODO: Revisit - x-browser compatiblity. (probably ie-hate)
            $el[0].scrollTo(x, y);
        }else{
            el = $el[0];

            el.scrollLeft = x;
            el.scrollTop  = y;
        }
    },

    // Public API

    getMarkers: function() {
        // return (shallow) copy of markers
        return this.markers.slice();
    },

    addMarker: function(position) {
        var markerExists;

        markerExists = _.indexOf(this.markers, position, true) != -1;

        if(markerExists) {
            return false;
        }

        markers.push(position);
        markers.sort(this._sortArrayAscending);

        return true;
    },

    removeMarker: function(position) {
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
        position = this.rangeManager.getPositionForValue(value);
        this.addMarker(position);
    },

    removeMarkerValue: function(value) {
        position = this.rangeManager.getPositionForValue(value);
        this.removeMarker(position);
    },

    addMarkersUsingElements: function($els) {
        console.log('addMarkersUsingElements not implemented', $els);
    },

    removeMarkersUsingElements: function($els) {
        console.log('removeMarkersUsingElements not implemented', $els);
    },

    setScrollPosition: function(position) {
        var value;

        value = this.rangeManager.getValueForPosition(position);
        setScrollValue(value);
    },

    getScrollPosition: function() {
        return this.rangeManager.position;
    },

    setScrollValue: function(value) {
        // TODO: Revisit - will need update for horizontal scroll
        this._setElementScroll(this.$el, 0, value);
    },

    getScrollValue: function() {
        return this.rangeManager.value;
    },

    // Event dispatchers

    _dispatchMarker: function() {
        var position, value;

        position = this.rangeManager.getPosition();
        value    = this.rangeManager.getValue();

        this.trigger(this.EVENT_MARKER, this, position, value);
    },

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
