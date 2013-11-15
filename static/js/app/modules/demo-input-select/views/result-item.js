define(function (require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!tpl/input-select/result-item');

var ResultItem = marionette.ItemView.extend({
    tagName: 'li',
    className: 'list-group-item',
    template : template,
    initialize: function(){
        this.listenTo(this, 'focus', this.onFocus);
        this.listenTo(this, 'blur', this.onBlur);
        this.listenTo(this, 'select', this.onSelect);
    },
    onFocus: function(){
        console.log('onFocus');
    },
    onBlur: function(){
        console.log('onBlur');
    },
    onSelect: function(){
        console.log('onSelect');
    },
});

exports.ResultItem = ResultItem;

});
