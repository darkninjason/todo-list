define(function(require, exports, module){

// Imports

//var marionette       = require('marionette');
//var _                = require('underscore');
var FocusManager     = require('auf/ui/managers/focus').FocusManager;
//var helpers          = require('auf/utils/helpers');

// Module

var SingleFocusManager = FocusManager.extend({

    getFocusedIndex: function(){
        var index = -1;

        var obj = this._focusedObjects[0];
        if(obj){
            index = this._list.indexOf(obj);
        }

        return index;
    },

    getFocusedObject: function(){
        return this._focusedObjects[0];
    },

    focus: function(obj){
        var hasFocus = this._focusedObjects.indexOf(obj) > -1;
        var shouldBlur = hasFocus && this.allowsDeselect;

        if(shouldBlur){
            this.blur(obj);
            return;
        }

        if(!hasFocus){
            if(this._focusedObjects.length > 0){
                this.blur(this._focusedObjects[0]);
            }

            this._focusedObjects.push(obj);
            this._dispatchFocus(obj);
        }
    }
});

// var SingleFocusManager = marionette.Controller.extend({

//     // Object vars

//     focusManager: null,

//     // Initialization

//     initialize: function(options){
//         _.extend(this, options);
//         this.$el = helpers.getElement(this.el);

//         if(!this.focusManager){
//             this.focusManager = new FocusManager({
//                 el: this.$el,
//                 allowsDeselect: options.allowsDeselect});
//         }

//         this.listenTo(this.focusManager, 'focus', this.focusManagerDidFocus);
//         this.listenTo(this.focusManager, 'blur', this.focusManagerDidBlur);
//     },

//     val: function(){
//         return this.focusManager.val()[0];
//     },

//     focusIndex: function(value){
//         this.focusManager.focusIndex(value);
//     },

//     focus: function($el){
//         this.focusManager.focus($el);
//     },

//     blur: function($el){
//         this.focusManager.blur($el);
//     },

//     focusManagerDidFocus: function($el){
//         this.trigger('focus', $el);

//         // Selection manager pushes items into the collection.
//         // the item at position 0 will be the last element selected.
//         var focusManager = this.focusManager;

//         if(focusManager.collection.length > 1){
//             focusManager.blur(focusManager.collection.at(0));
//         }
//     },

//     focusManagerDidBlur: function($el){
//         this.trigger('blur', $el);
//     },

//     // Marionette overrides

//     onClose: function(){
//         this.focusManager.close();
//     }
// });

// Exports

exports.SingleFocusManager = SingleFocusManager;

}); // eof define
