define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var PopView = require('built/app/popovers').PopView;
    var WindowResponder = require('built/core/responders/window').WindowResponder;

    _.extend(marionette.View.prototype, {

        contextMenus: function(){
            if(this.contextMenu){
                this.events['contextmenu'] = '_contextMenuOnRightClick';
            }
        },

        _contextMenuOnRightClick: function(evt){

            var contextMenuOptions = _.result(this, 'contextMenuOptions');
            var completeHandler = contextMenuOptions.complete;

            if(!completeHandler && this.contextMenuComplete){
                completeHandler = _.bind(this.contextMenuComplete, this);
            } else {
                throw new Error(
                    '[ContextMenuError] You must define a ' +
                    '\'complete\' handler in contextMenuOptions ' +
                    'or provide the default \'contextMenuComplete\' '+
                    'method in this view');
            }

            var options = _.omit(contextMenuOptions, 'complete');
            var view = new this.contextMenu(options);

            var menu = new PopView();
            menu.anchorTop = this._contextMenuAnchorAction;
            menu.anchorBottom = this._contextMenuAnchorAction;
            menu.anchorLeft = this._contextMenuAnchorAction;
            menu.anchorRight = this._contextMenuAnchorAction;

            var windowResponder = new WindowResponder({
                acceptsResize: true,
                resizeDebounce: 0,
                resize: function(){
                    menu.close();
                }
            });

            menu.show(view, {
                rect: {x: evt.clientX,  y: evt.clientY},
                anchor: 'top'})

            .then(function(view){
                windowResponder.close();
                completeHandler(view);
            });

            evt.preventDefault();
        },

        _contextMenuAnchorAction: function(anchorRect, $anchorElement, viewRect, css){
            var expandedX = anchorRect.x + viewRect.width;
            var expandedY = anchorRect.y + viewRect.height;


            if(expandedX > $(window).width()){
                css.left = $(window).width() - viewRect.width;
            } else {
                css.left = anchorRect.x;
            }


            if(expandedY > $(window).height()){
                css.top = $(window).height() - viewRect.height;
            } else {
                css.top = anchorRect.y;
            }
        },
    });
});
