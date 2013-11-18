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

    swap: function(from, to){
        var list = this._list;

        var objFrom = list[from];
        var objTo = list[to];

        list[from] = objTo;
        list[to] = objFrom;
    },

    insertObject: function(obj){
        this._list.push(obj);
    },

    insertObjectAt: function(position, obj){
        this._list.splice(position, 0, obj);
    },

    removeObjectAt: function(position){
        return this._list.splice(position, 1);
    },

    moveObjectFromTo: function(from, to){
        var list = this._list;
        var obj = list.splice(from, 1)[0];
        list.splice(to, 0, obj);
        this._list = list;
    },

    replaceAt: function(position, obj){
        var list = this._list;
        list[position] = obj;
    }

});

// Exports

exports.ListManager = ListManager;

});
