define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

// Module

var SpecHelpers = {

    Events: {
        simulateEvent: function($el, type, payload) {
            var e = $.Event(type);

            _.extend(e, payload);
            $el.trigger(e);

            return e;
        },

        simulateMouseEvent: function($el, type, x, y) {
            var payload = {
                pageX: x,
                pageY: y,
                target: $el[0],
                currentTarget: $el[0]
            };

            return this.simulateEvent($el, type, payload);
        },

        simulateMouseEnter: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseenter', x, y);
        },

        simulateMouseExit: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseleave', x, y);
        },

        simulateMouseDown: function($el, x, y){
            return this.simulateMouseEvent($el, 'mousedown', x, y);
        },
        simulateMouseMove: function($el, x, y){
            return this.simulateMouseEvent($el, 'mousemove', x, y);
        },
        simulateMouseUp: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseup', x, y);
        },
        simulateMouseDragged: function($el, startX, startY, endX, endY){
            var events = [];

            events.push( this.simulateMouseDown( $el, startX, startY ));
            events.push( this.simulateMouseMove( $el, endX, endY     ));
            events.push( this.simulateMouseUp  ( $el, endX, endY     ));

            return events;
        },

        simulateTouchEvent: function($el, type, x, y) {
            var touches = [
                {
                    pageX: x,
                    pageY: y,
                    target: $el[0]
                }
            ];

            var payload = {
                originalEvent: {touches: touches},
                target: $el[0],
                currentTarget: $el[0]
            }

            return this.simulateEvent($el, type, payload);
        },
        simulateTouchStart: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchstart', x, y);
        },
        simulateTouchMove: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchmove', x, y);
        },
        simulateTouchEnd: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchend', x, y);
        },
        simulateTouchCancel: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchcancel', x, y);
        },
        simulateTouchDragged: function($el, startX, startY, endX, endY){
            var events = [];

            events.push( this.simulateTouchStart( $el, startX, startY ));
            events.push( this.simulateTouchMove ( $el, endX, endY     ));
            events.push( this.simulateTouchEnd  ( $el, endX, endY     ));

            return events;
        }
    }

}; // eof SpecHelpers

// Exports
module.exports = SpecHelpers;

}); // eof define
