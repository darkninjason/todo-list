define(function (require, exports, module) {

var marionette                      = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var InputSelectComposite            = require('built/ui/views/composite/input-select').InputSelectComposite;

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
    }
});


var InputSelectScrollableView = InputSelectScrollableComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),
    ui : {
        input:'input'
    }
});

exports.InputSelectView = InputSelectView;
exports.InputSelectScrollableView = InputSelectScrollableView;

});
