define(function(require, exports, module){
    var Marionette = require('marionette'),
        stickit = require('stickit'),
        _ = require('underscore');

    var SelectionManager =  Marionette.ItemView.extend({
        selectedClass: null,
        delegate: null,
        $selectedElement: null,
        allowsDeselect: false,

        initialize: function(options){
            _.extend(this, options);
            _.bindAll(this, 'wasClicked');
            this.$el.on('click', this.wasClicked);

            this.selectedClass = options.selectedClass || 'selected';

            if (!this.delegate){
                this.delegate = {selectionManagerShouldSelect: function($el){ return true; }};
            }
        },

        wasClicked: function(e){
            this.selectElement($(e.target));
        },

        val: function(){
            if(this.$selectedElement){
                return this.getValueForElement(this.$selectedElement);
            }

            return null;
        },

        getValueForElement: function($el){
            return $el.data('select');
        },

        getElementWithValue: function(value){
            return this.$el.siblings('[data-select="' + value + '"]');
        },

        selectValue: function(value){
            var $el = this.getElementWithValue(value);
            this.selectElement($el);
        },

        selectIndex: function(index){
            var $target = $(this.$el[index]);
            this.selectElement($target);
        },

        selectElement: function($el){
            if(this.delegate.selectionManagerShouldSelect($el)){

                this.trigger('before:select', $el);
                if(this.$selectedElement &&
                   $el[0] == this.$selectedElement[0] &&
                   this.allowsDeselect){

                    $el.removeClass(this.selectedClass);
                    this.$selectedElement = null;

                } else {
                    $el.addClass(this.selectedClass);
                    this.$selectedElement = $el;
                }

                this.trigger('after:select', $el);
            }
        },

        onClose: function(){
            this.$el.off('click', this.wasClicked);
        }
    });

    var SingleSelectionManager = Marionette.ItemView.extend({
        selectionManager: null,

        initialize: function(options){
            _.extend(this, options);

            if(!this.selectionManager){

                this.selectionManager = new SelectionManager({
                    el: this.$el,
                    allowsDeselect: options.allowsDeselect,
                    selectedClass: options.selectedClass,
                    delegate: options.delegate || this});
            }

            this.listenTo(this.selectionManager, 'before:select', this.selectionManagerBeforeSelect);
            this.listenTo(this.selectionManager, 'after:select', this.selectionManagerAfterSelect);
        },

        val: function(){
            return this.selectionManager.val();
        },

        selectIndex: function(value){
            this.selectionManager.selectIndex(value);
        },

        selectValue: function(value){
            this.selectionManager.selectValue(value);
        },

        selectionManagerBeforeSelect: function($el){
            var $selectedElement = this.selectionManager.$selectedElement;

            if($selectedElement &&  $el[0] != $selectedElement[0]){
                $selectedElement.removeClass(this.selectionManager.selectedClass);
            }

            this.trigger('before:select', $el);
        },

        selectionManagerAfterSelect: function($el){
            this.trigger('after:select', $el);
        },

        selectionManagerShouldSelect: function($el){

            var selectionManager = this.selectionManager;
            var $selectedElement = selectionManager.$selectedElement;

            if($selectedElement && $el[0] == $selectedElement[0]){
                if(selectionManager.allowsDeselect === false){
                    return false;
                }
            }

            return true;
        },

        onClose: function(){
            this.selectionManager.close();
        }
    });

    var ModelBoundSingleSelectionManager = SingleSelectionManager.extend({
        initialize: function(options){
            SingleSelectionManager.prototype.initialize.call(this, options);
            this.initializeModelBinding();
        },

        initializeModelBinding: function(){

            if(!this.bindings.getVal){
                this.bindings.getVal = this.getBindingValue;
            }

            this.selectValue(this.model.get(this.bindings.observe));
            this.stickit();
        },

        getBindingValue: function($el, event, options){
            if($el.hasClass(this.selectionManager.selectedClass)){
                return this.selectionManager.val();
            }

            return null;
        },

        selectionManagerAfterSelect: function($el){
            this.model.set(this.bindings.observe, this.getBindingValue($el));
            SingleSelectionManager.prototype.selectionManagerAfterSelect.call(this, $el);
            this.trigger('after:select', $el);
        }
    });

    module.exports.SelectionManager = SelectionManager;
    module.exports.SingleSelectionManager = SingleSelectionManager;
    module.exports.ModelBoundSingleSelectionManager = ModelBoundSingleSelectionManager;

});
