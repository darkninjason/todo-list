define(function(require, exports, module){

// Imports

var Marionette     = require('marionette');
var _              = require('underscore');
var Collection     = require('auf/jquery/collection').Collection;
var array          = require('auf/ui/managers/array');
var helpers        = require('auf/utils/helpers');
// Module

var FocusManager =  array.ArrayManager.extend({
    EVENT_FOCUS: 'focus',
    EVENT_BLUR: 'blur',

    // Object vars
    allowsDeselect: false,

    // Initialization

    initialize: function(options){
        array.ArrayManager.prototype.initialize.call(this, options);
        this.allowsDeselect = options.allowsDeselect;
        this._focusedObjects = [];
    },

    focusIndex: function(index){
        var obj = this._list[index];
        this.focus(obj);
    },

    getfocusedIndexes: function(){
        var indexes =  _.map(this._focusedObjects, function(obj){
            var candidate = this._list.indexOf(obj);
            if (candidate > -1){
                return candidate;
            }
        }, this);

        return indexes;
    },

    getFocusedObjects: function(){
        // these are in no particular order
        return this._focusedObjects;
    },

    focus: function(obj){
        var hasFocus = this._focusedObjects.indexOf(obj) > -1;
        var shouldBlur = hasFocus && this.allowsDeselect;

        if(shouldBlur){
            this.blur(obj);
            return;
        }

        if(!hasFocus){
            this._focusedObjects.push(obj);
            this._dispatchFocus(obj);
        }
    },

    blur: function(obj){
        var index = this._focusedObjects.indexOf(obj);
        var hasFocus = index > -1;

        if(hasFocus){
            this._focusedObjects.splice(index, 1);
            this._dispatchBlur(obj);
        }
    },

    _dispatchFocus: function(obj) {
        this.trigger(this.EVENT_FOCUS, this, obj);
    },

    _dispatchBlur: function(obj) {
        this.trigger(this.EVENT_BLUR, this, obj);
    },

    // Marionette overrides

    onClose: function(){
        this._focusedObjects = null;
        array.ArrayManager.prototype.onClose.call(this);
    }

}); // eof FocusManager

// Exports

exports.FocusManager = FocusManager;

}); // eof define
