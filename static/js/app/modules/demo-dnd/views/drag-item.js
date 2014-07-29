define(function (require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!tpl/dnd/drag-item');

var DragItemView = marionette.ItemView.extend({
    template : template,
    tagName:'li',
    className:'list-group-item',
    ui : {

    },
    events : {

    },
    initialize : function(){

    }
});

exports.DragItemView = DragItemView;

});
