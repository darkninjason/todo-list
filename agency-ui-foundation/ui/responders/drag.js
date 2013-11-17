define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');
var dnd    = require('auf/utils/dnd');

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
    supressChildPointerEvents: false,

    // Initialization
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_dragStart', '_dragEnd');

        this._managedElements = {};
        this.$el = helpers.getElement(this.el);
        this.reset(this.$el);
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

        //console.log('_dragEnd', e.originalEvent.dataTransfer.dropEffect);
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

    addElement: function($el){
        $el = helpers.registerElement($el);
        this._managedElements[$el.data('auf-id')] = $el[0];

        if(this.supressChildPointerEvents){
            dnd.supressChildPointerEvents($el);
        }

        $el.prop('draggable', true);
        $el.on('dragstart.auf.responders.drag', {ctx: this}, this._dragStart);
        $el.on('dragend.auf.responders.drag', {ctx: this}, this._dragEnd);
    },

    removeElement: function($el){

        if(!$el.data('auf-id')) throw 'Unable to remove unregistered AUF ' +
            'element. Did you register this element with ' +
            'helpers.registerElement?';

        delete this._managedElements[$el.data('auf-id')];

        if(this.supressChildPointerEvents){
            dnd.clearSupressedPointerEvents($el);
        }

        $el.prop('draggable', false);
        $el.off('dragstart.auf.responders.drag', this._dragStart);
        $el.off('dragend.auf.responders.drag', this._dragEnd);
    },

    reset: function($el){
        _.each(this._managedElements, function(value, key){
            this.removeElement($(value));
        }, this);

        if($el){
            _.each($el, function(each){
                this.addElement($(each));
            }, this);
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
        this.reset();
    }

}); // eof DropResponder

// Exports

exports.DragResponder = DragResponder;

}); // eof define
