define(function(require, exports, module){

// Imports

var Marionette       = require('marionette');
var _                = require('underscore');
var SelectionManager = require('auf/ui/managers/selection');
var helpers          = require('auf/utils/helpers');

// Module

var SingleSelectionManager = Marionette.ItemView.extend({

    // Object vars

    selectionManager: null,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        this.$el = helpers.getElement(this.el);

        if(!this.selectionManager){

            this.selectionManager = new SelectionManager({
                el: this.$el,
                allowsDeselect: true,
                delegate: options.delegate || this});
        }

        this.listenTo(this.selectionManager, 'before:select', this.selectionManagerBeforeSelect);
        this.listenTo(this.selectionManager, 'after:select', this.selectionManagerAfterSelect);
    },

    val: function(){
        return this.selectionManager.val();
    },

    selectIndex: function(value){
        this.selectionManager.selectIndex(value);
    },

    selectValue: function(value){
        this.selectionManager.selectValue(value);
    },

    selectionManagerBeforeSelect: function($el){
        var $selectedElement = this.selectionManager.$selectedElement;

        if($selectedElement &&  $el[0] != $selectedElement[0]){
            $selectedElement.removeClass(this.selectionManager.selectedClass);
        }

        this.trigger('before:select', $el);
    },

    selectionManagerAfterSelect: function($el){
        this.trigger('after:select', $el);
    },

    selectionManagerShouldSelect: function($el){

        var selectionManager = this.selectionManager;
        var $selectedElement = selectionManager.$selectedElement;

        if($selectedElement && $el[0] == $selectedElement[0]){
            if(selectionManager.allowsDeselect === false){
                return false;
            }
        }

        return true;
    },

    // Marionette overrides

    onClose: function(){
        this.selectionManager.close();
    }
});

// Exports

module.exports = SingleSelectionManager;

}); // eof define
