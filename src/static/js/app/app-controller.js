define(function(require, exports, module) {

var $ = require('jquery');
var marionette = require('marionette');
var vent = require('built/app/vent').vent;
var modals = require('built/app/modals');
var activity = require('built/app/activity');
var keys = require('built/app/keys');
var app = require('app/app');

var MyTodoView          = require('app/sample/views').MyTodoView;
var MyNewTodoView       = require('app/sample/views').MyNewTodoView;
var MyTodoFooterView    = require('app/sample/views').MyTodoFooterView;
var MyTodoCollectionView       = require('app/sample/views').MyTodoCollectionView;
var MyTodoFilteredCollectionView       = require('app/sample/views').MyTodoCollectionView;
var Model               = require('backbone').Model;



var AppController = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.BUILT();
        this.app = app;
    },

    index: function(){
        

        /* Ready. Set. Go! */
        // Your Application's Regions are set in the app/app.js
        // everything else starts here. (or in another route :)
        Todo = Backbone.Model.extend({
           defaults: {
            title: 'Default task',
            completed: false
           },

           toggleState: function(){
            this.set('completed', !this.get('completed'));
           }
        });

        var TodoFooter = new Model({
            itemsLeft: 0
        });

        this.app.TodoList = Backbone.Collection.extend({
            model: Todo
        });

        Todos = new this.app.TodoList();

        var model = new Model({
            placeholder: 'What needs to be done?'
        });

        this.app.TodoCollectionView = new MyTodoCollectionView;
        this.app.CompletedTodoCollectionView = new MyTodoCollectionView;

        this.app.header.show(new MyNewTodoView({model: model}));
        this.app.main.show(this.app.TodoCollectionView);
        this.app.footer.show(new MyTodoFooterView({model: TodoFooter}));
        /* ---------- */        
    },

    showAll: function(){
        this.app.main.show(this.app.TodoCollectionView);
    },

    showActive: function(){
        var ActiveTodos = new this.app.TodoList(Todos.where({'completed': false})),
            ActiveTodosCollectionView = new MyTodoFilteredCollectionView;

        ActiveTodos.forEach(function(model, index){
            ActiveTodosCollectionView.addTodo(model);
        });

        this.app.main.show(ActiveTodosCollectionView);
    },

    showCompleted: function(){
        var CompletedTodos = new this.app.TodoList(Todos.where({'completed': true})),
            CompletedTodosCollectionView = new MyTodoFilteredCollectionView;

        CompletedTodos.forEach(function(model, index){
            CompletedTodosCollectionView.addTodo(model);
        });

        this.app.main.show(CompletedTodosCollectionView);
    },
    
    // Demo of handling Key Presses
    // Combined with Modal Handling
    keyDown: function(e){
        var key = keys.getKeyFromEvent(e);

        if(key == 'M' && // shift + M
           !this.app.modal.currentView){

            var complete = function(modalView){
                // Data from the modal:
                console.log(modalView.getData());

                // You are responsible for dismissing the modal.
                modals.dismissModal();
            };

            // Present a modal view.
            modals.presentModal(new MyModalView())
                  .then(complete);

            return true;
        }
    },
    
    BUILT: function(){

        // Key Management
        // If you are not using the modal system,
        // but are using the key system, you can omit
        // the dictionary passed here.
        keys.initialize({modals: modals});

        // The responder chain is a stack of views/controllers.
        // When a key event is detected, the stack is searched
        // from the bottom up. AKA Last in First Out (LIFO).
        // Views that participate in the chain can choose to implement
        // keyDown(e) or performKeyEquivalent(e).
        //
        // performKeyEquivalent is checked first then keyDown is checked.
        // If either of those returns 'true' the chain is no longer traversed.
        //
        // Note that we automatically add the ApplicationDelegate.
        // This ensures it will be the last one checked for key events.
        // Then we implement keyDown above to handle looking for
        // our desired key press.
        //
        // Any additional view or controller that would like
        // to participate in this chain is required to register
        // itself into the chain like we do here.
        keys.registerInResponderChain(this);

        // Modal Management
        // These handlers are present so you can define how the modal is
        // shown. AKA via animation, or some other means.
        //
        // You should NEVER call these directly.
        this.listenTo(vent, modals.events.PRESENT, this._presentModal);
        this.listenTo(vent, modals.events.DISMISS, this._dismissModal);

        // Activity Management
        // Like modal managerment, these handlers are present so you can define
        // how the network activity indicator is presented. AKA via animation
        // or some other means.
        //
        // You should NEVER call these directly.
        this.listenTo(vent, activity.events.PRESENT, this._presentNetworkActivityIndicator);
        this.listenTo(vent, activity.events.DISMISS, this._dismissNetworkActivityIndicator);
    },

    _presentNetworkActivityIndicator: function(){
        throw new Error('No Activity Indicator View Specified');
        //this.app.activity.show(new YourActivityView);
    },

    _dismissNetworkActivityIndicator: function(modalView){
        this.app.activity.close();
    },

    _presentModal: function(modalView){
        this.app.modal.show(modalView);
    },

    _dismissModal: function(modalView){
        this.app.modal.close();

        // This is VERY important!
        // You MUST call this after your
        // modal has been dismissed.
        modals.nextModal();
    }
});

exports.AppController = AppController;
});