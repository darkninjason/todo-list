define(function(require, exports, module){

// Imports
var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

// TODO:
// Public API:
// addMarkerValue(pixel-value, whole-number)
// addMarkerPosition(percent)
// removeMarkerValue(pixel-value, whole-number)
// removeMarkerPosition(percent)
// addMarkersUsingElements($('.selector'))
// removeMarkersUsingElements($('.selector'))
// setScrollPosition()
// setScrollValue()
// getMarkers() // return array [{position, value}]
//
// These might be stupid
// removeMarker(index || object-ref)
//
// Thoughts:
//
// Horizontal or Vertical?
//
// Call this VerticalScrollManager to match slider names?
//
// How to store markers?
//
// Waypoints supports element offsets which I think is useful
// - could change elements sig to use {el:$('selector') or 'string', offset:-10}
// ScrollTop can be a pain in the ass
// - We may want to create a 'special' element called 'top' (or perhaps a flag, useTop) which will
//   cause this component to go find the appropriate "scrollable" element.
// - Check out vizio for x-browser compaitble, jqurey based test for scrollTop.
//
// Flow:
// Like slider, range manager "change" should drive all updates.
// This should centralize code and make it easier to debug code paths
//
// - receives "scroll" event from scroll responder
//   - looks up scrollTop (or equiv) from registered element
//   - querys range manager for value for position
//   - calls _updateRangePosition to update range manager
//   - call to range manager causes change event
//   - check markers, dispatch marker event if one exists
//
// - user sets scroll position or value
//   - querys range manager for value for position, if value
//   - calls _updateRangePosition to update range manager
//   - call to RM caues change event
//   - do we check to see if we've passed any markers when setting scroll?
//   - if so, check to see which markers we've passed, fire events for all
//   - is scroll animated?

var ScrollManager = Marionette.Controller.extend({

    EVENT_MARKER: 'marker',

    scrollResponder: null,
    rangeManager: null,
    markers: [], // TODO: This will probably change

    _defaults: {
        el: null,
    },

    // Backbone & Marionette overrides

    initialize: function(options) {
        _.defaults(options, defaults);

        if(_.isEmpty(this.options.el)) {
            throw 'No input element provided.';
        }

        this.$el = helpers.getElement(this.options.el);

        this.scrollResponder = this._initializeScrollResponder(this.options);
        this.rangeManager    = this._initializeRangeManager(this.options);

    },

    onClose: function() {
        // do something here
    },

    // Initialization

    _initializeScrollResponder: function(options) {
        // init scroll responder
        return null;
    },

    _didReceiveScroll: function(responder, e) {
        // implement this
        // should set position in range manager?
    },

    _initializeRangeManager: function(options) {
        // init range manager
        return null;
    },

    _rangeManagerDidChange: function(sender, position, value) {
        // implement this
    },

    // This seems redundant, but a few functions will update the range
    // thought this might centralize calls.
    _updateRangePosition: function(position) {
        // this.rangeManager.setPosition(position);
    },

    // "Private" internal methods

    _addMarker: function(position) {
        // push marker into marker array
    },

    _addMarkerAt: function(index, position) {
        // insert marker into specificed index
        // arr = []
        // arr[2] = '0.8'
        // returns
        // [undefined, undefined, 0.8]
    },

    _removeMarkerAt: function(index) {
        // remove marker from marker array
    },

    _removeMarkerObjectRef: function(ref) {
        // index of object ref
        // call removeMarkerAt(index)
    },

    // Public API

    getMarkers: function() {
        // readonly
        // return whatever storage mechanism holding markers
        return null;
    },

    addMarkerPosition: function(position) {
        // call _addMarker(position)
    },

    removeMarkerPosition: function(position) {
        // index of position
        // call _removeMarkerAt(index)

        // TODO: potential here for more than one marker
        // to exist in list, need to revisit.
    },

    addMarkerValue: function(value) {
        // get marker position equivelant
        // call _addMarker
    },

    removeMarkerValue: function(value) {
        // get position for value
        // index of position
        // call _removeMarkerAt(index)
    },

    addMarkersUsingElements: function($els) {
        // each, get top for each element
        // get position for each top or left (for horizontal)
        // call _addMarker(position)
        //
        // TODO:
        // Do we track what elements have been added to reduce duplicate events?
        // An array may not be sufficient here.
    },

    removeMarkersUsingElements: function($els) {
        // each, get top for each element
        // get position for each top
        // call _removeMarker(position)
        //
        // TODO: I'm thinking an array isn't going to work here
        // if you pass in an element with the same position as
        // something you previous specified in addMarkerPosition
        // you may inadvertently remove that position.
        // Need to think this through later.
    },

    setScrollPosition: function(position) {
        // TODO: need good browser scrollTop if using window, html, or body.
        // set value in range manager
        // scroll top should be updated in range manager did change
    },

    setScrollValue: function(value) {
        // get position for value
        // call setScrollPosition
    },

    // Event dispatchers

    _dispatchMarker: function() {
        var position = this.rangeManager.getPosition();
        var value    = this.rangeManager.getValue();

        this.trigger(this.EVENT_MARKER, this, position, value);
    },

}); // eof ScrollManager

// Exports
module.exports = ScrollManager;

}); // eof define
