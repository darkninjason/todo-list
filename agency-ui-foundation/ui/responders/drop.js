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

        if(!this.el) throw 'No input element provided.';
        this.$el = helpers.getElement(this.el);

        this.$el.on('dragenter.auf.responders.drop', {ctx: this}, this._dragEnter);
        this.$el.on('dragover.auf.responders.drop', {ctx: this}, this._dragOver);
        this.$el.on('dragleave.auf.responders.drop', {ctx: this}, this._dragLeave);
        this.$el.on('drop.auf.responders.drop', {ctx: this}, this._drop);

    },

    _getElementBounds: function($el) {
        // el is raw dom element
        // returns ClientRect: {'bottom', 'height', 'left', 'right', 'top', 'width'}
        return $el[0].getBoundingClientRect();
    },

    _dragEnter: function(e){
        if (!this.shouldAllowDrop(this, e)){
            return;
        }

        var bounds = helpers.getElementBounds(this.$el);
        // this._startX = bounds.left;
        // this._startY = bounds.top;


        this._startX = e.originalEvent.pageX;
        this._startY = e.originalEvent.pageY;

        this.draggingEntered(this.$el);
    },

    _dragOver: function(e){
        if (!this.shouldAllowDrop(this, e)){
            return;
        }

        var bounds = helpers.getElementBounds(this.$el);
        this._endX = e.originalEvent.pageX;
        this._endY = e.originalEvent.pageY;

        //console.log(this.deltaX(), this.deltaY());
        //console.log(this._endX, this._endY);

        e.preventDefault();
        this.draggingUpdated(this.$el);
    },

    _dragLeave: function(e){
        if(e.target == this.$el[0]){
            this.draggingExited(this.$el);
            return;
        }

        console.log(e.target);
    },

    _drop: function(e){
        var originalEvent = e.originalEvent;
        var dataTransfer = originalEvent.dataTransfer;
        e.preventDefault();

        this.performDragOperation(
            this.$el,
            this.dataType,
            dataTransfer.getData(this.dataType));
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

    deltaX: function(){

        return this._endX - this._startX;
    },

    deltaY: function(){
        return this._endY - this._startY;
    },

    draggingUpdated: function($el){},
    draggingEntered: function($el){},
    draggingExited: function($el){},
    performDragOperation: function($el, dataType, data){},

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
