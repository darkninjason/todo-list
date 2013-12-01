define(function (require, exports, module) {

var marionette                      = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var InputSelectComposite            = require('built/ui/views/composite/input-select').InputSelectComposite;
var data                            = require('built/core/events/data');

var template                        = require('hbs!tpl/input-select/composite');
var ResultItem                      = require('./result-item').ResultItem;
var InputResults                    = require('../collections').InputResults;

var InputSelectView = InputSelectComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),
    ui : {
        input:'input'
    },

    onShow: function(){
        InputSelectComposite.prototype.onShow.apply(this,arguments);
        this.listenTo(this.inputSelect, data.DATA, this.onInputChange);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    }
});


var InputSelectScrollableView = InputSelectScrollableComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),
    ui : {
        input:'input'
    },

    onShow: function(){
        InputSelectScrollableComposite.prototype.onShow.apply(this,arguments);
        this.listenTo(this.inputSelect, data.DATA, this.onInputChange);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    }
});

exports.InputSelectView = InputSelectView;
exports.InputSelectScrollableView = InputSelectScrollableView;

});
