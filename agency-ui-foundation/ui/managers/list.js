define(function(require, exports, module){

// Imports

var Marionette   = require('marionette');
var _            = require('underscore');


// Module

var ListManager = Marionette.Controller.extend({

    initialize: function(options){
        this._list = options.list || [];
    },

    setList: function(list){
        this._list = list;
    },

    getList: function(){
        return this._list;
    },

    swapPositions: function(from, to){
        var list = this._list;

        var objFrom = list[from];
        var objTo = list[to];

        list[from] = objTo;
        list[to] = objFrom;
    },

    insertAtPositionWith: function(position, item){
        this._list.splice(position, 0, item);
    },

    removeItemAtPosition: function(position){
        return this._list.splice(position, 1);
    },

    moveItemAtPositionToPosition: function(from, to){
        var list = this._list;
        var obj = list.splice(from, 1)[0];
        list.splice(to, 0, obj);
        this._list = list;
    },

    replaceAtPositionWith: function(position, item){
        var list = this._list;
        list[position] = item;
    }

});

// Exports

exports.ListManager = ListManager;

});
