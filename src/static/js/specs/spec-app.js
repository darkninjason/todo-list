define(function(require, exports, module) {


// Imports
var TodoList = require('app/todos/collections/todo-list').TodoList;
var Todo     = require('app/todos/models/todo').Todo;
var TodoFooter = require('app/todos/models/todo-footer').TodoFooter;
var Placeholder = require('app/todos/models/placeholder').Placeholder;
var PlaceholderView = require('app/todos/views/placeholder').PlaceholderView;
var TodoLayoutView = require('app/todos/views/layout').TodoLayoutView;
var TodoCollectionView = require('app/todos/views/todo-collection').TodoCollectionView;
var TodoFooterView = require('app/todos/views/todo-footer').TodoFooterView;

describe('Jason\'s Todo App', function() {
    var todo, todoTwo, list, placeholderView, todoCollectionView, layout, todoFooterView;

    beforeEach(function() {
        loadFixtures('layout.html');
        layout = new TodoLayoutView();
        layout.render();

        todo = new Todo({title: 'First Todo'});
        todoTwo = new Todo({title: 'Second Todo'});
        
        list = new TodoList();
        list.addTodo(todo);
        list.addTodo(todoTwo);

        placeholderView = new PlaceholderView({collection: list, model: new Placeholder() });
        placeholderView.render();

        todoCollectionView = new TodoCollectionView({collection: list});
        todoCollectionView.render();

        todoFooterView = new TodoFooterView({collection: list, model: new TodoFooter()});
        todoFooterView.render();


    });

    it('should create a new Todo', function() {
        expect(todo).toEqual(jasmine.any(Todo));
    });

    it('should toggle Todo state', function() {
        expect(todo.attributes.completed).toBe(false);
        todo.toggleState();
        expect(todo.attributes.completed).toBe(true);
    });

    it('should add Todo to TodoList', function() {
        expect(list.length).toEqual(2);
        var todoThree = new Todo({title: 'Third Todo'});
        list.addTodo(todoThree);
        expect(list.length).toEqual(3);
    });

    it('should add Todo from PlaceholderView input', function() {
        var $input = $(placeholderView.ui.newTodo);
        $input.val('Second Todo');

        var key = jQuery.Event('keypress');
        key.which = 13;
        key.keyCode = 13;
        
        $input.trigger(key);

        expect(list.length).toEqual(3);
    });

    it('should mark all Todos as complete if any are incomplete', function() {
        list.at(0).toggleState(); // toggles first Todo to complete

        var $toggle = $(placeholderView.ui.toggleAll);
        $toggle.click();

        $.each(list.models, function(){
            expect(this.attributes.completed).toBe(true);
        });

    });

    it('should mark all Todos as incomplete only if all are complete', function() {
        var $toggle = $(placeholderView.ui.toggleAll);
        $toggle.click();

        $.each(list.models, function(){
            this.toggleState();
        });

        $.each(list.models, function(){
            expect(this.attributes.completed).toBe(false);
        });
    });

    it('should delete the first Todo', function() {
        var $destroy = todoCollectionView.$el.find('.destroy');
        $destroy.eq(0).click();
        expect(list.length).toEqual(1);
        var title = list.at(0).attributes.title;
        expect(title).toBe('Second Todo');
    });

    it('should toggle the label to edit mode on doubleclick', function(){
        var $label = todoCollectionView.$el.find('label').eq(0);
        var $edit = todoCollectionView.$el.find('.edit').eq(0);
        var $view = todoCollectionView.$el.find('.view').eq(0);

        $label.dblclick();
        expect($edit.css('display')).toBe('inline-block');
        expect($view.css('display')).toBe('none');
    });

    it('should change the rendered title when title of model changes', function(){
        var $label = todoCollectionView.$el.find('label').eq(0);
        var $edit = todoCollectionView.$el.find('.edit').eq(0);
        var $view = todoCollectionView.$el.find('.view').eq(0);

        $label.dblclick();
        $edit.val('Editing Todo One');

        var key = jQuery.Event('keypress');
        key.which = 13;
        key.keyCode = 13;
        
        $edit.trigger(key);

        expect(todoCollectionView.$el.find('label').html()).toBe('Editing Todo One');
    });

    it('should toggle Todo state on checkbox change and add completed class to corresponding li', function(){
        var $toggle = todoCollectionView.$el.find('.toggle').eq(0);
        $toggle.change();
        expect(list.at(0).attributes.completed).toBe(true);
        expect(todoCollectionView.$el.find('li').eq(0).hasClass('completed')).toBe(true);
    });

    it('should update number of items when new item is added', function(){
        list.addTodo(new Todo());
        var itemsLeft = parseInt(todoFooterView.$el.find('.items-left').html()[0], 10);
        expect(itemsLeft).toEqual(3);
    });

    it('should update number of items when an item is completed', function(){
        list.at(0).toggleState();
        var itemsLeft = parseInt(todoFooterView.$el.find('.items-left').html()[0], 10);
        expect(itemsLeft).toEqual(1);
    });

    it('should update number of items when an item is removed/destroyed', function(){
        var $destroy = todoCollectionView.$el.find('.destroy');
        $destroy.eq(0).click();
        var itemsLeft = parseInt(todoFooterView.$el.find('.items-left').html()[0], 10);
        expect(itemsLeft).toEqual(1);
    });

    it('should clear all completed tasks when clicking Clear Completed', function(){
        var $toggleAll = $(placeholderView.ui.toggleAll);
        $toggleAll.click();
        var $clearCompleted = $(todoFooterView.ui.clearCompleted);
        $clearCompleted.click();
        expect(list.length).toBe(0);
        var itemsLeft = parseInt(todoFooterView.$el.find('.items-left').html()[0], 10);
        expect(itemsLeft).toEqual(0);
    });

    it('should set the correct path to send to Backbone.history', function(){
        var $links = todoFooterView.$el.find('a');
        
        $links.eq(0).click();
        expect(todoFooterView.path).toBe('/all');

        $links.eq(1).click();
        expect(todoFooterView.path).toBe('/active');

        $links.eq(2).click();
        expect(todoFooterView.path).toBe('/completed');
    });

    

});
});