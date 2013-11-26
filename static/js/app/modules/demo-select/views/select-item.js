define(function (require, exports, module) {

var marionette = require('marionette');
var focus = require('built/core/events/focus');
var event = require('built/core/events/event');
var template = require('hbs!tpl/select/item');

var SelectItem = marionette.ItemView.extend({
    tagName:'li',
    className:'list-group-item',
    template : template,
    ui : {

    },
    triggers : {
        'click':'click'
    },
    initialize: function(){
        this.on(focus.FOCUS, this.setFocus);
        this.on(focus.BLUR, this.setBlur);
    },
    setFocus: function(){
        this.$el.addClass('active');
    },
    setBlur: function(){
        this.$el.removeClass('active');
    }
});

exports.SelectItem = SelectItem;

});
