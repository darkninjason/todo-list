define(function(require, exports, module) {

// Imports

var _                = require('underscore');
var Marionette       = require('marionette');
var InputSelect      = require('auf/ui/controls/forms/input-select');
var SpecHelpers      = require('lib/spec-helpers');
var EventHelpers     = SpecHelpers.Events;
var KeyCodes         = SpecHelpers.KeyCodes;

describe('Input Select Control', function() {

    // Object Vars

    var control;
    var myCollectionView;
    var MyItemView;
    var $ctx;
    var $input;
    var $collection;

    var inputHandler;
    var collectionHandler;
    // Setup

    beforeEach(function() {
        loadFixtures('control-input-select.html');

        $ctx = $('#jasmine-context');
        $input = $ctx.find('#input');
        $collection = $ctx.find('#collection');

        MyItemView = Marionette.ItemView.extend({
            template: '#itemView',
            tagName: 'li'
        });

        myCollectionView = new Marionette.CollectionView({
            el: $collection,
            itemView: MyItemView,
            collection: new Backbone.Collection()
        });

        control = new InputSelect({
            el: $input
        });

        inputHandler = {
            receivedInput: function(){
                myCollectionView.collection.reset([
                  new Backbone.Model({'label': 'foo'}),
                  new Backbone.Model({'label': 'bar'}),
                  new Backbone.Model({'label': 'baz'})
                  ]);
            }
        };

        collectionHandler = {
            collectionRendered: function(){
                var kids = myCollectionView.children.toArray();
                this.stopListening(myCollectionView, 'render');
                debugger;
            }
        };
    });


    // Test Suite
    it('throws error when no input provided', function(){
        //EventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        function badInit() {
            new InputSelect({});
        }

        expect(badInit).toThrow();
    });

    it('dispatches input event', function(){
        var flag = false;
        var obj = _.extend({
          receivedInput: jasmine.createSpy('receivedInput')
        }, Backbone.Events);

        obj.listenTo(control, 'input', obj.receivedInput);

        runs(function() {
            EventHelpers.insertChar($input, 'l');
            EventHelpers.insertChar($input, 'u');
            EventHelpers.insertChar($input, 'c');
            EventHelpers.insertChar($input, 'y');

            setTimeout(function() {
                flag = true;
            }, 300); // default debounce delay is 300
        });

        waitsFor(function() {
            return flag;
        }, 'No input received', 500);

        runs(function() {
            expect(obj.receivedInput).toHaveBeenCalled();
            expect(obj.receivedInput).toHaveBeenCalledWith(
                control, $input, 'lucy');
        });
    });

    it('selects first item with key', function() {
        var flag = false;
        var obj = _.extend({}, inputHandler, collectionHandler, Backbone.Events);
        obj.listenTo(control, 'input', obj.receivedInput);
        obj.listenTo(myCollectionView, 'render', obj.collectionRendered);


        runs(function() {
            EventHelpers.insertChar($input, 'l');
            EventHelpers.insertChar($input, 'u');
            EventHelpers.insertChar($input, 'c');
            EventHelpers.insertChar($input, 'y');

            setTimeout(function() {
                flag = true;
            }, 300); // default debounce delay is 300
        });

        waitsFor(function() {
            return flag;
        }, 'No input received', 500);

        runs(function() {
            // expect(obj.receivedInput).toHaveBeenCalled();
            // expect(obj.receivedInput).toHaveBeenCalledWith(
            //     control, $input, 'lucy');
        });
    });

    xit('moved slider handle a step', function() {
        var targetStep   = 2;
        var trackWidth   = getNormalizedTrackWidth($sliderHandle);
        var stepDistance = trackWidth / 30;
        var expectedCSS  = {'left': stepDistance * targetStep + 'px'};

        control.setStep(targetStep);

        expect(control.getStep()).toEqual(targetStep);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    xit('moved slider handle with mouse drag', function() {
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var targetPosition = 0.5;
        var moveToX        = trackWidth * targetPosition;
        var expectedCSS    = {'left': moveToX + 'px'};

        EventHelpers.simulateMouseDragged($sliderHandle, 0, 15, moveToX, 15);

        expect(control.getPosition()).toEqual(targetPosition);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    xit('moved slider handle with touch drag', function() {
        var trackWidth     = getNormalizedTrackWidth($sliderHandle);
        var targetPosition = 0.5;
        var moveToX        = trackWidth * targetPosition;
        var expectedCSS    = {'left': moveToX + 'px'};

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 15, moveToX, 15);

        expect(control.getPosition()).toEqual(0.5);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    xit('did not move slider handler past max', function() {
        var trackWidth  = getNormalizedTrackWidth($sliderHandle);
        var expectedCSS = {'left': trackWidth + 'px'};

        control.setPosition(0.5);
        control.setPosition(2.0);

        expect(control.getPosition()).toEqual(1);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    xit('did not move slider handle past min', function() {
        var expectedCSS = {'left': '0px'};

        control.setPosition(0.5);
        control.setPosition(-1);

        expect(control.getPosition()).toEqual(0);
        expect($sliderHandle).toHaveCss(expectedCSS);
    });

    xit('triggered events from mouse', function(){
        var dragStart = jasmine.createSpy('dragStart');
        var change    = jasmine.createSpy('change');
        var dragStop  = jasmine.createSpy('dragStop');

        control.on('drag:start', dragStart);
        control.on('change', change);
        control.on('drag:stop', dragStop);

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 0, 100, 0);

        expect(dragStart).toHaveBeenCalled();
        expect(change).toHaveBeenCalled();
        expect(dragStop).toHaveBeenCalled();
    });

    xit('triggered events from touch', function(){
        var dragStart = jasmine.createSpy('dragStart');
        var change    = jasmine.createSpy('change');
        var dragStop  = jasmine.createSpy('dragStop');

        control.on('drag:start', dragStart);
        control.on('change', change);
        control.on('drag:stop', dragStop);

        EventHelpers.simulateTouchDragged($sliderHandle, 0, 0, 100, 0);

        expect(dragStart).toHaveBeenCalled();
        expect(change).toHaveBeenCalled();
        expect(dragStop).toHaveBeenCalled();
    });

    xit('updates steps for position', function(){
        var expectedStep = 15;

        control.setPosition(0.5);

        expect(control.getStep()).toEqual(expectedStep);
    });

    xit('updates position for steps', function(){
        var expectedPosition = 0.5;

        control.setStep(15); // 30, above, /2 = 15

        expect(control.getPosition()).toEqual(expectedPosition);
    });

    xit('expects responders to be removed', function(){
        var trackWidth       = getNormalizedTrackWidth($sliderHandle);
        var expectedPosition = 200/trackWidth;

        // Drag the handle around a bit.
        EventHelpers.simulateMouseDragged($sliderHandle, 0, 0, 50, 0);
        EventHelpers.simulateTouchDragged($sliderHandle, 50, 0, 200, 0);

        expect(control.getPosition()).toEqual(expectedPosition);

        // Run close functionality.
        control.close();

        // Drag the handle around a bit.
        EventHelpers.simulateMouseDragged($sliderHandle, 200, 0, 50, 0);
        EventHelpers.simulateTouchDragged($sliderHandle, 50, 0, 0, 0);

        // When closed is called, no listeners should be active
        // Expect our position to be identical
        expect(control.getPosition()).toEqual(expectedPosition);
    });

}); // eof describe
}); // eof define
