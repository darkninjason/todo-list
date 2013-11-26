define(function(require, exports, module){

var _                  = require('underscore');
var marionette         = require('marionette');
var KeyResponder       = require('built/core/responders/keys').KeyResponder;
var IndexManager       = require('built/core/managers/index').IndexManager;
var SingleFocusManager = require('built/core/managers/focus-single').SingleFocusManager;
var helpers            = require('built/core/utils/helpers');
var focus              = require('built/core/events/focus');
var events             = require('built/core/events/event');
var data               = require('built/core/events/data');

var Select = marionette.Controller.extend({
    EVENT_SELECTED: 'selected',
    _searchText:'',
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
    },

    insertText: function(responder, e){
        var char = String.fromCharCode(e.keyCode);
        //todo see what they are searching for after a delay
        this._searchText += char;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_.bind(function(){
            this.searchForText(this._searchText);
            this._searchText = '';
        },this), this.searchTimeout);
        if(/(32)/.test(e.keyCode)) e.preventDefault();
    },

    insertNewline: function(responder, e){
        var obj = this.focusManager.getFocusedObject();
        this.trigger(this.EVENT_SELECTED, $(obj));
        this.hideList();
    },

    cancelOperation: function(responder, e){
        this.hideList();
    },

    moveUp: function(responder, e){
        this._hasRunOnce = true;
        this.indexManager.previousIndex();
        this.focusManager.focusIndex(this.indexManager.getIndex());
        e.preventDefault();
    },

    moveDown: function(responder, e){
        if(!this._hasRunOnce){
            this._hasRunOnce = true;
        }else{
            this.indexManager.nextIndex();
        }
        this.focusManager.focusIndex(this.indexManager.getIndex());
        e.preventDefault();
    },

    setElements: function($elements){
        this.closeManagers();
        helpers.registerElement($elements);
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
        this.trigger(focus.FOCUS, this, $(obj));
    },

    wantsBlur: function(sender, obj){
        this.trigger(focus.BLUR, this, $(obj));
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
