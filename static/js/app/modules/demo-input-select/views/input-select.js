define(function (require, exports, module) {

var marionette = require('marionette');
var InputSelect = require('auf/ui/controls/forms/input-select').InputSelect;
var template = require('hbs!tpl/input-select/composite');
var ResultItem = require('./result-item').ResultItem;
var InputResults = require('../collections').InputResults;

var InputSelectView = marionette.CompositeView.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),

    ui : {
        input:'input'
    },

    onShow : function(){
        this.inputSelect = new InputSelect({
            el: this.ui.input
        });
        this.listenTo(this.inputSelect, 'input', this.onInputChange);
        this.listenTo(this.inputSelect, 'blur', this.onItemBlur);
        this.listenTo(this.inputSelect, 'focus', this.onItemFocus);
        this.listenTo(this.inputSelect, 'select', this.onItemSelect);
        this.listenTo(this.collection,'sync',this.onCollectionSync);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    },

    onCollectionSync: function(){
        var elements = [];
        var views = this.children.toArray();
        _.each(views, function(each){
            elements.push(each.$el[0]);
        });
        this.inputSelect.setElements($(elements));
        var mDict = this.mDict = {};
        _.each(views, function(each){
            var key = each.$el.data('auf-id');
            mDict[key] = each;
            elements.push(each.$el[0]);
        });
        this.inputSelect.beginNavigationPhase();
    },

    getViewForElement: function($element){

        return itemView;
    },

    triggerEventOnViewForElement: function(event, $element){
        var key = $element.data('auf-id');
        var itemView = this.mDict[key];
        if(itemView){
            itemView.trigger(event);
        }
    },

    onItemBlur: function(input, $element){
        this.triggerEventOnViewForElement('blur', $element);
    },

    onItemFocus: function(input, $element){
        this.triggerEventOnViewForElement('focus', $element);
    },

    onItemSelect: function(input, $element){
        this.triggerEventOnViewForElement('select', $element);
    },

});

exports.InputSelectView = InputSelectView;

});
