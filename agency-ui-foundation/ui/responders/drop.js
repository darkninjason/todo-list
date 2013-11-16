define(function(require, exports, module){

// Imports

var Marionette = require('marionette');
var _          = require('underscore');
var helpers    = require('auf/utils/helpers');

// Module
var DropResponder = Marionette.Controller.extend({

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
    operation: 'all',

    // Initialization
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this,
            '_dragOver', '_dragEnter', '_dragLeave', '_drop',
            'shouldAllowDrop');

        this.$el = helpers.registerElement(this.el);

        this.$el.on('dragenter.auf.responders.drop', {ctx: this}, this._dragEnter);
        this.$el.on('dragover.auf.responders.drop', {ctx: this}, this._dragOver);
        this.$el.on('dragleave.auf.responders.drop', {ctx: this}, this._dragLeave);
        this.$el.on('drop.auf.responders.drop', {ctx: this}, this._drop);

    },

    _dragEnter: function(e){
        this._updateMousePosition(e);

        if (!this.shouldAllowDrop(this, e)){
            return;
        }

        e.preventDefault();
        this.draggingEntered(this, e);
    },

    _dragOver: function(e){
        this._updateMousePosition(e);
        this.draggingUpdated(this, e);

        if (!this.shouldAllowDrop(this, e)){
            return;
        }

        e.preventDefault();
    },

    _dragLeave: function(e){
        this._updateMousePosition(e);
        this.draggingExited(this, e);
    },

    _drop: function(e){
        var originalEvent = e.originalEvent;
        var dataTransfer = originalEvent.dataTransfer;
        e.preventDefault();

        this._setData(dataTransfer.getData(this.dataType));
        this.performDragOperation(this, e);
    },

    _updateMousePosition: function (e){
        var bounds = helpers.getElementBounds(this.$el);

        var positionX = e.originalEvent.pageX - bounds.left;
        var positionY = e.originalEvent.pageY - bounds.top;

        this._setMousePosition(positionX, positionY);
    },

    shouldAllowDrop: function(responder, e){
        var originalEvent = e.originalEvent;
        var dataTransfer = originalEvent.dataTransfer;


        //event.dataTransfer.dropEffect = "copy";
        var result = false;

        if (this.operation != 'all' &&
            dataTransfer.effectAllowed != this.operation){
            return result;
        }

        if(_.isArray(this.dataType)){
            _.each(this.dataType, function(each){
                var index = _.indexOf(dataTransfer.types, each);

                if(index !== -1){
                    result = true;
                }
            });

        } else {
            var index = _.indexOf(dataTransfer.types, this.dataType);
            if(index !== -1){
                result = true;
            }
        }

        return result;
    },

    _setMousePosition: function(x, y){
        this._position = {x: x, y: y};
    },

    getMousePosition: function(){
        return this._position;
    },

    _setData: function(data){
        this._data = data;
    },

    getData: function(){
        return this._data;
    },

    draggingEntered: function(responder, e){},
    draggingUpdated: function(responder, e){},
    draggingExited: function(responder, e){},
    performDragOperation: function(responder, e){},

    // Marionette overrides

    onClose: function(){
        this.$el.off('dragenter.auf.responders.drop', this._dragEnter);
        this.$el.off('dragover.auf.responders.drop', this._dragOver);
        this.$el.off('dragleave.auf.responders.drop', this._dragLeave);
    }

}); // eof DropResponder

// Exports

exports.DropResponder = DropResponder;

}); // eof define