define(function (require, exports, module) {
    var _                  = require('underscore');
    var Marionette         = require('marionette');
    var InputSelect        = require('built/ui/controls/forms/input-select').InputSelect;

    var InputSelectMarionette = InputSelect.extend({

        onClose : function(){
            this.marionetteDict = [];
        },

        initialize: function() {
            InputSelect.prototype.initialize.apply(this,arguments);
            this.on('blur', this._onItemBlur);
            this.on('focus', this._onItemFocus);
            this.on('select', this._onItemSelect);
        },

        setViews : function(children){
            var elements = [];
            var views = children.toArray();
            _.each(views, function(each){
                elements.push(each.$el[0]);
            });
            this.setElements($(elements));
            var marionetteDict = this.marionetteDict = {};
            _.each(views, function(each){
                var key = each.$el.data('auf-id');
                marionetteDict[key] = each;
                elements.push(each.$el[0]);
            });
        },

        _triggerEventOnViewForElement: function(event, $element){
            var key = $element.data('auf-id');
            var itemView = this.marionetteDict[key];
            if(itemView){
                itemView.trigger(event);
            }
        },

        _onItemBlur: function(input, $element){
            this._triggerEventOnViewForElement('blur', $element);
        },

        _onItemFocus: function(input, $element){
            this._triggerEventOnViewForElement('focus', $element);
        },

        _onItemSelect: function(input, $element){
            this._triggerEventOnViewForElement('select', $element);
        }
    });

    exports.InputSelectMarionette = InputSelectMarionette;

});
