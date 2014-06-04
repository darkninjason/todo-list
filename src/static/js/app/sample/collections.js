define(function(require, exports, module) {

var marionette = require('marionette');
var modals = require('built/app/modals');

var templateSample = require('hbs!app/sample/templates/sample');
var templateModal = require('hbs!app/sample/templates/modal');
var templateTodo = require('hbs!app/sample/templates/todo');

var MySampleView = marionette.ItemView.extend({
    template: templateSample
});

var MyTodoView = marionette.ItemView.extend({
    tagName: 'li',
    template: templateTodo,

    events:{
        'keypress .edit' : 'updateOnEnter'
    },

    updateOnEnter: function(e){
        console.log('key is pressed');
    }
});

exports.MySampleView = MySampleView;

});