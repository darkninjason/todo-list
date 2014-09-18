define(function(require, exports, module) {


// Imports
var TodoList = require('app/todos/collections/todo-list').TodoList;
var Todo     = require('app/todos/models/todo').Todo;
var PlaceholderView = require('app/todos/views/placeholder').PlaceholderView;

describe('Jason\'s Todo App', function() {
    //  beforeEach(function() {
    //     loadFixtures('layout.html');
    // });

    // it('should succeed', function() {
    //     var $node = $('#foo');
    //     console.log($node.text());
    //     expect(true).toBe(true);
    // });

    var todo = new Todo();
    var list = new TodoList();
    var placeholder = new PlaceholderView({collection: list});

    it('should create a new Todo', function() {
        expect(todo).toEqual(jasmine.any(Todo));
    });

    it('should toggle Todo state', function() {
        var todo = new Todo();
        todo.toggleState();
        expect(todo.attributes.completed).toBe(true);
    });

    it('should add Todo to TodoList', function() {
        // loadFixtures('layout.html');
        // expect($('#main').length).toEqual(1);
        expect(list.length).toEqual(0);
        list.addTodo(new Todo());
        expect(list.length).toEqual(1);
    });

    it('should add Todo from Placeholder input', function() {
        loadFixtures('placeholder.html');
        var $input = $(placeholder.ui.newTodo);

        var e = jQuery.Event('keypress');
        e.which = 13; // # Some key code value

        $input.val('haa');
        $input.trigger(e);
        console.log(e);

        console.log($input.val());
        // $(placeholder.ui.newTodo).val('haa');
        // .trigger(e);
        // console.log($(placeholder.ui.newTodo).html());
        console.log(list);
    });

});
});