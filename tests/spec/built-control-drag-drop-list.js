define(function(require, exports, module) {

var helpers = require('built/core/utils/helpers');
var DragDropList = require('built/core/controls/dragdrop/list').DragDropList
var getElementBounds = require('built/ui/helpers/dom').getElementBounds;
var spechelpers  = require('lib/spec-helpers');
var eventHelpers = spechelpers.Events;

// Imports

describe('Drag Drop List Control', function() {

    // Set Up

    beforeEach(function() {
        loadFixtures('control-drag-drop-list.html');
        $source = $('#source ul');
        $destination = $('#destination ul');
    });

    afterEach(function() {
    });

    var $source, $destination;
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

        getDragImageForElement: function($el){
            return false;
        },

        renderPlaceholderForElement: function($el){
            return $('<li class="row placeholder"> --> HERE <--</li>');
        },

        renderDropElementForData: function(data){
            return $('<li class="row ' + data + '"></li>');
        },

        dropResponderDraggingEntered: function(responder, e){
            responder.$el.parent().addClass('highlight');
        },

        dropResponderDraggingExited: function(responder, e){
            responder.$el.parent().removeClass('highlight');
        }

    });

    function elementPoint($el, x, y){
        var bounds = getElementBounds($el);
        return {x: (bounds.left + x), y: (bounds.top + y)};
    }

    function getDataTransfer(dataType, data){
        var dt = EventHelpers.dragAndDropDataTransfer();

        if(dataType){
            dt.setData(dataType, data);
        }

        return dt;
    }



    // Helpers

    /*
    var $source = $('#source ul');
    var $destination = $('#destination ul');

    l1 = new ColorDropList();
    l1.setDropElement($source);
    l1.reset($source.children());

    l2 = new ColorDropList();
    l2.setDropElement($destination);
    // l2.reset($destination.children());
    */

    // Test Suite
    it('Drop Element Receives BUILT ID', function(){
        expect(helpers.getElementId($source)).toEqual(undefined);

        var l1 = new ColorDropList();
        l1.setDropElement($source);

        expect(helpers.getElementId($source)).not.toEqual(undefined);
    });

    it('Drag Elements Receive BUILT IDs', function(){
        _.each($source.children(), function(each){
            expect(helpers.getElementId($(each))).toEqual(undefined);
        });

        var l1 = new ColorDropList();
        l1.reset($source.children());

        _.each($source.children(), function(each){
            expect(helpers.getElementId($(each))).not.toEqual(undefined);
        });
    });

    it('should call getDragDataForElement on drag start', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);

        l1.reset($preDragChildren);

        spyOn(l1, 'getDragDataForElement').andCallThrough();
        eventHelpers.simulateDragStart($drag, null, 20, 20);

        expect(l1.getDragDataForElement).toHaveBeenCalledWith($drag);
    });

    it('should call getDragImageForElement on drag start', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);

        l1.reset($preDragChildren);

        spyOn(l1, 'getDragImageForElement').andCallThrough();
        eventHelpers.simulateDragStart($drag, null, 20, 20);

        expect(l1.getDragImageForElement).toHaveBeenCalledWith($drag);
    });

    it('should replace the first element on drag start with placeholder', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        l1.reset($preDragChildren);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        runs(function(){
            eventHelpers.simulateDragStart($drag, null, point.x, point.y);

            setTimeout(function(){
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(0)).toHaveClass('placeholder');
        });
    });

    it('should replace the second element on drag start with placeholder', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(1);
        var flag = false;

        l1.reset($preDragChildren);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        runs(function(){
            eventHelpers.simulateDragStart($drag, null, point.x, point.y);

            setTimeout(function(){
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(1)).toHaveClass('placeholder');
        });
    });

    it('should replace the third element on drag start with placeholder', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(2);
        var flag = false;

        l1.reset($preDragChildren);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        runs(function(){
            eventHelpers.simulateDragStart($drag, null, point.x, point.y);

            setTimeout(function(){
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(2)).toHaveClass('placeholder');
        });
    });

    it('should replace the fourth element on drag start with placeholder', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(3);
        var flag = false;

        l1.reset($preDragChildren);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        runs(function(){
            eventHelpers.simulateDragStart($drag, null, point.x, point.y);

            setTimeout(function(){
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(3)).toHaveClass('placeholder');
        });
    });

    it('should drop first element in first position', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint = elementPoint($source, 5, 5);
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 0;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        runs(function(){
            var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
            var dt = e.originalEvent.dataTransfer;

            // because drag start is deferred, let the drag start
            // actually fire. before continuing
            setTimeout(function(){
                expect(l1.listManager.getArray().length).toEqual(3);

                eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
                expect($source.children().eq(dropPosition)).toHaveClass('placeholder');
                eventHelpers.simulateDrop($source, dt, dropPoint.x, dropPoint.y);

                // update the drop effect
                // to ensure the drop counted as a drop
                dt.dropEffect = 'move';

                eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
        });
    });

    it('should drop first element in second position', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 1;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        runs(function(){
            var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
            var dt = e.originalEvent.dataTransfer;

            // because drag start is deferred, let the drag start
            // actually fire. before continuing
            setTimeout(function(){
                var $obj = $source.children().eq(dropPosition);
                var objBounds = getElementBounds($obj);

                dropPoint = elementPoint($obj, 10, (objBounds.height / 2) + 5);

                eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
                expect($source.children().eq(dropPosition)).toHaveClass('placeholder');

                eventHelpers.simulateDrop($source, dt);

                // update the drop effect
                // to ensure the drop counted as a drop
                dt.dropEffect = 'move';
                eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
        });
    });

    it('should drop first element in third position', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 2;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        runs(function(){
            var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
            var dt = e.originalEvent.dataTransfer;

            // because drag start is deferred, let the drag start
            // actually fire. before continuing
            setTimeout(function(){
                var $obj = $source.children().eq(dropPosition);
                var objBounds = getElementBounds($obj);

                dropPoint = elementPoint($obj, 10, (objBounds.height / 2) + 5);

                eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
                expect($source.children().eq(dropPosition)).toHaveClass('placeholder');

                eventHelpers.simulateDrop($source, dt);

                // update the drop effect
                // to ensure the drop counted as a drop
                dt.dropEffect = 'move';
                eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
        });
    });

    it('should drop first element in last position', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        runs(function(){
            var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
            var dt = e.originalEvent.dataTransfer;

            // because drag start is deferred, let the drag start
            // actually fire. before continuing
            setTimeout(function(){
                var $last = $source.children().eq(3);
                var lastBounds = getElementBounds($last);

                dropPoint = elementPoint($last, 10, (lastBounds.height / 2) + 5);

                eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
                expect($source.children().eq(3)).toHaveClass('placeholder');

                eventHelpers.simulateDrop($source, dt);

                // update the drop effect
                // to ensure the drop counted as a drop
                dt.dropEffect = 'move';
                eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
                flag = true;
            }, 30);
        });

        waitsFor(function(){
            return flag;
        }, 100);

        runs(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(3)).toHaveClass('red');
        });
    });

}); // Eof describe
}); // Eof define




