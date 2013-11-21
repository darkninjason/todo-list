define(function (require, exports, module) {

var marionette = require('marionette');
var focus = require('built/core/events/focus');
var event = require('built/core/events/event');
var template = require('hbs!tpl/input-select/result-item');


var ResultItem = marionette.ItemView.extend({
    tagName: 'a',
    className: 'list-group-item',
    template : template,
    initialize: function(){
        this.listenTo(this, focus.FOCUS, this.onFocus);
        this.listenTo(this, focus.BLUR, this.onBlur);
        this.listenTo(this, event.SELECT, this.onSelect);
    },
    onFocus: function(){
        this.$el.addClass('active');
    },
    onBlur: function(){
        this.$el.removeClass('active');
    },
    onSelect: function(){
        console.log('onSelect');
    },
});

exports.ResultItem = ResultItem;

});
