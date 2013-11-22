define(function(require, exports, module){

var _ = require('underscore');
var marionette = require('marionette');
var dragEvents = require('built/core/events/drag');
var composeAll = require('built/core/utils/helpers').composeAll;

var Slider = marionette.Controller.extend({

    _backer: null,
    _uiUpdater: null,

    initialize: function(options){
        this.options = options;
        _.defaults(options, this._getDefaults());

        this._backer = this._initializeBacker(this.options);
        this._backer.compose(this);

        this._uiUpdater = this._initializeUiUpdater(this._backer.options);
    },

    onClose: function() {
        this._backer.close();
    },

    _getDefaults: function() {
        return {};
    },

    _initializeBacker: function(options) {
        var backer = options.backer;

        if(_.isEmpty(backer)) throw 'Undefined backer.';

        this.listenTo(backer, dragEvents.DRAG_UPDATE, this._dragDidUpdate);
        this.listenTo(backer, dragEvents.DRAG_START, this._dragDidStart);
        this.listenTo(backer, dragEvents.DRAG_END, this._dragDidEnd);

        backer.options.$container.css({
            position: 'relative'
        });

        backer.options.$track.css({
            position: 'relative'
        });

        backer.options.$handles.css({
            position: 'absolute',
            top: '0',
            left: '0'
        });

        return backer;
    },

    _initializeUiUpdater: function(options) {
        return options.snap ? this._updateUiWithSnap : this._updateUi;
    },

    _updateUi: function($handle, range, position, value) {
        $handle.css({'left': value + 'px'});
    },

    _updateUiWithSnap: function($handle, range, position, value) {
        var step, stepDelta;

        step = this._backer.getStepForHandle($handle);
        stepDelta = range.getMax() / this._backer.options.steps;

        // augment position and value
        value = stepDelta * step;

        // pass in augmented values to original update function
        this._updateUi($handle, range, position, value);
    },

    _dragDidUpdate: function(sender, $handle, range, position, value) {
        this._uiUpdater($handle, range, position, value);

        this._backer._dispatchDragUpdate.apply(this, arguments);
    },

    _dragDidStart: function(sender, $handle, range, position, value) {
        this._backer._dispatchDragStart.apply(this, arguments);
    },

    _dragDidEnd: function(sender, $handle, range, position, value) {
        this._backer._dispatchDragEnd.apply(this, arguments);
    }

}); // eof Slider

// Exports
module.exports.Slider = Slider;

}); // eof define
