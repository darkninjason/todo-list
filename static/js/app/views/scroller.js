define(function (require, exports, module) {

var marionette = require('marionette');
var template = require('hbs!tpl/scroller');
var Scroller = require('auf/ui/controls/page/scroller').Scroller;

var ScrollerView = marionette.ItemView.extend({
    positionDict : {},
    template : template,
    ui : {
        buttons: '.btn'
    },
    events : {
        'click .btn': 'onBtnClick'
    },
    onShow : function(){

        this.scroller = new Scroller({
            el            : $('.scroll-container'),
            scrollDebounce: 0,
            duration      : 300,
        });
        this.scroller.on('marker', _.bind(this.onMarkerHit, this));
        for(var i=0; i < this.ui.buttons.length; i ++){
            var button = $(this.ui.buttons[i]);
            var pos = button.data('position');
            this.scroller.addMarkerPositions(pos);
            this.positionDict[String(pos)] = button;
        }
    },
    onMarkerHit : function(target, inViewArr, direction){
        for(var i = 0; i < inViewArr.length; i ++){
            var key = inViewArr[i];
            var button = this.positionDict[key];
            button.addClass(button.data('selected-class'))
        }
    },
    onBtnClick : function(e){
        var btn = $(e.target);
        this.scroller.setScrollPosition(btn.data('position'));
    }
});

exports.ScrollerView = ScrollerView;

});
