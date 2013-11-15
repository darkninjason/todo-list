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
    events : {

    },
    onShow : function(){
        this.inputSelect = new InputSelect({
            el: this.ui.input
        });
        this.listenTo(this.inputSelect, 'input', _.bind(this.onInputChange, this));
        this.listenTo(this.collection,'sync',this.onCollectionSync);
    },
    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    },
    onCollectionSync: function(){
        this.inputSelect.setViews(this.children.toArray());
        this.inputSelect.beginNavigationPhase();
    },

});

exports.InputSelectView = InputSelectView;

});
