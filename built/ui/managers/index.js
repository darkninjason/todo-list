define(function(require, exports, module){

// Imports

var marionette   = require('marionette');
var _            = require('underscore');
var RangeManager = require('built/ui/managers/range').RangeManager;

// Module

var IndexManager = marionette.Controller.extend({

    initialize: function(options){
        this.range = new RangeManager();
        this.setLength(options.length || 0);
    },

    setLength: function(value){
        this.range.setMax(value);
    },

    getLength: function(){
        return this.range.getMax();
    },

    setIndex: function(value){
        this.range.setValue(value);
    },

    getIndex: function(){
        return this.range.getValue();
    },

    previousIndex: function(){
        var nextIndex;
        var currentIndex = this.getIndex();

        nextIndex = currentIndex - 1;

        if(nextIndex < 0){
            nextIndex = this.getLength() - 1;
        }

        this.setIndex(nextIndex);
        return nextIndex;
    },

    nextIndex: function(){
        var nextIndex;
        var currentIndex = this.getIndex();

        nextIndex = currentIndex + 1;

        if(nextIndex > (this.getLength() - 1)){
            nextIndex = 0;
        }

        this.setIndex(nextIndex);
        return nextIndex;
    }
});

// Exports

module.exports.IndexManager = IndexManager;

});
