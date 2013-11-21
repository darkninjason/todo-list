define(function(require, exports, module){

// Imports

var Marionette      = require('marionette');
var _               = require('underscore');
var KeyInputManager = require('built/core/managers/key-input').KeyInputManager;
var helpers         = require('built/core/utils/helpers');

// Module

var KeyResponder = Marionette.Controller.extend({
    el: null,
    inputManager: null,

    initialize: function(options){
        _.extend(this, options);
        _.bindAll(this, '_keyDown', '_keyUp');

        this.$el = helpers.registerElement(this.el);

        if (!this.inputManager){
            this.inputManager = new KeyInputManager();
        }

        this.inputManager.responder = this;
        this.$el.on('keydown.built.responders.keys', {ctx: this}, this._keyDown);
        this.$el.on('keyup.built.responders.keys', {ctx: this}, this._keyUp);
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
        this.$el.off('keydown.built.responders.keys', this._keyDown);
        this.$el.off('keyup.built.responders.keys', this._keyUp);
    }

});

// Exports

// module.exports.KeyInputManager = KeyInputManager;
module.exports.KeyResponder = KeyResponder;

});
