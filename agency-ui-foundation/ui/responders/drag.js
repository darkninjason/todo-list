define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module

var DragResponder = Marionette.Controller.extend({

    // Object vars
    el: null,
    dataType: 'com.auf.generic',

    // operation can be one of:
    // -    'none'
    // -    'copy'
    // -    'move'
    // -    'link'
    // -    'copyMove'
    // -    'copyLink'
    // -    'linkMove'
    // -    'all'
    // Note that the drop target will check to confirm if it allows this.
    operation: 'all',

    // Initialization
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_dragStart', '_dragEnd');

        if(!this.el) throw 'No input element provided.';
        this.$el = helpers.getElement(this.el);

        this.$el.prop('draggable', true);
        this.$el.on('dragstart.auf.responders.drag', {ctx: this}, this._dragStart);
        this.$el.on('dragend.auf.responders.drag', {ctx: this}, this._dragEnd);
    },

    _dragStart: function(e){
        this.draggingConfiguration(this, e);
        var action = this.draggingStarted;

        _.defer(function($el){
            action($el);
        }, $(e.currentTarget));

    },

    _dragEnd: function(e){
        // e.originalEvent.dataTransfer.dropEffect
        // will be the 'none' if the drag operation was cancelled
        // aka, no drop was performed, otherwise it will represent
        // the action that took place. One of the following:
        // -    'copy'
        // -    'move'
        // -    'link'
        // -    'none'

        var $target = $(e.currentTarget);
        var dataTransfer = e.originalEvent.dataTransfer;
        this.draggingEnded($target, dataTransfer.dropEffect);
    },

    getData: function($el){
        // Should override this
        // One iss here is you are allowed to call setData on the
        // dataTransfer object multiple times. This implementation
        // omits that ability. The user could always implement
        // the draggingStarted call however and do their own thing.
        return '';
    },

    getDragImage: function($el){
        // to be used, this must return a value in the form of:
        // {
        //   image: {{ the Image }},
        //   xOffset: {{ the X Offset Value }},
        //   yOffset: {{ the Y Offset Value }}
        // }
        // See: https://developer.mozilla.org/en-US/docs/DragDrop/Drag_Operations#dragfeedback
        // for more details on creating this image.

        return false;
    },

    draggingConfiguration: function(responder, e){
        var $target = $(e.currentTarget);
        var originalEvent = e.originalEvent;
        var dataTransfer = originalEvent.dataTransfer;

        dataTransfer.effectAllowed = this.operation;

        dataTransfer.setData(
            this.dataType,
            this.getData($target)
        );

        var dragImage = this.getDragImage($target);

        if(dragImage){
            dataTransfer.setDragImage(
                dragImage.image,
                dragImage.xOffset,
                dragImage.yOffset);
        }
    },

    draggingStarted: function($el){ },
    draggingEnded: function($el, operation){
        // operation here will be one of:
        // -    'copy'
        // -    'move'
        // -    'link'
        // -    'none'
    },

    onClose: function(){
        this.$el.prop('draggable', false);
        this.$el.off('dragstart.auf.responders.drag', this._dragStart);
        this.$el.off('dragend.auf.responders.drag', this._dragEnd);
    }

}); // eof DropResponder

// Exports

exports.DragResponder = DragResponder;

}); // eof define
