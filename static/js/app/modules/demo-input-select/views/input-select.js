define(function (require, exports, module) {

var marionette   = require('marionette');
<<<<<<< HEAD
var InputSelect  = require('built/components/input-select').InputSelectMarionette;
var helpers      = require('built/core/utils/helpers');
var Scroller     = require('built/core/controls/page/scroller').Scroller;
=======
var InputSelectComposite  = require('built/components/views/input-select-composite').InputSelectComposite;
>>>>>>> 1c4332924ec418919022dc0cba964b7d0563c1bc
var template     = require('hbs!tpl/input-select/composite');


var ResultItem   = require('./result-item').ResultItem;
var InputResults = require('../collections').InputResults;

var InputSelectView = InputSelectComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),

    ui : {
        input:'input',
        listGroup: '.list-group'
    },


});

exports.InputSelectView = InputSelectView;

});
