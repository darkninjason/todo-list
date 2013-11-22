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
                'getDragImageForElement',
                'getDragDataForElement',
                'renderPlaceholderForElement',
                'dropResponderPerformDragOperation');
        this.dragDropList = new DragDropList({
            getDragImageForElement: this.getDragImageForElement,
            getDragDataForElement:this.getDragDataForElement,
            renderPlaceholderForElement:this.renderPlaceholderForElement,
            dropResponderPerformDragOperation:this.dropResponderPerformDragOperation
        });
        this.on("after:item:added", this.onViewAdded);
    },

    onShow : function(){
        this.dragDropList.setDropElement(this.$el);
    },

    onViewAdded: function(view){
        this.dragDropList.insertDragElement(view.model.get('position'),view.$el);
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

    getDragImageForElement: function($el){
        return false;
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

    renderPlaceholderForElement: function($el){
        return $('<a class="list-group-item"> --> HERE <--</a>');
    }
});

exports.DragAndDropCollectionView = DragAndDropCollectionView;

});
