define(function (require, exports, module) {

var marionette   = require('marionette');
var InputSelectComposite  = require('built/ui/views/input-select-composite').InputSelectComposite;
var template     = require('hbs!tpl/input-select/composite');


var ResultItem   = require('./result-item').ResultItem;
var InputResults = require('../collections').InputResults;

var InputSelectView = InputSelectComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),
    ui : {
        input:'input'
    }
});

exports.InputSelectView = InputSelectView;

});
