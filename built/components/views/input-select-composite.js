define(function (require, exports, module) {

var marionette = require('marionette');
var InputSelect  = require('built/components/controls/input-select').InputSelectMarionette;
var helpers      = require('built/utils/helpers');
var Scroller     = require('built/ui/controls/page/scroller').Scroller;


var InputSelectComposite =  marionette.CompositeView.extend({
    initialize : function(){

    },

    onShow : function(){
        this.inputSelect = new InputSelect({
            el: this.ui.input
        });
        this.scroller = new Scroller({
            el            : this.ui.listGroup,
            scrollDebounce: 0,
            duration      : 300,
        });
        this.listenTo(this.inputSelect, this.inputSelect.EVENT_INPUT, this.onInputChange);
        this.listenTo(this.inputSelect, this.inputSelect.EVENT_FOCUS_KEY, this.onInputFocusChange);
        this.listenTo(this.collection,'sync',this.onCollectionSync);
    },

    onInputChange: function(input, $input, value){
        this.collection.updateForSearch(value);
    },

    onInputFocusChange: function(input, $el){
        this.scroller.scrollToElement($el);
    },

    onCollectionSync: function(){
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
        this.scroller.calculateMaxScroll();
    }
});

exports.InputSelectComposite = InputSelectComposite;

});
