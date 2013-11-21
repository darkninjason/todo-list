define(function (require, exports, module) {

var marionette = require('marionette');

function getElement(value){
    var $el;

    if(_.isString(value)){
        $el = $(value);
    } else {
        $el = value;
    }

    return $el;
}


function objectFromElement($element, map){
    var key;
    map = map || {};
    $element = getElement($element);
    var node = $element[0];
    var attrs = {};

    for(var i=0; i < node.attributes.length; i++){
        var obj = node.attributes[i];
        key = map[obj.name] || obj.name;
        attrs[key] = obj.value;
    }
    key = map['content'] || 'content';
    attrs[key] = $element.text();
    return attrs;
}

function modelFromElement($element, Model, map){
    Model = Model || Backbone.Model;
    map = map || {};
    $element = getElement($element);
    var obj = objectFromElement($element, map);
    return new Model(obj);
}

exports.modelFromElement = modelFromElement;
exports.objectFromElement = objectFromElement;
exports.getElement = getElement;

});
