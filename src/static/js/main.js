

define(function(require, exports, module){

var marionette = require('marionette');
var renderer = require('app/renderer');
var app = require('app/app');
var AppRouter = require('app/app-router').AppRouter;
require('backbone/stickit');

app.appRouter = new AppRouter();

app.start();

$(document).on('click', 'a', function(event){
    event.preventDefault();
    app.appRouter.navigate($(event.target).attr('href').substring(2), {trigger: true});
});

}); // eof define

