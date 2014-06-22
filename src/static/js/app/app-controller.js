define(function(require, exports, module) {

// global variables/libraries
var $ = require('jquery');
var marionette = require('marionette');
var app = require('app/app');
var backbone = require('backbone');

// models
var Todo       = require('app/todos/models/todo').Todo;
var TodoFooter = require('app/todos/models/todo-footer').TodoFooter;
var Placeholder = require('app/todos/models/placeholder').Placeholder;

// collection
var TodoList      = require('app/todos/collections/todo-list').TodoList;

// views
var TodoView          = require('app/todos/views/todo').TodoView;
var PlaceholderView   = require('app/todos/views/placeholder').PlaceholderView;
var TodoFooterView    = require('app/todos/views/todo-footer').TodoFooterView;
var TodoCollectionView       = require('app/todos/views/todo-collection').TodoCollectionView;

var AppController = marionette.Controller.extend({

    initialize: function(options){

        // start our app
        this.app = app;
        
        // initialize our collection
        this.app.Todos = new TodoList();

        // initialize our views
        this.app.PlaceholderView = new PlaceholderView({model: new Placeholder()});
        this.app.TodoCollectionView = new TodoCollectionView({collection: this.app.Todos});
        this.app.TodoFooterView = new TodoFooterView({model: new TodoFooter()});
        
        // display our views in the appropriate regions
        this.app.header.show(this.app.PlaceholderView);
        this.app.main.show(this.app.TodoCollectionView);
        this.app.footer.show(this.app.TodoFooterView);

    },

    index: function(){
        
    },

    showAll: function(){
        this.app.main.$el.removeClass('completed active');
    },

    showActive: function(){
        this.app.main.$el.addClass('active').removeClass('completed');
    },

    showCompleted: function(){
        this.app.main.$el.addClass('completed').removeClass('active');
    }
    
});

exports.AppController = AppController;
});