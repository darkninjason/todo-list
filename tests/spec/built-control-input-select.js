define(function(require, exports, module) {

// Imports

var _                = require('underscore');
var marionette       = require('marionette');
var InputSelect      = require('built/core/controls/forms/input-select').InputSelect;
var helpers          = require('built/core/utils/helpers');
var focus            = require('built/core/events/focus');
var events           = require('built/core/events/event');
var SpecHelpers      = require('lib/spec-helpers');
var eventHelpers     = SpecHelpers.Events;
var KeyCodes         = SpecHelpers.KeyCodes;

describe('Input Select Control', function() {

    // Object Vars

    var control;
    var myCollectionView;
    var MyItemView;
    var $ctx;
    var $input;
    var $items;
    var $collection;
    var DEBOUNCE_DELAY = 50;

    var inputHandler;
    var collectionHandler;
    var collectionHandlerjQueryElements;
    // Setup

    beforeEach(function() {
        loadFixtures('control-input-select.html');

        $ctx = $('#jasmine-context');
        $input = $ctx.find('#input');
        $collection = $ctx.find('#collection');

        MyItemView = marionette.ItemView.extend({
            template: '#itemView',
            tagName: 'li'
        });

        myCollectionView = new marionette.CollectionView({
            el: $collection,
            itemView: MyItemView,
            collection: new Backbone.Collection()
        });

        control = new InputSelect({
            el: $input,
            debounceDelay: DEBOUNCE_DELAY
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

                var elements = _.map(kids, function(each){
                    return each.$el[0];
                });

                control.setElements($(elements));
                control.beginNavigationPhase();
                this.hasRendered = true;
                $items = $collection.find('li');
            }
        };

        collectionHandlerjQueryElements = {
            collectionRendered: function(){
                var kids = $collection.find('li');
                this.stopListening(myCollectionView, 'render');
                control.setElements(kids);
                control.beginNavigationPhase();
                this.hasRendered = true;
                $items = $collection.find('li');
            }
        };
    });

    afterEach(function(){
        control.close();
    });


    // Helpers

    function getEventHandler() {
        var obj =  _.extend({}, inputHandler, collectionHandler, Backbone.Events);
        obj.listenTo(control, 'input', obj.receivedInput);
        obj.listenTo(myCollectionView, 'render', obj.collectionRendered);

        return obj;
    }

    function getEventHandlerJqueryElements() {
        var obj =  _.extend({}, inputHandler, collectionHandlerjQueryElements, Backbone.Events);
        obj.listenTo(control, 'input', obj.receivedInput);
        obj.listenTo(myCollectionView, 'render', obj.collectionRendered);

        return obj;
    }


    // Test Suite
    it('throws error when no input provided', function(){
        //eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        function badInit() {
            new InputSelect({});
        }

        expect(badInit).toThrow();
    });

    it('registers BUILT ID for input', function(){
        // in beforeEach we create an InputSelect which
        // means the $input element should have a BUILT ID.
        expect(helpers.getElementId($input)).not.toEqual(undefined);
    });

    it('registers BUILT IDs for list elements', function(){
        var obj = getEventHandler();

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {

            var $items = $collection.find('li');
            expect($items.length).toEqual(3);
            expect(helpers.getElementId($items.eq(0))).not.toEqual(undefined);
            expect(helpers.getElementId($items.eq(1))).not.toEqual(undefined);
            expect(helpers.getElementId($items.eq(2))).not.toEqual(undefined);
        });
    });


    it('sets default values on init', function(){
        var obj = new InputSelect({el: $input});
        expect(obj.options.debounceDelay).toEqual(obj._defaults.debounceDelay);
        expect(obj.options.minLength).toEqual(obj._defaults.minLength);
        obj.close();
    });

    it('sets debounceDelay on init', function(){
        var obj = new InputSelect({el: $input, debounceDelay: 1000});
        expect(obj.options.debounceDelay).toEqual(1000);
        obj.close();
    });

    it('sets minLength on init', function(){
        var obj = new InputSelect({el: $input, minLength: 30});
        expect(obj.options.minLength).toEqual(30);
        obj.close();
    });

    it('sets debounceDelay and minLength on init', function(){
        var obj = new InputSelect({el: $input, debounceDelay: 1000, minLength: 30});
        expect(obj.options.minLength).toEqual(30);
        expect(obj.options.debounceDelay).toEqual(1000);
        obj.close();
    });

    // Input Event
    it('dispatches \'input\' event', function(){
        var flag = false;
        var obj = _.extend({
          receivedInput: jasmine.createSpy('receivedInput')
        }, Backbone.Events);

        obj.listenTo(control, 'input', obj.receivedInput);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');

            setTimeout(function() {
                flag = true;
            }, DEBOUNCE_DELAY);
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

    // Key Events
    it('disptches \'focus.FOCUS\' event for first item with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('disptches \'focus.FOCUS_KEY\' event for first item with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_KEY, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('disptches \'focus.FOCUS\' event for first item set with jquery elements with down arrow key', function() {

        var obj = getEventHandlerJqueryElements();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('disptches \'focus.FOCUS\' event for last item with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('disptches \'focus.FOCUS_KEY\' event for last item with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_KEY, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('disptches \'focus.FOCUS\' event for middle item with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('disptches \'focus.FOCUS\' event for middle item with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('cycles \'focus.FOCUS\' events with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.length).toEqual(4);
            expect(focusSpy.mostRecentCall.args[1]).toEqual($items.eq(0));
        });
    });

    it('cycles \'focus.FOCUS\' events with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.length).toEqual(4);
            expect(focusSpy.mostRecentCall.args[1]).toEqual($items.eq(2));
        });
    });

    it('disptches \'focus.BLUR\' event for first item with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('disptches \'focus.BLUR\' event for last item with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('disptches \'focus.BLUR\' event for middle item with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('disptches \'focus.BLUR\' event for middle item with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('cycles \'focus.BLUR\' events with down arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.length).toEqual(4);
            expect(focusSpy.mostRecentCall.args[1]).toEqual($items.eq(0));
        });
    });

    it('cycles \'focus.BLUR\' events with up arrow key', function() {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.length).toEqual(4);
            expect(focusSpy.mostRecentCall.args[1]).toEqual($items.eq(2));
        });
    });

    it('dispatches \'event.SELECT\' event for first item with return key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.return);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('dispatches \'event.SELECT\' event for last item with return key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.return);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('dispatches \'event.SELECT\' event for middle item with return key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.return);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('dispatches \'event.CANCEL\' event with escape key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.CANCEL, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.escape);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control);
        });
    });

    it('does not dispatch \'focus.FOCUS\' event with key down or up', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    it('does not dispatch \'focus.BLUR\' event with key down or up', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    it('does not dispatch \'event.SELECT\' event with key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.return);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    it('does not dispatch \'event.CANCEL\' event with key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.CANCEL, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                eventHelpers.simulateKeyDown($input, KeyCodes.escape);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    // Mouse Events

    it('dispatches \'focus.FOCUS\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('dispatches \'focus.FOCUS_MOUSE\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_MOUSE, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('dispatches \'focus.BLUR\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(0));
                eventHelpers.simulateMouseExit($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
        });
    });

    it('dispatches \'event.SELECT\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseDown($items.eq(1));
                eventHelpers.simulateMouseUp($items.eq(1));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(1));
        });
    });

    it('dispatches \'focus.FOCUS\' events for all items with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(0));
                eventHelpers.simulateMouseEnter($items.eq(1));
                eventHelpers.simulateMouseEnter($items.eq(2));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy.calls.length).toEqual(3);
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(1));
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('dispatches \'focus.BLUR\' events for all items with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(0));
                eventHelpers.simulateMouseExit($items.eq(0));

                eventHelpers.simulateMouseEnter($items.eq(1));
                eventHelpers.simulateMouseExit($items.eq(1));

                eventHelpers.simulateMouseEnter($items.eq(2));
                eventHelpers.simulateMouseExit($items.eq(2));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy.calls.length).toEqual(3);
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(0));
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(1));
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });

    it('does not dispatch \'focus.FOCUS\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateMouseEnter($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    it('does not dispatch \'focus.BLUR\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateMouseEnter($items.eq(0));
                eventHelpers.simulateMouseExit($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    it('does not dispatch \'event.SELECT\' event with mouse', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                control.endNavigationPhase();
                eventHelpers.simulateMouseDown($items.eq(0));
                eventHelpers.simulateMouseUp($items.eq(0));
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    // Mouse & Key Events

    it('dispatches \'focus.FOCUS\' event with mouse then down arrow key', function() {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        runs(function() {
            eventHelpers.insertChar($input, 'l');
            eventHelpers.insertChar($input, 'u');
            eventHelpers.insertChar($input, 'c');
            eventHelpers.insertChar($input, 'y');
        });

        waitsFor(function() {
            if(obj.hasRendered){
                eventHelpers.simulateMouseEnter($items.eq(1));
                eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
                return true;
            }
            return false;
        }, 'No input received', 500);

        runs(function() {
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(1));
            expect(actionSpy).toHaveBeenCalledWith(control, $items.eq(2));
        });
    });



}); // eof describe
}); // eof define
