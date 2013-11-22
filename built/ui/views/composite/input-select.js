define(function (require, exports, module) {

var marionette   = require('marionette');
var InputSelect  = require('built/ui/controls/input-select').InputSelectMarionette;
var helpers      = require('built/core/utils/helpers');
var Scroller     = require('built/core/controls/page/scroller').Scroller;
var focus        = require('built/core/events/focus');
var data         = require('built/core/events/data');
var events       = require('built/core/events/event');

var InputSelectComposite =  marionette.CompositeView.extend({
    initialize : function(){

    },

    onShow : function(){

        this.inputSelect = new InputSelect({
            el: this.ui.input
        });

        this.listenTo(this.collection,'sync', this.onCollectionSync);
        this.listenTo(this.collection,'change', this.onCollectionSync);
        this.listenTo(this.inputSelect, data.DATA, this.onInputChange);
        this.listenTo(this.inputSelect, events.CANCEL, this.onCancel);
    },

    onCancel: function(){
         this.collection.reset();
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
