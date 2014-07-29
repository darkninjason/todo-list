define(function (require, exports, module) {

var SelectCompositeView = require('built/ui/views/composite/select').SelectCompositeView;

var SelectItem = require('./select-item').SelectItem;
var template = require('hbs!tpl/select/composite');
require('stickit');


var SelectDemoComposite = SelectCompositeView.extend({
    template : template,
    childView : SelectItem,
    childViewContainer : '.list-group',
    className : 'built-select',
    ui:{
        list:'.list-group'
    },
    bindings:{
        '.title':'option'
    }
});

exports.SelectDemoComposite = SelectDemoComposite;

});
