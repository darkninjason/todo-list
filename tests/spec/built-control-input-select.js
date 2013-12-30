define(function(require, exports, module) {

// Imports

var _                = require('underscore');
var marionette       = require('marionette');
var InputSelect      = require('built/core/controls/forms/input-select').InputSelect;
var helpers          = require('built/core/utils/helpers');
var focus            = require('built/core/events/focus');
var events           = require('built/core/events/event');
var data             = require('built/core/events/data');
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
        obj.listenTo(control, data.DATA, obj.receivedInput);
        obj.listenTo(myCollectionView, 'render', obj.collectionRendered);

        return obj;
    }

    function getEventHandlerJqueryElements() {
        var obj =  _.extend({}, inputHandler, collectionHandlerjQueryElements, Backbone.Events);
        obj.listenTo(control, data.DATA, obj.receivedInput);
        obj.listenTo(myCollectionView, 'render', obj.collectionRendered);

        return obj;
    }

    function insertText(string, $el){
        $el = $el || $input;

        _.each(string, function(char){
            eventHelpers.insertChar($el, char);
        });
    }

    function actionDebounceDelay(text){
        var deferred = $.Deferred();

        insertText(text);

        setTimeout(function() {
            deferred.resolve();
        }, DEBOUNCE_DELAY);

        return deferred.promise();
    }

    function actionRendered(text, obj){
        var deferred = $.Deferred();

        insertText(text);

        var id = setInterval(function(){

            if(obj.hasRendered){
                clearInterval(id);
                deferred.resolve();
            }
        }, 30);

        return deferred.promise();
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

    it('registers BUILT IDs for list elements', function(done){
        var obj = getEventHandler();

        actionRendered('lucy', obj).then(function(){
            var $items = $collection.find('li');
            expect($items.length).toEqual(3);
            expect(helpers.getElementId($items.eq(0))).not.toEqual(undefined);
            expect(helpers.getElementId($items.eq(1))).not.toEqual(undefined);
            expect(helpers.getElementId($items.eq(2))).not.toEqual(undefined);
            done();
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
    it('dispatches \'input\' event', function(done){
        var flag = false;
        var obj = _.extend({
          receivedInput: jasmine.createSpy('receivedInput')
        }, Backbone.Events);

        obj.listenTo(control, data.DATA, obj.receivedInput);

        actionDebounceDelay('lucy').then(function(){
            expect(obj.receivedInput).toHaveBeenCalled();
            expect(obj.receivedInput).toHaveBeenCalledWith(
                control, $input, 'lucy');
            done();
        });
    });

    // Key Events
    it('disptches \'focus.FOCUS\' event for first item with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('disptches \'focus.FOCUS_KEY\' event for first item with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_KEY, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('disptches \'focus.FOCUS\' event for last item with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('disptches \'focus.FOCUS_KEY\' event for last item with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_KEY, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('disptches \'focus.FOCUS\' event for middle item with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('disptches \'focus.FOCUS\' event for middle item with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('cycles \'focus.FOCUS\' events with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.count()).toEqual(4);
            expect(focusSpy.calls.mostRecent().args[1]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('cycles \'focus.FOCUS\' events with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.count()).toEqual(4);
            expect(focusSpy.calls.mostRecent().args[1]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('disptches \'focus.BLUR\' event for first item with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('disptches \'focus.BLUR\' event for last item with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('disptches \'focus.BLUR\' event for middle item with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('disptches \'focus.BLUR\' event for middle item with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('cycles \'focus.BLUR\' events with down arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.count()).toEqual(4);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('cycles \'focus.BLUR\' events with up arrow key', function(done) {
        var obj = getEventHandler();
        var focusSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, focusSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(focusSpy).toHaveBeenCalled();
            expect(focusSpy.calls.count()).toEqual(4);
            expect(focusSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('dispatches \'event.SELECT\' event for first item with return key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.return);
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('dispatches \'event.SELECT\' event for last item with return key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.return);
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('dispatches \'event.SELECT\' event for middle item with return key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.return);
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('dispatches \'event.CANCEL\' event with escape key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('actionSpy');

        obj.listenTo(control, events.CANCEL, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.escape);
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            done();
        });
    });

    it('does not dispatch \'focus.FOCUS\' event with key down or up', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('does not dispatch \'focus.BLUR\' event with key down or up', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.upArrow);
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('does not dispatch \'event.SELECT\' event with key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.return);
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('does not dispatch \'event.CANCEL\' event with key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.CANCEL, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
            eventHelpers.simulateKeyDown($input, KeyCodes.escape);
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    // Mouse Events

    it('dispatches \'focus.FOCUS\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('dispatches \'focus.FOCUS_MOUSE\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS_MOUSE, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('dispatches \'focus.BLUR\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(0));
            eventHelpers.simulateMouseExit($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(0)[0]);
            done();
        });
    });

    it('dispatches \'event.SELECT\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseDown($items.eq(1));
            eventHelpers.simulateMouseUp($items.eq(1));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.mostRecent().args[1][0]).toEqual($items.eq(1)[0]);
            done();
        });
    });

    it('dispatches \'focus.FOCUS\' events for all items with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(0));
            eventHelpers.simulateMouseEnter($items.eq(1));
            eventHelpers.simulateMouseEnter($items.eq(2));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.argsFor(0)[1][0]).toEqual($items.eq(0)[0]);
            expect(actionSpy.calls.argsFor(1)[1][0]).toEqual($items.eq(1)[0]);
            expect(actionSpy.calls.argsFor(2)[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('dispatches \'focus.BLUR\' events for all items with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(0));
            eventHelpers.simulateMouseExit($items.eq(0));

            eventHelpers.simulateMouseEnter($items.eq(1));
            eventHelpers.simulateMouseExit($items.eq(1));

            eventHelpers.simulateMouseEnter($items.eq(2));
            eventHelpers.simulateMouseExit($items.eq(2));
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.argsFor(0)[1][0]).toEqual($items.eq(0)[0]);
            expect(actionSpy.calls.argsFor(1)[1][0]).toEqual($items.eq(1)[0]);
            expect(actionSpy.calls.argsFor(2)[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

    it('does not dispatch \'focus.FOCUS\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateMouseEnter($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('does not dispatch \'focus.BLUR\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.BLUR, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateMouseEnter($items.eq(0));
            eventHelpers.simulateMouseExit($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('does not dispatch \'event.SELECT\' event with mouse', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, events.SELECT, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            control.endNavigationPhase();
            eventHelpers.simulateMouseDown($items.eq(0));
            eventHelpers.simulateMouseUp($items.eq(0));
        })
        .then(function(){
            expect(actionSpy).not.toHaveBeenCalled();
            done();
        });
    });

    // Mouse & Key Events

    it('dispatches \'focus.FOCUS\' event with mouse then down arrow key', function(done) {
        var obj = getEventHandler();
        var actionSpy = jasmine.createSpy('focusSpy');

        obj.listenTo(control, focus.FOCUS, actionSpy);

        actionRendered('lucy', obj)
        .then(function(){
            eventHelpers.simulateMouseEnter($items.eq(1));
            eventHelpers.simulateKeyDown($input, KeyCodes.downArrow);
        })
        .then(function(){
            expect(actionSpy).toHaveBeenCalled();
            expect(actionSpy.calls.mostRecent().args[0]).toEqual(control);
            expect(actionSpy.calls.argsFor(0)[1][0]).toEqual($items.eq(1)[0]);
            expect(actionSpy.calls.argsFor(1)[1][0]).toEqual($items.eq(2)[0]);
            done();
        });
    });

}); // eof describe
}); // eof define
