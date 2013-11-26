define(function(require, exports, module){

var _                  = require('underscore');
var marionette         = require('marionette');
var KeyResponder       = require('built/core/responders/keys').KeyResponder;
var IndexManager       = require('built/core/managers/index').IndexManager;
var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;
var helpers            = require('built/core/utils/helpers');
var focus              = require('built/core/events/focus');
var event              = require('built/core/events/event');
var data               = require('built/core/events/data');

var Select = marionette.Controller.extend({
    _searchText:'',
    searchTimeout: 300,
    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this,
            'onWindowPress',
            'insertText',
            'insertNewline',
            'cancelOperation',
            'moveUp',
            'moveDown',
            'wantsFocus',
            'wantsBlur',
            'onOpenPress',
            'onOptionClicked'
            );
        this.keyResponder = new KeyResponder({
            el: this.$el,
            insertText:this.insertText,
            insertNewline:this.insertNewline,
            cancelOperation:this.cancelOperation,
            moveUp:this.moveUp,
            moveDown:this.moveDown
        });
        this.$el.on('click', this.onOpenPress);
    },

    insertText: function(responder, e){
        var char = String.fromCharCode(e.keyCode);
        this._searchText += char;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_.bind(function(){
            this.searchForText(this._searchText);
            this._searchText = '';
        },this), this.searchTimeout);
        if(/(32)/.test(e.keyCode)) e.preventDefault();
    },

    insertNewline: function(responder, e){
        this.hideList();
        this._triggerSelected();
    },

    _triggerSelected: function(){
        var obj = this.focusManager.getFocusedObject();
        this.trigger(event.SELECT, $(obj));
        this._hasRunOnce = true;
    },

    cancelOperation: function(responder, e){
        this.hideList();
    },

    moveUp: function(responder, e){
        e.preventDefault();
        this._hasRunOnce = true;
        this.indexManager.previousIndex();
        this.focusManager.focusIndex(this.indexManager.getIndex());
    },

    moveDown: function(responder, e){
        e.preventDefault();
        if(!this._hasRunOnce){
            this._hasRunOnce = true;
        }else{
            this.indexManager.nextIndex();
        }
        this.focusManager.focusIndex(this.indexManager.getIndex());
    },

    onClose: function(){
        this.enableWindowListener(false);
        this.keyResponder.close();
        this.indexManager.close();
        this.focusManager.close();
        this._$elements.off('click', this.onOptionClicked);
        this.$el.off('click', this.onOpenPress);
    },

    onOpenPress: function(e){
        this.showList();
        this.enableWindowListener(true);
    },

    enableWindowListener: function(bool){
        bool = _.isUndefined(bool) ? true : bool;
        if(bool){
            $(window).on('click', this.onWindowPress);
        }else{
            $(window).off('click', this.onWindowPress);
        }
    },

    elIsChild: function($el){
        return this.$el.has($el).length > 0;
    },

    onWindowPress: function(evt){
        if(!this.elIsChild($(evt.target))){
            this.hideList();
            this.enableWindowListener(false);
        }
    },

    onOptionClicked: function(e){
        this.setSelectedOption(e.currentTarget);
        this.hideList();
    },

    setSelectedOption: function(obj){
        this.focusManager.focus(obj);
        var index = this.focusManager.getFocusedIndexes()[0];
        this.indexManager.setIndex(index);
        this._triggerSelected();
    },

    setElements: function($elements){
        this._$elements = $elements;
        this.closeManagers();
        helpers.registerElement($elements);
        $elements.on('click', this.onOptionClicked);
        this.focusManager = new SingleFocusManager({
            list:$elements.toArray()
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
        this.indexManager.setLength($elements.length);
    },

    closeManagers: function(){
        if(this.focusManager){
            this.focusManager.close();
        }

        if(this.indexManager){
            this.indexManager.close();
        }

        this.focusManager = null;
        this.indexManager = null;
    },

    wantsFocus: function(sender, obj){
        this.trigger(focus.FOCUS, this, obj);
    },

    wantsBlur: function(sender, obj){
        this.trigger(focus.BLUR, this, obj);
    },

    hideList: function(){
        // need to implement
    },

    showList: function(){
        // need to implement
    },

    searchForText: function(text){
        // need to implement based on your search setup
    },

});

// Exports
exports.Select = Select;

}); // eof define
