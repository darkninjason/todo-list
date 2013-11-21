define(function (require, exports, module) {

var marionette   = require('marionette');
var InputSelect  = require('built/ui/controls/input-select').InputSelectMarionette;
var helpers      = require('built/core/utils/helpers');
var Scroller     = require('built/core/controls/page/scroller').Scroller;
var focus        = require('built/core/events/focus');

var InputSelectComposite =  marionette.CompositeView.extend({
    initialize : function(){

    },

    onShow : function(){

        this.inputSelect = new InputSelect({
            el: this.ui.input
        });

        this.listenTo(this.collection,'sync',this.onCollectionSync);
        this.listenTo(this.collection,'change',this.onCollectionSync);
        this.listenTo(this.inputSelect, this.inputSelect.EVENT_INPUT, this.onInputChange);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    },

    onCollectionSync: function(){
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
    }
});

exports.InputSelectComposite = InputSelectComposite;

});
