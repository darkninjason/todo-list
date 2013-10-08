define(function(require, exports, module){

// Imports

var Marionette     = require('marionette');
var _              = require('underscore');
var Collection     = require('auf/jquery/collection');
var helpers        = require('auf/utils/helpers');

// Module

var FocusManager =  Marionette.Controller.extend({

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
        this.focus($(e.target));
    },

    val: function(){
        return this.collection.toArray();
    },

    focusIndex: function(index){
        var $target = this.$el.eq(index);
        this.focus($target);
    },

    focus: function($el){
        var hasFocus = this.collection.contains($el);
        var shouldBlur = hasFocus && this.allowsDeselect;

        if(shouldBlur){
            this.blur($el);
            return;
        }

        if(!hasFocus){
            this.collection.add($el);
            this.trigger('focus', $el);
        }
    },

    blur: function($el){
        var hasFocus = this.collection.contains($el);

        if(hasFocus){
            this.collection.remove($el);
            this.trigger('blur', $el);
        }
    },

    // Marionette overrides

    onClose: function(){
        this.collection.reset();
        this.$el.off('click', this.wasClicked);
    }

}); // eof SelectionManager

// Exports

module.exports = FocusManager;

}); // eof define
