define(function(require, exports, module) {

var helpers = require('built/core/utils/helpers');
var DragDropList = require('built/core/controls/dragdrop/list').DragDropList;
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

        getDragImage: function(){
            return false;
        },

        renderPlaceholderForData: function($el){
            return $('<li class="row placeholder"> --> HERE <--</li>');
        },

        renderDropElementForData: function(data){
            return $('<li class="row ' + data + '"></li>');
        },

        dropResponderDraggingEntered: function(responder, e){
            responder.$el.parent().addClass('highlight');
        },

        dropResponderDraggingExited: function(responder, e){
            // if setDropElement() is not done,
            // this will throw an error because responder
            // will be null. the dropResponder is only
            // initialized once setDropElement is called.

            if(!_.isNull(responder)){
                responder.$el.parent().removeClass('highlight');
            }

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

    function actionTimeout(delay){
        delay = delay || 30;

        var deferred = $.Deferred();

        setTimeout(function() {
            deferred.resolve();
        }, delay);

        return deferred.promise();
    }

    // Helpers

    it('throws with default implementation of getDragDataForElement', function(){
        var $drag = $source.children().eq(0);

        // these methods also throw,
        // so implement no-op defaults
        var l1 = new DragDropList({
            renderPlaceholderForData: function(){},
            renderDropElementForData: function(){}
        });

        l1.setDropElement($source);
        l1.reset($source.children());

        function throwable() {
            eventHelpers.simulateDragStart($drag, null, 20, 20);
        }

        expect(throwable).toThrow();
    });

    it('throws with default implementation of renderPlaceholderForData', function(){
        var $drag = $source.children().eq(0);

        // these methods also throw,
        // so implement no-op defaults
        var l1 = new DragDropList({
            getDragDataForElement: function(){},
            renderDropElementForData: function(){}
        });

        l1.setDropElement($source);
        l1.reset($source.children());

        function throwable() {
            eventHelpers.simulateDragStart($drag, null, 20, 20);
        }

        expect(l1.renderPlaceholderForData).toThrow();
    });

    it('throws with default implementation of renderDropElementForData', function(done){
        var $drag = $source.children().eq(0);
        var flag = false;

        // these methods also throw,
        // so implement, what is effectively, no-op defaults
        var l1 = new DragDropList({
            getDragDataForElement: function(){ return ''; },
            renderPlaceholderForData: function(){ return $('<p></p>'); }
        });

        l1.setDropElement($source);
        l1.reset($source.children());
        spyOn(l1, 'renderDropElementForData').and.callThrough();

        var dt, e, dropPoint;

        var dragPoint = elementPoint($drag, 10, 10);
        e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
            expect(l1.listManager.getArray().length).toEqual(3);
            dropPoint = elementPoint($source, 10, 10);
            eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
        })
        .then(function(){
            function throwable() {
                eventHelpers.simulateDrop($source, dt, dropPoint.x, dropPoint.y);
            }

            expect(throwable).toThrow();
            done();
        });
    });

    it('return false for default implementation of getDragImage', function(){
        var $drag = $source.children().eq(0);

        // these methods also throw,
        // so implement no-op defaults
        var l1 = new DragDropList({
            getDragDataForElement: function(){ return ''; },
            renderPlaceholderForData: function(){ return $('<p></p>'); }
        });

        l1.setDropElement($source);
        l1.reset($source.children());
        spyOn(l1, 'getDragImage').and.callThrough();

        eventHelpers.simulateDragStart($drag, null, 20, 20);

        expect(l1.getDragImage).toHaveBeenCalled();
    });

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
        l1.setDropElement($source);

        _.each($source.children(), function(each){
            expect(helpers.getElementId($(each))).not.toEqual(undefined);
        });
    });

    it('should call getDragDataForElement on drag start', function(){

        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'getDragDataForElement').and.callThrough();
        eventHelpers.simulateDragStart($drag, null, 20, 20);

        expect(l1.getDragDataForElement.calls.mostRecent().args[0][0]).toEqual($drag[0]);
    });

    it('should call getDragImage on drag start', function(){
        var l1 = new ColorDropList();
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);

        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'getDragImage').and.callThrough();
        eventHelpers.simulateDragStart($drag, null, 20, 20);

        expect(l1.getDragImage).toHaveBeenCalled();
    });

    it('should call renderPlaceholderForData', function(done){
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'renderPlaceholderForData').and.callThrough();

        var dragPoint  = elementPoint($drag, 10, 10);
        eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);

        actionTimeout().then(function(){
            expect(l1.renderPlaceholderForData).toHaveBeenCalled();
            done();
        });
    });

    it('should call dropResponderDraggingEntered', function(done){
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'dropResponderDraggingEntered').and.callThrough();

        var dragPoint  = elementPoint($drag, 10, 10);
        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        var dropPoint = elementPoint($source, 10, 10);
        eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);

        actionTimeout().then(function(){
            expect(l1.dropResponderDraggingEntered).toHaveBeenCalled();
            done();
        });
    });

    it('should call dropResponderDraggingExited', function(done){
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'dropResponderDraggingExited').and.callThrough();
        eventHelpers.simulateDragStart($drag, null, 20, 20);

        actionTimeout(l1.exitDelay + 50).then(function(){
            expect(l1.dropResponderDraggingExited).toHaveBeenCalled();
            done();
        });
    });

    it('should call renderDropElementForData', function(done){
        var $preDragChildren = $source.children();
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        spyOn(l1, 'renderDropElementForData').and.callThrough();

        var dragPoint  = elementPoint($drag, 10, 10);
        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
            var dropPoint = elementPoint($source, 10, 10);
            eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);

            eventHelpers.simulateDrop($source, dt, dropPoint.x, dropPoint.y);
            dt.dropEffect = 'move';

            eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
        })
        .then(function(){
            expect(l1.renderDropElementForData).toHaveBeenCalled();
            done();
        });
    });

    it('should replace the first element on drag start with placeholder', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);


        eventHelpers.simulateDragStart($drag, null, point.x, point.y);

        // drag start is a deferred call,
        // so we need to do these tests async.

        actionTimeout().then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(0)).toHaveClass('placeholder');
            done();
        });
    });

    it('should replace the second element on drag start with placeholder', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(1);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        eventHelpers.simulateDragStart($drag, null, point.x, point.y);

        actionTimeout().then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(1)).toHaveClass('placeholder');
            done();
        });
    });

    it('should replace the third element on drag start with placeholder', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(2);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        eventHelpers.simulateDragStart($drag, null, point.x, point.y);

        actionTimeout().then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(2)).toHaveClass('placeholder');
            done();
        });
    });

    it('should replace the fourth element on drag start with placeholder', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(3);
        var flag = false;

        var l1 = new ColorDropList();
        l1.reset($preDragChildren);
        l1.setDropElement($source);

        expect(l1.listManager.getArray().length).toEqual(4);
        var point = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        eventHelpers.simulateDragStart($drag, null, point.x, point.y);

        actionTimeout().then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(3);
            expect($postDragChildren.eq(3)).toHaveClass('placeholder');
            done();
        });
    });

    it('should drop first element in first position', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint = elementPoint($source, 5, 5);
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 0;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        // because drag start is deferred, let the drag start
        // actually fire. before continuing

        actionTimeout()
        .then(function(){
            expect(l1.listManager.getArray().length).toEqual(3);

            eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
            expect($source.children().eq(dropPosition)).toHaveClass('placeholder');
            eventHelpers.simulateDrop($source, dt, dropPoint.x, dropPoint.y);

            // update the drop effect
            // to ensure the drop counted as a drop
            dt.dropEffect = 'move';

            eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
        })
        .then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
            done();
        });
    });

    it('should drop first element in second position', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 1;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
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
        })
        .then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
            done();
        });
    });

    it('should drop first element in third position', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);
        var dropPosition = 2;

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        // because drag start is deferred, let the drag start
        // actually fire. before continuing
        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
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
        })
        .then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(dropPosition)).toHaveClass('red');
            done();
        });
    });

    it('should drop first element in last position', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        expect(l1.listManager.getArray().length).toEqual(4);

        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
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
        })
        .then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(3)).toHaveClass('red');
            done();
        });
    });

    it('should drag element from source and drop in destination', function(done){
        var $preDragSourceChildren = $source.children();
        var $preDragDestinationChildren = $destination.children();
        var $drag = $preDragSourceChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragSourceChildren);

        var l2 = new ColorDropList();
        l2.setDropElement($destination);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);

        expect($preDragSourceChildren.length).toEqual(4);
        expect($preDragDestinationChildren.length).toEqual(0);

        // drag start is a deferred call,
        // so we need to do these tests async.
        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout()
        .then(function(){
            dropPoint = elementPoint($destination, 10, 75);

            eventHelpers.simulateDragOver($destination, dt, dropPoint.x, dropPoint.y);
            expect($destination.children().eq(0)).toHaveClass('placeholder');

            eventHelpers.simulateDrop($destination, dt);

            // update the drop effect
            // to ensure the drop counted as a drop
            dt.dropEffect = 'move';
            eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
        })
        .then(function(){
            $postDragSourceChildren = $source.children();
            $postDragDestinationChildren = $destination.children();

            expect($postDragSourceChildren.length)
                  .toEqual(3);

            expect($postDragDestinationChildren.length)
                  .toEqual(1);

            expect($postDragSourceChildren.eq(0))
                  .toHaveClass('green');

            expect($postDragDestinationChildren.eq(0))
                  .toHaveClass('red');

            done();
        });
    });

    it('should restore first element on drag end', function(done){
        var $preDragChildren = $source.children();
        var $postDragChildren;
        var $drag = $preDragChildren.eq(0);
        var flag = false;

        var l1 = new ColorDropList();
        l1.setDropElement($source);
        l1.reset($preDragChildren);

        var dropPoint;
        var dragPoint  = elementPoint($drag, 10, 10);

        // drag start is a deferred call,
        // so we need to do these tests async.
        var e = eventHelpers.simulateDragStart($drag, null, dragPoint.x, dragPoint.y);
        var dt = e.originalEvent.dataTransfer;

        actionTimeout(l1.exitDelay + 20)
        .then(function(){
            dropPoint = elementPoint($source, 10, 10);

            // set the placeholder
            eventHelpers.simulateDragOver($source, dt, dropPoint.x, dropPoint.y);
            expect($source.children().eq(0)).toHaveClass('placeholder');

            // update the drop effect
            // so it looks like nothing happened.
            dt.dropEffect = 'none';
            eventHelpers.simulateDragEnd($drag, dt, dragPoint.x, dragPoint.y);
        })
        .then(function(){
            $postDragChildren = $source.children();
            expect(l1.listManager.getArray().length).toEqual(4);
            expect($postDragChildren.eq(0)).toHaveClass('red');
            done();
        });
    });

}); // Eof describe
}); // Eof define




