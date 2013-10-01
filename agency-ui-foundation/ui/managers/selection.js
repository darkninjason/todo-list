define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');

// Module

var SelectionManager =  Marionette.ItemView.extend({

    // Object vars

    selectedClass: null,
    delegate: null,
    $selectedElement: null,
    allowsDeselect: false,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, 'wasClicked');
        this.$el.on('click', this.wasClicked);

        this.selectedClass = options.selectedClass || 'selected';

        if (!this.delegate){
            this.delegate = {selectionManagerShouldSelect: function($el){ return true; }};
        }
    },

    wasClicked: function(e){
        this.selectElement($(e.target));
    },

    val: function(){
        if(this.$selectedElement){
            return this.getValueForElement(this.$selectedElement);
        }

        return null;
    },

    getValueForElement: function($el){
        return $el.data('select');
    },

    getElementWithValue: function(value){
        return this.$el.siblings('[data-select="' + value + '"]');
    },

    selectValue: function(value){
        var $el = this.getElementWithValue(value);
        this.selectElement($el);
    },

    selectIndex: function(index){
        var $target = $(this.$el[index]);
        this.selectElement($target);
    },

    selectElement: function($el){
        if(this.delegate.selectionManagerShouldSelect($el)){

            this.trigger('before:select', $el);
            if(this.$selectedElement &&
               $el[0] == this.$selectedElement[0] &&
               this.allowsDeselect){

                $el.removeClass(this.selectedClass);
                this.$selectedElement = null;

            } else {
                $el.addClass(this.selectedClass);
                this.$selectedElement = $el;
            }

            this.trigger('after:select', $el);
        }
    },

    // Marionette overrides

    onClose: function(){
        this.$el.off('click', this.wasClicked);
    }

}); // eof SelectionManager

// Exports

module.exports = SelectionManager;

}); // eof define
