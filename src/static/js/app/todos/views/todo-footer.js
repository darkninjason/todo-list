define(function(require, exports, module) {

    var marionette = require('marionette'),
        templateTodoFooter = require('hbs!app/todos/templates/todo-footer');

    var TodoFooterView = marionette.ItemView.extend({
        template: templateTodoFooter,

        events: {
            'click .clear-completed' : 'clearCompleted',
            'click a' : 'filterCollection'
        },

        initialize: function(){
            this.listenTo(this.collection, "add remove change:completed", this.updateCount);
        },

        updateCount: function(){
            this.model.set('itemsLeft', this.collection.where({completed: false}).length);
            this.render();
        },

        clearCompleted: function(){
            var completedIndexes = [];

            this.collection.forEach(function(model, index){
                if(model.get('completed')){
                    completedIndexes.push(index);
                }
            });
            
            for(var i = this.collection.length - 1; i >= 0; i--){
                this.collection.remove(this.collection.at(completedIndexes[i]));
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