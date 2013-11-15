define(function (require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!tpl/input-select/result-item');

var ResultItem = marionette.ItemView.extend({
    tagName: 'a',
    className: 'list-group-item',
    template : template,
    initialize: function(){
        this.listenTo(this, 'focus', this.onFocus);
        this.listenTo(this, 'blur', this.onBlur);
        this.listenTo(this, 'select', this.onSelect);
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
