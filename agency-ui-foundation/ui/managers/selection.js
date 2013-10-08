define(function(require, exports, module){

// Imports

var Marionette     = require('marionette');
var _              = require('underscore');
var Collection     = require('auf/jquery/collection');
var helpers        = require('auf/utils/helpers');

// Module

var SelectionManager =  Marionette.Controller.extend({

    // Object vars
    allowsDeselect: false,

    // Initialization

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, 'wasClicked');

        if(!this.el) return;
        this.$el = helpers.getElement(this.el);

        this.$el.on('click', this.wasClicked);
        this.collection = new Collection();
    },

    wasClicked: function(e){
        this.select($(e.target));
    },

    val: function(){
        return this.collection.toArray();
    },

    selectIndex: function(index){
        var $target = this.$el.eq(index);
        this.select($target);
    },

    select: function($el){
        var isSelected = this.collection.contains($el);
        var shouldDeselect = isSelected && this.allowsDeselect;

        if(shouldDeselect){
            this.deselect($el);
            return;
        }

        if(!isSelected){
            this.collection.add($el);
            this.trigger('select', $el);
        }
    },

    deselect: function($el){
        var isSelected = this.collection.contains($el);

        if(isSelected){
            this.collection.remove($el);
            this.trigger('deselect', $el);
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
