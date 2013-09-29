define(function(require, exports, module){
    var Marionette = require('marionette'),
        _ = require('underscore');

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

    module.exports.IndexManager = IndexManager;
});
