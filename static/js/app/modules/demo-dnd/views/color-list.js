define(function(require, exports, module) {

var DragDropList = require('built/core/controls/dragdrop/list').DragDropList;

var ColorDropList = DragDropList.extend({

        getDragDataForElement: function($el){
            //console.log(helpers.getElementId($el));
            if($el.hasClass('red')){
                return 'red';
            }

            if($el.hasClass('green')){
                return 'green';
            }

            if($el.hasClass('blue')){
                return 'blue';
            }

            if($el.hasClass('purple')){
                return 'purple';
            }

            return 'unknown';
        },

        getDragImage: function($el){
            var $src = $('#drag-icon');
            var icon = document.createElement('img');
            icon.src = $src.attr('src');
            icon.width = $src.attr('width');
            icon.height = $src.attr('height');

            //return false;
            return {
                image: icon,
                offsetX: 5,
                offsetY: 18
            };
        },

        renderPlaceholderForData: function(data){
            return $('<li class="node placeholder"></li>');
        },

        renderDropElementForData: function(data){
            return $('<li class="node ' + data + '"></li>');
        },

        dropResponderDraggingEntered: function(responder, e){
            responder.$el.parent().addClass('highlight');
        },

        dropResponderDraggingExited: function(responder, e){
            responder.$el.parent().removeClass('highlight');
        }

    });

exports.ColorDropList = ColorDropList;

});
