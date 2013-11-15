define(function (require, exports, module) {

var marionette = require('marionette');
var InputSelect = require('auf/ui/controls/forms/input-select').InputSelect;
var template = require('hbs!tpl/input-select');


var InputSelectView = marionette.ItemView.extend({
    template : template,
    ui : {
        input:'input'
    },
    events : {

    },
    onShow : function(){
        this.inputSelect = new InputSelect({
            el: this.ui.input
        });

    }
});

exports.InputSelectView = InputSelectView;

});
