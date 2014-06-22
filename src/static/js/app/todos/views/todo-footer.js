define(function(require, exports, module) {

    var marionette = require('marionette'),
        templateTodoFooter = require('hbs!app/todos/templates/todo-footer'),
        app = require('app/app');

    var TodoFooterView = marionette.ItemView.extend({
        template: templateTodoFooter,

        events: {
            'click .clear-completed' : 'clearCompleted',
            'click a' : 'filterCollection'
        },

        initialize: function(){
            this.listenTo(app.Todos, "add remove change:completed", this.updateCount);
        },

        updateCount: function(){
            this.model.set('itemsLeft', app.Todos.where({completed: false}).length);
            this.render();
        },

        clearCompleted: function(){
            var completedIndexes = [];

            app.Todos.forEach(function(model, index){
                if(model.get('completed')){
                    completedIndexes.push(index);
                }
            });
            
            for(var i = app.Todos.length - 1; i >= 0; i--){
                app.Todos.remove(app.Todos.at(completedIndexes[i]));
            }
        },

        filterCollection: function(e){
            e.preventDefault();
            var path = $(e.target).attr('href');
            Backbone.history.navigate( path, {trigger: true});
        }
    });

    exports.TodoFooterView = TodoFooterView;

});