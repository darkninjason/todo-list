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
        this.$el.toggleClass('completed');
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
        'click .complete-all' : 'completeAll'
    },

    addTodo: function(e){
        if(e.keyCode == 13 && (this.ui.newTodo.val().length > 0)){
            var todo = new Todo({title: this.ui.newTodo.val()});
            Todos.add(todo);
            this.ui.newTodo.val('');;
        }
    },

    completeAll: function(){
        Todos.forEach(function(model){
            model.set('completed', true);
        });
    }
});

var MyTodoCollectionView = marionette.CollectionView.extend({
    tagName: "ul",
    itemView: MyTodoView,
    initialize: function(){
        this.listenTo(Todos, "add", this.todoAdded);
    },

    todoAdded: function(model){
        var view = new MyTodoView({model: model});
        view.render();
        this.$el.append(view.$el);
    }
});

var MyTodoFooterView = marionette.ItemView.extend({
    template: templateTodoFooter,

    initialize: function(){
       this.listenTo(Todos, "add remove change:completed", this.updateCount);
    },

    updateCount: function(){
        this.model.set('itemsLeft', Todos.where({completed: false}).length);
        this.render();
    }
});

exports.MyTodoView = MyTodoView;
exports.MyNewTodoView = MyNewTodoView;
exports.MyTodoCollectionView = MyTodoCollectionView;
exports.MyTodoFooterView = MyTodoFooterView; 

});