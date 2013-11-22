define(function (require, exports, module) {

var marionette = require('marionette');

var DragDropList = require('built/core/controls/dragdrop/list').DragDropList;
var getElementId = require('built/core/utils/helpers').getElementId;
var dndutils = require('built/core/utils/dndutils');

var Locations = require('../collections').Locations;
var DragItemView = require('./drag-item').DragItemView;




var DragAndDropCollectionView = marionette.CollectionView.extend({
    tagName:'ul',
    className:'list-group',
    itemView: DragItemView,
    ui : {

    },
    events : {

    },

    initialize: function(){
        this.collection = new Locations([
            {label:'old blitz'},
            {label:'blitz'    },
            {label:'new blitz'}]
        );
        _.bindAll(this,
                'getDragImage',
                'getDragDataForElement',
                'renderPlaceholderForData',
                'dropResponderPerformDragOperation',
                'draggingEndedRestoreElementAtPosition');
        this.dragDropList = new DragDropList({
            getDragImage: this.getDragImage,
            getDragDataForElement: this.getDragDataForElement,
            renderPlaceholderForData: this.renderPlaceholderForData,
            dropResponderPerformDragOperation: this.dropResponderPerformDragOperation,
            draggingEndedRestoreElementAtPosition: this.draggingEndedRestoreElementAtPosition
        });

        this.dragDropList.setDropElement(this.$el);
        this.on("after:item:added", this._onViewAdded);
    },

    _onViewAdded: function(view){
        this.dragDropList.insertDragElement(view.model.get('position'), view.$el);
    },

    getViewForEl: function($el){
        return this.getViewForId(getElementId($el));
    },

    getViewForId: function(id){
        // todo redo this and build hash table when children are created
        var output;
        this.children.each(function(view){
            if(getElementId(view.$el) == id){
                output = view;
            }
        });
        return output;
    },

    getDragImage: function(){
        // to be used, this must return a value in the form of:
        // {
        //   image: {{ the Image }},
        //   xOffset: {{ the X Offset Value }},
        //   yOffset: {{ the Y Offset Value }}
        // }
        //
        // See: https://developer.mozilla.org/en-US/docs/DragDrop/Drag_Operations#dragfeedback
        // for more details on creating this image.
        // OR you can do something like this:
        //
        // See: http://www.html5rocks.com/en/tutorials/dnd/basics/#toc-drag-properties
        // var dragIcon = document.createElement('img');
        // dragIcon.src = 'logo.png';
        // dragIcon.width = 100;
        // return {image: dragIcon };

        var $src = $('#drag-icon');
        var icon = document.createElement('img');
        icon.src = $src.attr('src');
        icon.width = $src.attr('width');
        icon.height = $src.attr('height');

        //return false;
        return {
            image: icon,
            offsetX: 5,
            offsetY: 18
        };
    },

    getDragDataForElement: function($el){
        var view = this.getViewForEl($el);
        var model = view.model;
        this.collection.remove(model,{silent:true});
        return this.serializeModel(model);
    },

    serializeModel: function(model){
        return JSON.stringify(model.toJSON());
    },

    deserializeModel: function(data){
        return $.parseJSON(data);
    },

    dropResponderPerformDragOperation: function(responder, e){
        var model = this.deserializeModel(responder.getData());
        var position = this.dragDropList._placeholderIndex;
        model.position = position;
        this.collection.add(model,{at:position});
    },

    draggingEndedRestoreElementAtPosition: function(position, $el){
        var model = this.getViewForEl($el).model.toJSON();
        model.position = position;
        this.collection.add(model,{at:position});
    },

    renderPlaceholderForData: function(data){
        // var model = this.deserializeModel(data);
        return $('<a class="list-group-item"> --> HERE <--</a>');
    }
});

exports.DragAndDropCollectionView = DragAndDropCollectionView;

});
