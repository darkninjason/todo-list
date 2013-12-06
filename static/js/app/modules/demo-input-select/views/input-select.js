define(function (require, exports, module) {

var marionette                      = require('marionette');

var InputSelectScrollableComposite  = require('built/ui/views/composite/input-select-scrollable').InputSelectScrollableComposite;
var InputSelectComposite            = require('built/ui/views/composite/input-select').InputSelectComposite;
var data                            = require('built/core/events/data');

var template                        = require('hbs!tpl/input-select/composite');
var ResultItem                      = require('./result-item').ResultItem;
var InputResults                    = require('../collections').InputResults;

var InputSelectView = InputSelectComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,

    ui : {
        input:'input'
    },

    initialize: function(){
        this.collection = new InputResults();
    },

    inputDidReceiveData: function(data){
        this.collection.updateForSearch(data);
    },

    presentCollectionView: function(){
        // there is no style information that needs
        // to be changed to present the results.
        // if there were, this is where you would do it.
        //
        // Unlike dismissCollectionView, this is called
        // automatically for you.
    },

    dismissCollectionView: function(){
        // there is no style information that needs
        // to be changed to dismiss the results.
        // if there were, this is where you would do it.
        //
        // This is not called automatically for you.
        // You will typically call this yourself in
        // collectionViewDidCancel and collectionViewDidSelect.
    },

    collectionViewDidCancel: function(){

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();
    },

    collectionViewDidSelect: function(view){
        this.ui.input.val(view.model.get('path'));

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();

        // At this point you should probably save a reference to
        // view.model somewhere, since this is what the user selected.
        // something like this.selectedModel = view.model
        // so you can do something with it later.
    },

});


var InputSelectScrollableView = InputSelectScrollableComposite.extend({
    itemView: ResultItem,
    itemViewContainer: '.list-group',
    template : template,

    ui : {
        input:'input'
    },

    initialize: function(){
        this.collection = new InputResults();
    },

    inputDidReceiveData: function(data){
        this.collection.updateForSearch(data);
    },

    presentCollectionView: function(){
        // there is no style information that needs
        // to be changed to present the results.
        // if there were, this is where you would do it.
        //
        // Unlike dismissCollectionView, this is called
        // automatically for you.
    },

    dismissCollectionView: function(){
        // there is no style information that needs
        // to be changed to dismiss the results.
        // if there were, this is where you would do it.
        //
        // This is not called automatically for you.
        // You will typically call this yourself in
        // collectionViewDidCancel and collectionViewDidSelect.
    },

    collectionViewDidCancel: function(){

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();
    },

    collectionViewDidSelect: function(view){
        this.ui.input.val(view.model.get('path'));

        // YOU MUST CALL CLEANUP WHEN YOU ARE DONE
        // You may be animating the dismissal, or who knows
        // what, so we don't know when to call it, only you do.
        this.dismissCollectionView();
        this.cleanup();

        // At this point you should probably save a reference to
        // view.model somewhere, since this is what the user selected.
        // something like this.selectedModel = view.model
        // so you can do something with it later.
    },
});

exports.InputSelectView = InputSelectView;
exports.InputSelectScrollableView = InputSelectScrollableView;

});
