define(function(require, exports, module) {

    var marionette = require('marionette'),
        templateTodo = require('hbs!app/todos/templates/todo');

    var TodoView = marionette.ItemView.extend({

        tagName: 'li',
	    template: templateTodo,

	    ui: {
	        taskName: 'input.edit',
	        destroy: '.destroy'
	    },

	    events: {
	        'click @ui.destroy' : 'removeTodo',
	        'dblclick label' : 'editMode',
	        'keypress .edit' : 'updateOnEnter',
	        'click .toggle'  : 'toggleState'
	    },

	    removeTodo: function(e){
	        this.model.destroy();
	    },

	    initialize: function(){
	        this.listenTo(this.model, 'change:title', this.changeTitle);
	        this.listenTo(this.model, 'change:completed', this.toggleRender);
	        this.listenTo(this.model, 'remove', this.removeTodo);

	        if(this.model.get('completed')){
	        	this.$el.addClass('completed');
	        }
	    },

	    editMode: function(){
	        this.$el.find('.view').hide();
	        this.$el.find('.edit').show().focus();
	    },

	    updateOnEnter: function(e){
	        if(e.keyCode == 13){
	            this.model.save('title', this.ui.taskName.val());
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

    exports.TodoView = TodoView;

});