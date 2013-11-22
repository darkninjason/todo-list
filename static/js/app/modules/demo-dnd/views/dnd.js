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
        this.initDragImage();
    },

    initDragImage: function(){
        this.icon = new Image();
        this.icon.src = 'static/img/dnd_blitz.png';
        this.icon.width = 140;
        this.icon.height = 40;
    },

    _onViewAdded: function(view){
        // this.dragDropList.insertDragElement(view.model.get('position'), view.$el);
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
        return {
            image: this.icon,
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
        this.dragDropList.removePlaceholder();
        this.collection.add(model,{at:position});
    },

    draggingEndedRestoreElementAtPosition: function(position, $el){
        var model = this.getViewForEl($el).model.toJSON();
        this.collection.add(model,{at:position});
    },

    renderPlaceholderForData: function(data){
        // var model = this.deserializeModel(data);
        return $('<a class="list-group-item"> --> HERE <--</a>');
    },

    appendHtml: function(collectionView, itemView, index){
        this.dragDropList.insertDragElement(index, itemView.$el);
    },
});

exports.DragAndDropCollectionView = DragAndDropCollectionView;

});
