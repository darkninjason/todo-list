define(function (require, exports, module) {

var marionette = require('marionette');
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
        this.listenTo(this, focus.FOCUS, this.onFocus);
        this.listenTo(this, focus.BLUR, this.onBlur);
        this.listenTo(this, event.SELECT, this.onSelect);
    },
    onFocus: function(){
        this.$el.addClass('active');
    },
    onBlur: function(){
        this.$el.removeClass('active');
    }
});

exports.SelectItem = SelectItem;

});
