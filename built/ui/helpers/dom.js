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

function modelFromElement($element, Model, map){
    Model = Model || Backbone.Model;
    $element = getElement($element);
}

exports.modelFromElement = modelFromElement;
exports.getElement = getElement;

});
