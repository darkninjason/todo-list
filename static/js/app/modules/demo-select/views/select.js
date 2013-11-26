define(function (require, exports, module) {

var marionette = require('marionette');

var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;
var IndexManager = require('built/core/managers/index').IndexManager;
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var helpers = require('built/core/utils/helpers');
var focus = require('built/core/events/focus');
var SelectItem = require('./select-item').SelectItem;
var template = require('hbs!tpl/select/composite');

require('stickit');

var SelectDemoComposite = marionette.CompositeView.extend({
    template : template,
    itemView : SelectItem,
    itemViewContainer : '.list-group',
    className : 'built-select',
    events:{
        'click .btn':'onOpenPress'
    },
    bindings:{
        '.title':'value'
    },
    initialize : function(){
        this.model = new Backbone.Model();
        this.on('itemview:click', this.onItemViewClick);
        _.bindAll(this,
            'onWindowPress',
            'insertText',
            'insertNewline',
            'cancelOperation',
            'moveUp',
            'moveDown',
            'wantsFocus',
            'wantsBlur'
            );
        this.keyResponder = new KeyResponder({
            el: this.$el,
            insertText:this.insertText,
            insertNewline:this.insertNewline,
            cancelOperation:this.cancelOperation,
            moveUp:this.moveUp,
            moveDown:this.moveDown
        });
        this.listenToOnce(this.model, 'change', this.onModelChange);
        this.on('itemview:click', this.onItemClick);
    },

    onModelChange: function(){
        this.stickit();
    },

    _keyNavigationSupressPageMovement: function(e){
        if(/(38|40|27|13)/.test(e.keyCode)) e.preventDefault();
    },

    insertText: function(responder, e){
        var char = String.fromCharCode(e.keyCode);
        //todo see what they are searching for after a delay
        if(/(32)/.test(e.keyCode)) e.preventDefault();
    },

    onItemClick: function(view){
        this.focusManager.focus(view.$el);
        var count = 0;
        var children = this.children.toArray();
        for(var i=0; i< children.length; i++){
            if(children[i] == view){
                break;
            }
            count ++;
        }
        this.indexManager.setIndex(count);
        this.hideList();
        // this.focusManager.setFocused($el);
    },

    insertNewline: function(responder, e){
        var obj = this.focusManager.getFocusedObject();
        var key = helpers.getElementId($(obj));
        var itemView = this.marionetteDict[key];
        this.model.set(itemView.model.toJSON());
        this.hideList();
    },

    cancelOperation: function(responder, e){
        this.hideList();
    },

    moveUp: function(responder, e){
        this.hasRunOnce = true;
        this.indexManager.previousIndex();
        this.focusManager.focusIndex(this.indexManager.getIndex());
        this._dispatchFocus($(this.focusManager.getFocusedObject()));
        e.preventDefault();
    },

    moveDown: function(responder, e){
        if(!this.hasRunOnce){
            this.hasRunOnce = true;
        }else{
            this.indexManager.nextIndex();
        }
        this.focusManager.focusIndex(this.indexManager.getIndex());
        // this._dispatchFocus($(this.focusManager.getFocusedObject()));
        e.preventDefault();
    },

    onClose: function(){
        this.enableWindowListener(false);
        this.keyResponder.close();
    },

    onOpenPress: function(e){
        this.showList(true);
        this.enableWindowListener(true);
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
        this.showList(false);
        this.buildManagers();
    },

    buildManagers: function(){
        var elements = [];
        var views = this.children.toArray();
        _.each(views, function(each){
            elements.push(each.$el[0]);
        });

        helpers.registerElement($(elements));
        var marionetteDict = this.marionetteDict = {};
        _.each(views, function(each){
            var key = helpers.getElementId(each.$el);
            marionetteDict[key] = each;
            elements.push(each.$el[0]);
        });
        this.focusManager = new SingleFocusManager({
            list:elements
        });
        this.listenTo(
                this.focusManager,
                focus.FOCUS,
                this.wantsFocus);

            this.listenTo(
                this.focusManager,
                focus.BLUR,
                this.wantsBlur);
        this.indexManager = new IndexManager();
        this.indexManager.setLength(elements.length);
    },

    wantsFocus: function(sender, obj){
        var key = helpers.getElementId($(obj));
        var itemView = this.marionetteDict[key];
        itemView.setFocus();
    },

    wantsBlur: function(sender, obj){
        var key = helpers.getElementId($(obj));
        var itemView = this.marionetteDict[key];
        itemView.setBlur();
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
