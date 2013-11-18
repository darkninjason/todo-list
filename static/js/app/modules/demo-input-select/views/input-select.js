define(function (require, exports, module) {

var marionette   = require('marionette');
var InputSelect  = require('auf/components/input-select').InputSelectMarionette;
var helpers      = require('auf/utils/helpers');
var Scroller     = require('auf/ui/controls/page/scroller').Scroller;
var template     = require('hbs!tpl/input-select/composite');

var ResultItem   = require('./result-item').ResultItem;
var InputResults = require('../collections').InputResults;

var InputSelectView = marionette.CompositeView.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,
    collection : new InputResults(),

    ui : {
        input:'input',
        listGroup: '.list-group'
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
        var promise = this.scroller.scrollToElement($el);
        console.log(this.inputSelect.options.acceptsMouseEnterExit);
        this.inputSelect.options.acceptsMouseEnterExit = false;
        promise.then(_.bind(function(){
            this.inputSelect.options.acceptsMouseEnterExit = true;
        },this));
    },

    onCollectionSync: function(){
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
        this.scroller.calculateMaxScroll();
    }
});

exports.InputSelectView = InputSelectView;

});
