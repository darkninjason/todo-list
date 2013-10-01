define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');

// Module

var IndexManager = Marionette.Controller.extend({

    setLength: function(value){
        this.currentIndex = null;
        this.itemsLength = value;
    },

    setCurrentIndex: function(value){
        this.currentIndex = value;
    },

    updateCurrentIndexForPrevious: function(){
        var nextIndex,
            currentIndex = this.currentIndex;

        if (currentIndex === null){
            nextIndex = this.itemsLength - 1;
            this.setCurrentIndex(nextIndex);
            return nextIndex;
        }

        nextIndex = currentIndex - 1;

        if(nextIndex < 0){
            nextIndex = this.itemsLength - 1;
        }

        this.setCurrentIndex(nextIndex);
        return nextIndex;
    },

    updateCurrentIndexForNext: function(){
        var nextIndex,
            currentIndex = this.currentIndex;

        if (currentIndex === null){
            nextIndex = 0;
            this.setCurrentIndex(nextIndex);
            return nextIndex;
        }

        nextIndex = currentIndex + 1;

        if(nextIndex > (this.itemsLength - 1)){
            nextIndex = 0;
        }

        this.setCurrentIndex(nextIndex);
        return nextIndex;
    }
});

// Exports

module.exports = IndexManager;

});
