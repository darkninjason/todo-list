define(function (require, exports, module) {

var marionette = require('marionette');
var getElement = require('built/core/utils/helpers').getElement;

function modelFromElement($element, Model, map){
    Model = Model || Backbone.Model;
    $element = getElement($element);
}

exports.modelFromElement = modelFromElement;

});
