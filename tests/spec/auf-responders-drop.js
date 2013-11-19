define(function(require, exports, module) {

// Imports

var DropResponder = require('auf/ui/responders/drop').DropResponder;
var spechelpers  = require('lib/spec-helpers');
var EventHelpers = spechelpers.Events;

describe('Drop Responder', function() {

    var $context;
    var $actionTargets;

    // Set Up

    beforeEach(function() {
        loadFixtures('responder-drop.html');
        $context = $('#jasmine-jquery-context');
        $dropZone = $context.find('ul');
        $actionTargets = $context.find('ul li');

    });

    afterEach(function() {
    });

    // Helpers

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getManager(augments) {
        return new DropResponder(getOptions(augments));
    }

    function getDataTransfer(dataType, data){
        var dt = EventHelpers.dragAndDropDataTransfer();

        if(dataType){
            dt.setData(dataType, data);
        }

        return dt;
    }

    // Test Suite

    it('expects \'draggingEntered\' to be called on dragenter', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager({el:$dropZone});

        manager.draggingEntered = actionSpy;

        var dataTransfer = getDataTransfer(manager.dataType, 'lucy');
        var e = EventHelpers.simulateDragEnter(
            // $el,    dataTransfer, x,  y
            $dropZone, dataTransfer, 10, 20);

        var mouse = manager.getMousePosition();
        expect(mouse.x).toEqual(10);
        expect(mouse.y).toEqual(20);


        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1].currentTarget).toEqual($dropZone[0]);

    });

    it('expects \'draggingEntered\' NOT to be called on dragenter', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager({el:$dropZone});

        manager.draggingEntered = actionSpy;

        var dataTransfer = getDataTransfer('foo.bar.baz', 'lucy');
        var e = EventHelpers.simulateDragEnter(
            // $el,    dataTransfer, x,  y
            $dropZone, dataTransfer, 10, 10);

        expect(actionSpy).not.toHaveBeenCalled();
    });

    it('expects \'draggingUpdated\' to be called on dragover', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager({el:$dropZone});

        manager.draggingUpdated = actionSpy;

        var dataTransfer = EventHelpers.dragAndDropDataTransfer();
        dataTransfer.setData(manager.dataType, 'lucy');

        var e = EventHelpers.simulateDragOver(
            // $el,    dataTransfer, x,  y
            $dropZone, dataTransfer, 10, 20);

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);

        var mouse = manager.getMousePosition();
        expect(mouse.x).toEqual(10);
        expect(mouse.y).toEqual(20);

        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1].currentTarget).toEqual($dropZone[0]);

    });

    it('expects \'draggingExited\' to be called on dragleave', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager({el:$dropZone});

        manager.draggingExited = actionSpy;

        var dataTransfer = EventHelpers.dragAndDropDataTransfer();
        dataTransfer.setData(manager.dataType, 'lucy');

        var e = EventHelpers.simulateDragLeave(
            // $el,    dataTransfer, x,  y
            $dropZone, dataTransfer, 10, 20);

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);

        var mouse = manager.getMousePosition();
        expect(mouse.x).toEqual(10);
        expect(mouse.y).toEqual(20);

        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1].currentTarget).toEqual($dropZone[0]);

    });

    it('expects \'performDragOperation\' to be called on drop', function(){

        var actionSpy = jasmine.createSpy('eventSpy');
        var manager = getManager({el:$dropZone});

        manager.performDragOperation = actionSpy;

        var dataTransfer = EventHelpers.dragAndDropDataTransfer();
        dataTransfer.setData(manager.dataType, 'lucy');

        var e = EventHelpers.simulateDrop(
            // $el,    dataTransfer, x,  y
            $dropZone, dataTransfer);

        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.length).toEqual(1);

        expect(manager.getData()).toEqual('lucy');
        expect(actionSpy.mostRecentCall.args[0]).toEqual(manager);
        expect(actionSpy.mostRecentCall.args[1].currentTarget).toEqual($dropZone[0]);

    });

}); // Eof describe
}); // Eof define
