define(function(require, exports, module){
    var _ = require('underscore');
    var Marionette = require('marionette');
    var KeyResponder = require('auf/ui/responders/keys');
    var MouseResponder = require('auf/ui/responders/mouse');
    var IndexManager = require('auf/ui/managers/index');
    var SingleFocusManager = require('auf/ui/managers/focus-single');
    var helpers = require('auf/utils/helpers');

    // Some requirements when using this control.
    //
    // This control does not apply any styles or
    // inject any markup.
    //
    // This control assumes that there will be some
    // collection of subviews stacked vertically.
    //
    // Up and Down keyboard based control will notify
    // you via 'focus' 'blur' events which one should currentlly
    // be focused. Mouse enter and mouse leave will also
    // generate 'focus' and 'blur' events. It is up to you to
    // decide how to handle that. This control does not apply
    // any styles. For example, if you receive a 'focus' event
    // you will receive the $view that wants focus, you could
    // choose to add a 'selected' class to that $view:
    //
    // $view.addClass('selected');
    //
    // When you receive a 'blur' event you would then:
    //
    // $view.removeClass('selected')
    //
    // This is just an example, the point being you MUST
    // make that decision on what 'focus' and 'blur' visually
    // mean for your application.
    //
    // Additionally, this control does not hide or show anything.
    // That decision on how to hide and show your collection
    // of choices is up to you.
    //
    // This control provides the following flow:
    // 1) You provide it an <input> that can accept user typing
    //    OR
    //    You provide an HTML Element with content contenteditable="true"
    //
    // 2) You listen for 'input' events. This contol will notify you
    //    when the length of the user input exceeds the set minLength
    //    and the debounce delay has expired.
    //
    // 3) You do something with that input you recieve. For example,
    //    you might make a call to a server to fetch choices.
    //
    // 4) Once you have the information for the choices you must decide
    //    how to visually put those choices on the screen and do so.
    //
    // 5) After you have displayed your choices to the user, you then
    //    need to tell this control about those items. There are 3 ways
    //    you can do this:
    //
    //    5a) An array of Backbone/Marionette views via setViews()
    //    5b) An array of jquery elements [$x, $y, $z] via setjQueryElements()
    //    5c) The result of a jQuery selector $('.items') via setElements()
    //
    // 6) Now that this control is aware of your choices you inform it
    //    that you would like to start the navigation process via:
    //    beginNavigationPhase(). The key and mouse handlers will
    //    be activated here and you will begin to receive 'focus', 'blur'
    //    'select', and 'cancel' events from this control. You must decide
    //    what those events visually mean for your application. Each
    //    'focus' and 'blur' event will provide the $jqElement that it
    //    applies to. In addition to 'focus' and 'blur' events you will
    //    also receive 'select' and 'cancel' events. Like 'focus' and
    //    'blur', 'select' also hands you a $jqElement. The $jqElement
    //    provided from a 'select' event will be the $jqElement of the
    //    last 'focus' event. A 'cancel' event does not provide a
    //    $jqElement. In summation the events you would be interested
    //    in after you call beginNavigationPhase() are:
    //    'focus', 'blur', 'select', 'cancel'. You are responsible for
    //    showing and hiding your choices.
    //
    // 7) At anytime during the navigation phase, which was started with
    //    the call to beginNavigationPhase(), it is your responsibility
    //    to also end the navigation phase with a call to
    //    endNavigationPhase(). You will typically end the navigation
    //    phase upon receiving a 'select' or 'cancel' event.
    //
    // 8) After ending the navigation phase, it is your responsibility
    //    to hide the selection choices from the user. Just as it was
    //    your responsibility to show them.
    //
    //    If you have a constant representation of this control
    //    it becomes trivial to wrap these steps into a
    //    reusable component. An example, -!!- hastily constructed -!!-
    //    is included below using a Marionette CollectionView
    //
    //
    //           var MyItemView = Marionette.ItemView.extend({
    //               tagName: 'li',
    //               template: '#my-item-view'
    //           });
    //
    //           var InputSelectExample = Marionette.Controller.extend({
    //
    //               initialize: function(){
    //                   this.myInputSelect = new InputSelect({
    //                       el: $('.input')
    //                   });
    //
    //                   this.myCollectionView = new Marionette.CollectionView({
    //                       el: '.items ul',
    //                       itemView: MyItemView,
    //                       collection: new Backbone.Collection()
    //                   });
    //
    //                   this.listenTo(this.myInputSelect, 'input', this.receivedInput);
    //
    //                   this.listenTo(this.myInputSelect, 'focus', function($el){
    //                       $el.addClass('focus');
    //                   });
    //
    //                   this.listenTo(this.myInputSelect, 'blur', function($el){
    //                       $el.removeClass('focus');
    //                   });
    //
    //                   this.listenTo(this.myInputSelect, 'select', function($el){
    //                       console.log('Wants select', $el.text(), $el);
    //                       this.myInputSelect.endNavigationPhase();
    //                       // reset() triggers a 'render' event
    //                       // on the collection view
    //                       this.myCollectionView.collection.reset();
    //                   });
    //
    //                   this.listenTo(this.myInputSelect, 'cancel', function($el){
    //                       console.log('Wants cancel');
    //                       this.myInputSelect.endNavigationPhase();
    //                       // reset() triggers a 'render' event
    //                       // on the collection view
    //                       this.myCollectionView.collection.reset();
    //                   });
    //               },
    //
    //               receivedInput: function(value){
    //                   this.listenTo(this.myCollectionView, 'render', this.collectionViewRendered);
    //                   this.myCollectionView.collection.reset([
    //                       new Backbone.Model({'label': 'foo'}),
    //                       new Backbone.Model({'label': 'bar'}),
    //                       new Backbone.Model({'label': 'baz'}),
    //                       ]);
    //               },
    //
    //               collectionViewRendered: function(){
    //                   var kids = this.myCollectionView.children.toArray()
    //                   this.stopListening(this.myCollectionView, 'render');
    //                   this.myInputSelect.setViews(kids);
    //                   this.myInputSelect.beginNavigationPhase();
    //               }
    //           });
    //
    //           new InputSelectExample();

    var InputSelect = Marionette.Controller.extend({

        el: null, // needs to be an <input> or contenteditable
        minLength: 2,
        debounceDelay: 300,

        initialize: function(options){

            _.extend(this, options);
            _.bindAll(this, 'receivedText',
                'mouseDidClick', 'mouseDidEnter', 'mouseDidExit',
                'keyNavigationKeyDown', 'keyNavigationReturn', 'keyNavigationEscape',
                'keyNavigationUp', 'keyNavigationDown', 'keyNavigationFirstMove');

            if(!this.el) return;
            this.$el = helpers.getElement(this.el);
            this.initializeKeyResponder();
        },

        initializeKeyResponder: function(){
            var actionEvent = _.debounce(this.receivedText, this.debounceDelay);

            this.inputResponder = new KeyResponder({
                el: this.$el,
                insertText: actionEvent,
                deleteBackward: actionEvent
            });
        },

        receivedText: function(responder, e){
            var $el = this.$el;
            var val = $el.is('input') ? $el.val() : $el.text();

            if (val && val.length > this.minLength){
                this.trigger('input', val);
            }
        },

        setViews: function(views){
            var elements = [];

            _.each(views, function(each){
                elements.push(each.$el[0]);
            });


            this.setElements($(elements));
        },

        setjQueryElements: function(jqElements){
            var elements = [];

            _.each(jqElements, function(each){
                elements.push(each[0]);
            });

            this.setElements($(elements));
        },

        setElements: function($elements){
            this._$elements = $elements;
        },

        beginNavigationPhase: function(){
            this.endNavigationPhase();
            this.initializeNavigationControls(this._$elements);
        },

        endNavigationPhase: function(){
            if(this.focusManager){
                this.focusManager.close();
            }

            if(this.indexManager){
                this.indexManager.close();
            }

            if(this.mouseResponder){
                this.mouseResponder.close();
            }

            if(this.keyNavigation){
                this.keyNavigation.close();
            }

            this.focusManager = null;
            this.indexManager = null;
            this.mouseResponder = null;
            this.keyNavigation = null;
        },

        initializeNavigationControls: function($elements){
            this.focusManager = new SingleFocusManager({
                el: $elements
            });

            this.indexManager = new IndexManager();
            this.indexManager.setLength($elements.length);

            this.mouseResponder = new MouseResponder({
                el: $elements,
                acceptsEnterExit: true,
                acceptsUpDown: true,
                mouseEntered: this.mouseDidEnter,
                mouseExited: this.mouseDidExit,
                mouseUp: this.mouseDidClick
            });

            this.keyNavigation = new KeyResponder({
                el: this.$el,
                keyDown: this.keyNavigationKeyDown,
                insertNewline: this.keyNavigationReturn,
                cancelOperation: this.keyNavigationEscape,
                moveUp: this.keyNavigationFirstMove,
                moveDown: this.keyNavigationFirstMove
             });

            this.listenTo(this.focusManager, 'focus', this.wantsFocus);
            this.listenTo(this.focusManager, 'blur', this.wantsBlur);
        },

        keyNavigationSupressLateralCursorMovement: function(e){
            // up | down
            // when the user presses up or down
            // prevent the cursor from jumping to the
            // left or right in the text field.
            if(/(38|40)/.test(e.keyCode)) e.preventDefault();

            // escape | return
            if(/(27|13)/.test(e.keyCode)) e.preventDefault();
        },

        keyNavigationKeyDown: function(responder, e){
            this.keyNavigationSupressLateralCursorMovement(e);
            this.keyNavigation.interpretKeyEvents([e]);
        },

        keyNavigationReturn: function(responder, e){
            this.wantsSelect(this.focusManager.val());
        },

        keyNavigationEscape: function(responder, e){
            this.trigger('cancel');
        },

        keyNavigationFirstMove: function(responder, e){
            if (e.keyCode == 40){ // down
                if(this.indexManager.getIndex() === 0){
                    this.focusManager.focusIndex(0);
                } else {
                    this.keyNavigationDown(responder, e);
                }
            } else {
                this.keyNavigationUp(responder, e);
            }

            this.keyNavigation.moveDown = this.keyNavigationDown;
            this.keyNavigation.moveUp = this.keyNavigationUp;
        },

        keyNavigationUp: function(responder, e){
            this.indexManager.previousIndex();
            this.focusManager.focusIndex(this.indexManager.getIndex());
        },

        keyNavigationDown: function(responder, e){
            this.indexManager.nextIndex();
            this.focusManager.focusIndex(this.indexManager.getIndex());
        },

        mouseDidClick: function(responder, e){
            if(responder.clickCount() > 0){
                // keep the input focused
                this.$el.focus();
                this.wantsSelect($(e.target));
            }
        },

        mouseDidEnter: function(responder, e){
            var $el = $(e.target);
            var index = this._$elements.index($el);
            this.indexManager.setIndex(index);
            this.focusManager.focus($el);
        },

        mouseDidExit: function(responder, e){
            this.focusManager.blur($(e.target));
        },

        wantsFocus: function($el){
            this.trigger('focus', $el);
        },

        wantsBlur: function($el){
            this.trigger('blur', $el);
        },

        wantsSelect: function($el){
            this.trigger('select', $el);
        },

        cleanup: function(){

        },

        onClose: function(){
            this.endNavigationControls();
            this._$elements = [];
        }

    });

// Exports
module.exports = InputSelect;

}); // eof define