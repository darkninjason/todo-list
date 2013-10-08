define(function(require, exports, module){

// Imports

var Marionette       = require('marionette');
var _                = require('underscore');
var SelectionManager = require('auf/ui/managers/selection');
var helpers          = require('auf/utils/helpers');

// Module

var SingleSelectionManager = Marionette.Controller.extend({

    // Object vars

    selectionManager: null,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        this.$el = helpers.getElement(this.el);

        if(!this.selectionManager){
            this.selectionManager = new SelectionManager({
                el: this.$el,
                allowsDeselect: options.allowsDeselect});
        }

        this.listenTo(this.selectionManager, 'select', this.selectionManagerDidSelect);
        this.listenTo(this.selectionManager, 'deselect', this.selectionManagerDidDeselect);
    },

    val: function(){
        return this.selectionManager.val()[0];
    },

    selectIndex: function(value){
        this.selectionManager.selectIndex(value);
    },

    selectionManagerDidSelect: function($el){
        this.trigger('select', $el);

        // Selection manager pushes items into the collection.
        // the item at position 0 will be the last element selected.
        var selectionManager = this.selectionManager;

        if(selectionManager.collection.length > 1){
            selectionManager.deselect(selectionManager.collection.at(0));
        }
    },

    selectionManagerDidDeselect: function($el){
        this.trigger('deselect', $el);
    },

    // Marionette overrides

    onClose: function(){
        this.selectionManager.close();
    }
});

// Exports

module.exports = SingleSelectionManager;

}); // eof define
