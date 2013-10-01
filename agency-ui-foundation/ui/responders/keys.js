define(function(require, exports, module){

// Imports

var Marionette = require('vendor/marionette');
var _          = require('vendor/underscore');
var KeyInputManager = require('auf/ui/managers/key-input');

// Module

var KeyResponder = Marionette.Controller.extend({
    el: null,
    inputManager: null,

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_keyDown', '_keyUp');

        if(!this.el) return;
        var $el;

        if(_.isString(this.el)){
            $el = $(this.el);
        } else $el = this.el;

        this.$el = $el;

        if (!this.inputManager){
            this.inputManager = new KeyInputManager();
        }

        this.inputManager.responder = this;
        this.$el.on('keydown', {ctx: this}, this._keyDown);
        this.$el.on('keyup', {ctx: this}, this._keyUp);
    },

    _keyDown: function(e){
        this.keyDown(this, e);
    },

    _keyUp: function(e){
        this.keyUp(this, e);
    },

    keyUp: function(responder, e){
        // noop
    },

    keyDown: function(responder, e){
        this.interpretKeyEvents([e]);
    },

    insertNewline: function(responder, e){
        // noop
    },

    insertTab: function(responder, e){
        // noop
    },

    deleteBackward: function(responder, e){
        // noop
    },

    cancelOperation: function(responder, e){
        // noop
    },

    moveUp: function(responder, e){
        // noop
    },

    moveDown: function(responder, e){
        // noop
    },

    moveLeft: function(responder, e){
        // noop
    },

    moveRight: function(responder, e){
        // noop
    },

    insertText: function(responder, e){
        // noop
    },

    interpretKeyEvents: function (events){
        this.inputManager.interpretKeyEvents(events);
    },

    executeCommandByName: function(name, e){
        try {
            this[name](this, e);
        } catch (err) {
            // noop
        }
    },

    onClose: function(){
        this.$el.off('keydown', this._keyDown);
        this.$el.off('keyup', this._keyUp);
    }

});

// Exports

// module.exports.KeyInputManager = KeyInputManager;
module.exports = KeyResponder;

});
