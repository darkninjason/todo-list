define(function (require, exports, module) {

var marionette = require('marionette');
var InputSelect = require('auf/components/input-select').InputSelectMarionette;
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
        this.listenTo(this.collection,'sync',this.onCollectionSync);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    },

    onCollectionSync: function(){
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
    }
});

exports.InputSelectView = InputSelectView;

});
