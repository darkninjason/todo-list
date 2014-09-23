define(function(require, exports, module) {


// Imports
var TodoList = require('app/todos/collections/todo-list').TodoList;
var Todo     = require('app/todos/models/todo').Todo;
var Placeholder = require('app/todos/models/placeholder').Placeholder;
var PlaceholderView = require('app/todos/views/placeholder').PlaceholderView;
var TodoLayoutView = require('app/todos/views/layout').TodoLayoutView;
var TodoCollectionView = require('app/todos/views/todo-collection').TodoCollectionView;

describe('Jason\'s Todo App', function() {

    var todo, placeholderView;
    var list = new TodoList();

    beforeEach(function() {
        loadFixtures('layout.html');
        var layout = new TodoLayoutView();
        layout.render();

        todo = new Todo();
        placeholderView = new PlaceholderView({collection: list, model: new Placeholder() });
        placeholderView.render();

        todoCollectionView = new TodoCollectionView({collection: list});
        todoCollectionView.render();
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
        expect(list.length).toEqual(0);
        list.addTodo(todo);
        expect(list.length).toEqual(1);
    });

    it('should add Todo from PlaceholderView input', function() {
        var $input = $(placeholderView.ui.newTodo);
        $input.val('Second Todo');

        var key = jQuery.Event('keypress');
        key.which = 13;
        key.keyCode = 13;
        
        $input.trigger(key);

        expect(list.length).toEqual(2);
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
            expect(this.attributes.completed).toBe(false);
        });
    });

    it('should delete the first Todo', function() {
        var $destroy = todoCollectionView.$el.eq(0).find('.destroy');
        $destroy.eq(0).click();
        expect(list.length).toEqual(1);
        var title = list.at(0).attributes.title;
        expect(title).toBe('Second Todo');
    });

});
});