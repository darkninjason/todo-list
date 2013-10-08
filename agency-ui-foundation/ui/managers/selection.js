define(function(require, exports, module){

// Imports

var Marionette     = require('marionette');
var _              = require('underscore');
var Collection     = require('auf/jquery/collection');
var helpers        = require('auf/utils/helpers');

// Module

var SelectionManager =  Marionette.Controller.extend({

    // Object vars

    delegate: null,
    allowsDeselect: false,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, 'wasClicked');

        this.$el = helpers.getElement(this.el);
        this.$el.on('click', this.wasClicked);

        this.collection = new Collection();

        if (!this.delegate){
            this.delegate = {selectionManagerShouldSelect: function($el){ return true; }};
        }
    },

    wasClicked: function(e){
        this._selectElement($(e.target));
    },

    val: function(){
        if(this.collection.length){
            var getValueForElement = this.getValueForElement;

            return _.map(this.collection.toArray(), function(x){
                return getValueForElement(x);
            });
        }

        return [];
    },

    getValueForElement: function($el){
        return $el.data('select');
    },

    getElementWithValue: function(value){
        return this.$el.siblings('[data-select="' + value + '"]');
    },

    selectValue: function(value){
        var $el = this.getElementWithValue(value);
        this._selectElement($el);
    },

    selectIndex: function(index){
        var $target = $(this.$el[index]);
        this._selectElement($target);
    },

    _selectElement: function($el){
        if(this.delegate.selectionManagerShouldSelect($el)){

            this.trigger('before:select', $el);

            var shouldDeselect = this.collection.contains($el) &&
                                 this.allowsDeselect;

            if(shouldDeselect){

                this.collection.remove($el);
                this.trigger('deselect', $el);

            } else {
                this.collection.add($el);
                this.trigger('select', $el);
            }

            this.trigger('after:select', $el);
        }
    },

    // Marionette overrides

    onClose: function(){
        this.collection.reset();
        this.$el.off('click', this.wasClicked);
    }

}); // eof SelectionManager

// Exports

module.exports = SelectionManager;

}); // eof define
