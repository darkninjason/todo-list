define(function (require, exports, module) {

var SelectCompositeView = require('built/ui/views/composite/select').SelectCompositeView;

var SelectItem = require('./select-item').SelectItem;
var template = require('hbs!tpl/select/composite');


var SelectDemoComposite = SelectCompositeView.extend({
    template : template,
    itemView : SelectItem,
    itemViewContainer : '.list-group',
    className : 'built-select',
    ui:{
        list:'.list-group'
    }
});

exports.SelectDemoComposite = SelectDemoComposite;

});
