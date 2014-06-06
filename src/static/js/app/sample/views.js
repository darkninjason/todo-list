define(function(require, exports, module) {

var marionette = require('marionette');

var templateTodo = require('hbs!app/sample/templates/todo');
var templateNewTodo = require('hbs!app/sample/templates/newTodo');
var templateTodoFooter = require('hbs!app/sample/templates/todoFooter');

var MyTodoView = marionette.ItemView.extend({
    tagName: 'li',
    template: templateTodo,

    ui: {
        taskName: 'input.edit'
    },

    events: {
        'click .destroy' : 'removeTodo',
        'dblclick label' : 'editMode',
        'keypress .edit' : 'updateOnEnter',
        'click .toggle'  : 'toggleState'
    },

    removeTodo: function(e){
        this.model.destroy();
        this.remove();
    },

    initialize: function(){
        this.listenTo(this.model, 'change:title', this.changeTitle);
        this.listenTo(this.model, 'change:completed', this.toggleRender);
        this.listenTo(this.model, 'remove', this.removeTodo);
    },

    editMode: function(){
        this.$el.find('.view').hide();
        this.$el.find('.edit').show().focus();
    },

    updateOnEnter: function(e){
        if(e.keyCode == 13){
            this.model.set('title', this.ui.taskName.val());
        }
    },

    changeTitle: function(e){
        this.$el.find('.view').show();
        this.$el.find('.edit').hide();
        this.render();
    },

    toggleState: function(){
        this.model.toggleState();
    },

    toggleRender: function(){
         this.$el.toggleClass('completed');
         this.render();
    }
});

var MyNewTodoView = marionette.ItemView.extend({
    template: templateNewTodo,
    placeholder: "",

    ui: {
        newTodo: '#new-todo'
    },

    events:{
        'keypress input' : 'addTodo',
        'click .toggle-all' : 'toggleAll'
    },

    addTodo: function(e){
        if(e.keyCode == 13 && (this.ui.newTodo.val().length > 0)){
            var todo = new Todo({title: this.ui.newTodo.val()});
            Todos.add(todo);
            this.ui.newTodo.val('');;
        }
    },

    toggleAll: function(){
        if(Todos.where({completed: true}).length === Todos.length){
            this.uncompleteAll();
        } else {
            this.completeAll();
        }
    },

    completeAll: function(){

        Todos.forEach(function(model){
            if(!model.get('completed')){
                model.toggleState();
            }
        });
    },

    uncompleteAll: function(){

        Todos.forEach(function(model){
            if(model.get('completed')){
                model.toggleState();
            }
        });
    }
});

var MyTodoCollectionView = marionette.CollectionView.extend({
    tagName: "ul",
    itemView: MyTodoView,
    initialize: function(){
        this.listenTo(Todos, "add", this.addTodo);
    },

    addTodo: function(model){
        var view = new MyTodoView({model: model});
        view.render();
        this.$el.append(view.$el);
    }
});

var MyTodoFilteredCollectionView = marionette.CollectionView.extend({
    tagName: "ul",
    itemView: MyTodoView,
    initialize: function(){
        console.log('haa');
        console.log(this.collection);
        this.listenTo(this.collection, "change:completed", this.removeTodo);
    },

    removeTodo: function(model){
        console.log('haa');
    }
});

var MyTodoFooterView = marionette.ItemView.extend({
    template: templateTodoFooter,

    events: {
        'click .clear-completed' : 'clearCompleted'
    },

    initialize: function(){
       this.listenTo(Todos, "add remove change:completed", this.updateCount);
    },

    updateCount: function(){
        this.model.set('itemsLeft', Todos.where({completed: false}).length);
        this.render();
    },

    clearCompleted: function(){
        var completedIndexes = [];

        Todos.forEach(function(model, index){
            if(model.get('completed')){
                completedIndexes.push(index);
            }
        });
        
        for(var i = Todos.length - 1; i >= 0; i--){
            Todos.remove(Todos.at(completedIndexes[i]));
        }
    }
});

exports.MyTodoView = MyTodoView;
exports.MyNewTodoView = MyNewTodoView;
exports.MyTodoCollectionView = MyTodoCollectionView;
exports.MyTodoFilteredCollectionView = MyTodoFilteredCollectionView;
exports.MyTodoFooterView = MyTodoFooterView; 

});