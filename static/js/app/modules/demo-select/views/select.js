define(function (require, exports, module) {

var marionette = require('marionette');

var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;
var IndexManager = require('built/core/managers/index').IndexManager;
var KeyResponder = require('built/core/responders/keys').KeyResponder;
var Select = require('built/core/controls/forms/select').Select;
var helpers = require('built/core/utils/helpers');
var focus = require('built/core/events/focus');
var SelectItem = require('./select-item').SelectItem;
var template = require('hbs!tpl/select/composite');

require('stickit');

var SelectDemoComposite = marionette.CompositeView.extend({
    template : template,
    itemView : SelectItem,
    searchText: '',
    searchTimeout: 300,
    itemViewContainer : '.list-group',
    className : 'built-select',
    ui:{
        list:'.list-group'
    },
    events:{
        'click .btn':'onOpenPress'
    },
    bindings:{
        '.title':'value'
    },
    initialize : function(){
        _.bindAll(this,
            'hideList',
            'showList',
            'searchForText');
        this.model = new Backbone.Model();
        this.listenToOnce(this.model, 'change', this.onModelChange);
        this.select = new Select({
            $el:this.$el,
            hideList:this.hideList,
            showList:this.showList,
            searchForText:this.searchForText,
        });
        this.listenTo(this.select, focus.FOCUS, this.onOptionFocus);
        this.listenTo(this.select, focus.BLUR, this.onOptionBlur);
    },

    onShow: function(){
        var elements = [];
        var views = this.children.toArray();
        _.each(views, function(each){
            elements.push(each.$el[0]);
        });
        this.select.setElements($(elements));
        var marionetteDict = this.marionetteDict = {};
        _.each(views, function(each){
            var key = helpers.getElementId(each.$el);
            marionetteDict[key] = each;
        });
        this.hideList();
    },

    hideList: function(){
        this.ui.list.hide();
    },

    showList: function(){
        this.ui.list.show();
    },

    searchForText: function(){

    },

    onOptionFocus: function(sender, obj){
        var key = helpers.getElementId($(obj));
        var view = this.marionetteDict[key];
        view.trigger(focus.FOCUS);
    },

    onOptionBlur: function(sender, obj){
        var key = helpers.getElementId($(obj));
        var view = this.marionetteDict[key];
        view.trigger(focus.BLUR);
    },

    // onModelChange: function(){
    //     this.stickit();
    // },

    // _keyNavigationSupressPageMovement: function(e){
    //     if(/(38|40|27|13)/.test(e.keyCode)) e.preventDefault();
    // },

    // insertText: function(responder, e){
    //     var char = String.fromCharCode(e.keyCode);
    //     //todo see what they are searching for after a delay
    //     this.searchText += char;
    //     clearTimeout(this.timeout);
    //     this.timeout = setTimeout(_.bind(function(){
    //         this.searchForText(this.searchText);
    //         this.searchText = '';
    //     },this), this.searchTimeout);
    //     if(/(32)/.test(e.keyCode)) e.preventDefault();
    // },

    // searchForText: function(label){
    //     label = label.toLowerCase();
    //     var coll = this.children.toArray();
    //     var lowestIndex = null;
    //     var view;
    //     for(var i=0; i < coll.length; i ++){
    //         view = coll[i];
    //         var model = view.model;
    //         var index = model.get('value').indexOf(label);

    //         if(index === 0){
    //             break;
    //         }
    //         view = null;
    //     }
    //     if(view){
    //         this.focusOnView(view);
    //     }
    // },

    // onItemClick: function(view){
    //     this.focusOnView(view);
    //     this.hideList();
    //     this.model.set(view.model.toJSON());
    // },

    // focusOnView: function(view){
    //     this.focusManager.focus(view.$el);
    //     var count = 0;
    //     var children = this.children.toArray();
    //     for(var i=0; i < children.length; i++){
    //         if(children[i] == view){
    //             break;
    //         }
    //         count ++;
    //     }
    //     this.indexManager.setIndex(count);
    // },

    // insertNewline: function(responder, e){
    //     var obj = this.focusManager.getFocusedObject();
    //     var key = helpers.getElementId($(obj));
    //     var itemView = this.marionetteDict[key];
    //     this.model.set(itemView.model.toJSON());
    //     this.hideList();
    // },

    // cancelOperation: function(responder, e){
    //     this.hideList();
    // },

    // moveUp: function(responder, e){
    //     this.hasRunOnce = true;
    //     this.indexManager.previousIndex();
    //     this.focusManager.focusIndex(this.indexManager.getIndex());
    //     this._dispatchFocus($(this.focusManager.getFocusedObject()));
    //     e.preventDefault();
    // },

    // moveDown: function(responder, e){
    //     if(!this.hasRunOnce){
    //         this.hasRunOnce = true;
    //     }else{
    //         this.indexManager.nextIndex();
    //     }
    //     this.focusManager.focusIndex(this.indexManager.getIndex());
    //     // this._dispatchFocus($(this.focusManager.getFocusedObject()));
    //     e.preventDefault();
    // },

    // onClose: function(){
    //     this.enableWindowListener(false);
    //     this.keyResponder.close();
    // },

    // onOpenPress: function(e){
    //     this.showList(true);
    //     this.enableWindowListener(true);
    // },

    // enableWindowListener: function(bool){
    //     if(!bool){
    //         $(window).off('click', this.onWindowPress);
    //     }else{
    //         $(window).on('click', this.onWindowPress);
    //     }
    // },

    // elIsChild: function($el){
    //     return this.$el.has($el).length > 0;
    // },

    // onWindowPress: function(evt){
    //     if(!this.elIsChild($(evt.target))){
    //         this.showList(false);
    //         this.enableWindowListener(false);
    //     }
    // },

    // onShow: function(){
    //     // this.showList(false);
    //     // this.buildManagers();
    // },

    // buildManagers: function(){
    //     var elements = [];
    //     var views = this.children.toArray();
    //     _.each(views, function(each){
    //         elements.push(each.$el[0]);
    //     });

    //     helpers.registerElement($(elements));
    //     var marionetteDict = this.marionetteDict = {};
    //     _.each(views, function(each){
    //         var key = helpers.getElementId(each.$el);
    //         marionetteDict[key] = each;
    //         elements.push(each.$el[0]);
    //     });
    //     this.focusManager = new SingleFocusManager({
    //         list:elements
    //     });
    //     this.listenTo(
    //             this.focusManager,
    //             focus.FOCUS,
    //             this.wantsFocus);

    //         this.listenTo(
    //             this.focusManager,
    //             focus.BLUR,
    //             this.wantsBlur);
    //     this.indexManager = new IndexManager();
    //     this.indexManager.setLength(elements.length);
    // },

    // wantsFocus: function(sender, obj){
    //     var key = helpers.getElementId($(obj));
    //     var itemView = this.marionetteDict[key];
    //     itemView.setFocus();
    // },

    // wantsBlur: function(sender, obj){
    //     var key = helpers.getElementId($(obj));
    //     var itemView = this.marionetteDict[key];
    //     itemView.setBlur();
    // },

    // hideList: function(){
    //     this.showList(false);
    //     $(window).off('click', this.hideList);
    // },

    // showList: function(bool){
    //     var $container = this.getItemViewContainer(this);
    //     if(!bool){
    //         $container.hide();
    //     }else{
    //         $container.show();
    //     }
    // }
});

exports.SelectDemoComposite = SelectDemoComposite;

});
