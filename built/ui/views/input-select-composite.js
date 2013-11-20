define(function (require, exports, module) {

var marionette = require('marionette');
var InputSelect  = require('built/ui/controls/input-select').InputSelectMarionette;
var helpers      = require('built/core/utils/helpers');
var Scroller     = require('built/core/controls/page/scroller').Scroller;


var InputSelectComposite =  marionette.CompositeView.extend({
    initialize : function(){

    },

    onShow : function(){

        _.bindAll(this,'onMouseMove');
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
        this.inputSelect.mouseResponder.enableEnterExit(false);
        this._mouseX = null;
        this._mouseY = null;
        $(window).on('mousemove', this.onMouseMove);
    },

    onMouseMove: function(e){
        var hasMouseX = !_.isNull(this._mouseX);
        var hasMouseY = !_.isNull(this._mouseY);
        var hasPreviousMousePosition = hasMouseX && hasMouseY;
        var mouseXMoved = hasPreviousMousePosition && (this._mouseX != e.pageX);
        var mouseYMoved = hasPreviousMousePosition && (this._mouseY != e.pageY);
        this._mouseX = e.pageX;
        this._mouseY = e.pageY;
        if(mouseXMoved || mouseYMoved){
            $(window).off('mousemove', this.onMouseMove);
            this.inputSelect.mouseResponder.enableEnterExit(true);
        }

    },

    onCollectionSync: function(){
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
        this.scroller.calculateMaxScroll();
    }
});

exports.InputSelectComposite = InputSelectComposite;

});
