define(function (require, exports, module) {

var DragAndDropCollectionView = require('built/ui/views/collection/drag-and-drop').DragAndDropCollectionView;
var DragAndDropCompositeView = require('built/ui/views/composite/drag-and-drop').DragAndDropCompositeView;

var template = require('hbs!tpl/dnd/dnd-composite');
var Locations = require('../collections').Locations;
var DragItemView = require('./drag-item').DragItemView;

var DragAndDropDemoView = DragAndDropCollectionView.extend({
    tagName:'ul',
    className:'list-group',
    itemView: DragItemView,
    initialize: function(){
        // always call super when implementing!
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);

        this.collection = new Locations([
            {label:'old blitz'},
            {label:'blitz'    },
            {label:'new blitz'}]
        );
        this.icon = new Image();
        this.icon.src = 'static/img/dnd_blitz.png';
        this.icon.width = 140;
        this.icon.height = 40;
    },

    getDragImage: function(){
        return {
            image: this.icon,
            offsetX: 5,
            offsetY: 18
        };
        // or if you want, you can:
        // return false
    },

    renderPlaceholderForData: function(data){
        return $('<a class="list-group-item active"></a>');
    }
});

var DragAndDropDemoCompositeView = DragAndDropCompositeView.extend({
    tagName:'ul',
    className:'list-group',
    itemViewContainer : '.list-group',
    template:template,
    itemView: DragItemView,
    initialize: function(){
        // always call super when implementing!
        DragAndDropCollectionView.prototype.initialize.apply(this, arguments);

        this.collection = new Locations([
            {label:'old blitz'},
            {label:'blitz'    },
            {label:'new blitz'}]
        );
        this.icon = new Image();
        this.icon.src = 'static/img/dnd_blitz.png';
        this.icon.width = 140;
        this.icon.height = 40;
    },

    getDragImage: function(){
        return {
            image: this.icon,
            offsetX: 5,
            offsetY: 18
        };
        // or if you want, you can:
        // return false
    },

    renderPlaceholderForData: function(data){
        return $('<a class="list-group-item active"></a>');
    }
});

exports.DragAndDropDemoView = DragAndDropDemoView;
exports.DragAndDropDemoCompositeView = DragAndDropDemoCompositeView;

});
