define(function (require, exports, module) {

var marionette = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;

var SelectItem = require('./select-item').SelectItem;
var template = require('hbs!tpl/select/composite');

var SelectDemoComposite = InputSelectScrollableComposite.extend({
    template : template,
    itemView : SelectItem,
    itemViewContainer : '.list-group',
    className : 'built-select',
    events:{
        'click .btn':'onOpenPress'
    },
    ui:{
        input:'input'
    },
    initialize : function(){

        this.model = new Backbone.Model();
        this.on('itemview:click', this.onItemViewClick);
        _.bindAll(this,'onWindowPress');
    },

    onInputChange: function(input, $input, value){
        console.log('called');
    },

    onCollectionSync: function(){

    },

    onClose: function(){
        this.enableWindowListener(false);
    },

    onOpenPress: function(e){
        this.showList(true);
        this.enableWindowListener(true);
        this.ui.input.focus();
        this.inputSelect.setViews(this.children);
        this.inputSelect.beginNavigationPhase();
    },

    enableWindowListener: function(bool){
        if(!bool){
            $(window).off('click', this.onWindowPress);
        }else{
            $(window).on('click', this.onWindowPress);
        }
    },

    elIsChild: function($el){
        return this.$el.has($el).length > 0;
    },

    onWindowPress: function(evt){
        if(!this.elIsChild($(evt.target))){
            this.showList(false);
            this.enableWindowListener(false);
        }
    },

    onShow: function(){
        InputSelectScrollableComposite.prototype.onShow.apply(this, arguments);
        this.showList(false);
    },

    hideList: function(){
        this.showList(false);
        $(window).off('click', this.hideList);
    },

    showList: function(bool){
        var $container = this.getItemViewContainer(this);
        if(!bool){
            $container.hide();
        }else{
            $container.show();
        }
    },
    onItemViewClick: function(view){
        this.model.set(view.model.toJSON());
    },
});

exports.SelectDemoComposite = SelectDemoComposite;

});
