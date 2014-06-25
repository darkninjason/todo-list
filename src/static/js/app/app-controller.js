define(function(require, exports, module) {

// global variables/libraries
var $ = require('jquery');
var marionette = require('marionette');
var app = require('app/app');
var backbone = require('backbone');
var localstorage = require('localstorage');

var TodoLayoutView       = require('app/todos/views/layout').TodoLayoutView;

var AppController = marionette.Controller.extend({

    initialize: function(options){
        this.app = app;
        this.app.todos.show(new TodoLayoutView());
    },

    index: function(){
        
    },

    showAll: function(){
        this.app.todos.$el.removeClass('completed active');
    },

    showActive: function(){
        this.app.todos.$el.addClass('active').removeClass('completed');
    },

    showCompleted: function(){
        this.app.todos.$el.addClass('completed').removeClass('active');
    }
    
});

exports.AppController = AppController;
});