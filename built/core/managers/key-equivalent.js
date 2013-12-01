define(function(require, exports, module){

// Imports
var $ = require('jquery');
var _ = require('underscore');

var KeyFlag = {
    'META':  1 << 0, // jquery normalization name
    'SHIFT': 1 << 1,
    'CTRL':  1 << 2,
    'ALT':   1 << 3
};

var FlagAlias = {
    'command': 'META',
    'option': 'ALT'
};

var KeyMap = {
'backspace':   8,
      'tab':   9,
    'enter':  13,
   'return':  13,
    'shift':  16,
     'ctrl':  17,
      'alt':  18,
 'capslock':  20,
      'esc':  27,
    'space':  32,
   'pageup':  33,
 'pagedown':  34,
      'end':  35,
     'home':  36,
     'left':  37,
       'up':  38,
    'right':  39,
     'down':  40,
   'insert':  45,
   'delete':  46
     // 'meta':  91,
     // 'meta':  93,
     // 'meta': 224
} ;

// Module
var KeyEquivalentManager = function(keyMap){

    this.responder = null;
    this.map = {};
};

KeyEquivalentManager.prototype.register = function(mask, charCode, action){
    var map = this.map;
    map[mask] = map[mask] || {};

    var region = map[mask];
    region[charCode] = action;
};

KeyEquivalentManager.prototype.registerWithString = function(string, action){
    var parts = _.map(string.split('+'), function(value){
        return $.trim(value);
    });

    var length = parts.length;
    var lastChar = parts[length - 1];
    var i;
    var charCode;

    // the user sent in a single letter. We do nothing.
    // If they wish to use a single letter they should be using the
    // KeyResponder.
    if (length == 1 && parts[0].length == 1){
        return;
    }

    var mask = 0;

    for(i=0; i <= length - 2; i++){
        mask = mask | this.modifierStringToCode(parts[i]);
    }

    if(lastChar.length > 1){
        charCode = KeyMap[lastChar];
    } else {

        if(mask & KeyFlag.SHIFT){
            lastChar = lastChar.toUpperCase();
        }

        charCode = lastChar.charCodeAt();
    }

    this.register(mask, charCode, action);
};

KeyEquivalentManager.prototype.modifierStringToCode = function(value){
    var alias = FlagAlias[value.toLowerCase()];
    var code;

    if(alias){
       code = alias;
    } else {
        code = value.toUpperCase();
    }

    var result = KeyFlag[code];
    return result === undefined ? 0 : result;
};

KeyEquivalentManager.prototype.hashEvent = function(e){
    var alt = e.altKey     ? KeyFlag.ALT   : 0;
    var ctrl = e.ctrlKey   ? KeyFlag.CTRL  : 0;
    var meta = e.metaKey   ? KeyFlag.META  : 0;
    var shift = e.shiftKey ? KeyFlag.SHIFT : 0;

    return alt | ctrl | meta | shift ;
};

KeyEquivalentManager.prototype.performKeyEquivalent = function(e){

    var key = this.hashEvent(e);
    var region = this.map[key];

    if(!region) return false;

    var action = region[e.which];

    if (action){
        action(this.responder, e);
        return true;
    }

    return false;
};

// Exports

exports.KeyEquivalentManager = KeyEquivalentManager;
exports.KeyFlag = KeyFlag;

}); // eof define
