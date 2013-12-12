define(function(require, exports, module) {

// Imports

var Select = require('built/core/controls/forms/select').Select;
var SpecHelpers = require('lib/spec-helpers');
var eventHelpers = SpecHelpers.Events;
var KeyCodes = SpecHelpers.KeyCodes;
var focus = require('built/core/events/focus');
var event = require('built/core/events/event');

describe('Select control', function() {


    var select, $selectContainer, $selectList, $selectItems, $button;


    // Set Up

    beforeEach(function() {
        loadFixtures('control-select.html');
        $selectContainer = $('.built-select>div');
        $selectList = $('.list-group');
        $selectItems = $('.list-group-item');
        $button = $('.btn-primary');

        select = new Select({
            el:$selectContainer,
            searchTimeout: 0,
            insertText:function(text){

            },

        });

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


    // Test Suite

    xit('initializes', function(){
        expect(select).not.toEqual(undefined);
        select.close();
    });

    xit('sets elements through setElements', function(){
        select.setElements($selectItems);
        expect(select._$elements).not.toEqual(undefined);
        select.close();
    });



    it('calls insertText if selected and you type', function(){
        select.setElements($selectItems);
        spyOn(select, 'insertText');
        select.$input.focus();
        eventHelpers.insertChar(select.$input, 'l');
        expect(select.insertText).toHaveBeenCalled();
        select.close();
    });

    xit('selects first element if open and you click down key', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        var focusSpy = jasmine.createSpy('focusSpy');
        select.on(focus.FOCUS, focusSpy);
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        expect(focusSpy).toHaveBeenCalled();
        select.close();
    });

    xit('selects the 2nd option when hitting down twice', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.on(focus.FOCUS, function(resp, obj){
            expect($selectItems.eq(1)[0]).toEqual(obj);
        });
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.close();
    });

    xit('selects first element if enter key is pressed when in focus', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        var selectSpy = jasmine.createSpy('selectSpy');
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.on(event.SELECT , selectSpy);
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.return);
        expect(selectSpy).toHaveBeenCalled();
        select.close();
    });


    xit('sets focus on last item if up arrow key is pressed first', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.last()[0]).toEqual(obj);
        });
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.upArrow);
        select.close();
    });

    xit('selects an option if it is clicked', function(){
        var $last = $selectItems.last();
        select.setElements($selectItems);
        select.$el.trigger('click');
        var clickSpy = jasmine.createSpy('clickSpy');
        select.on(event.SELECT, clickSpy);
        spyOn(select,'mouseDidClick').andCallThrough();
        eventHelpers.simulateMouseDown($last);
        eventHelpers.simulateMouseUp($last);
        expect(clickSpy).toHaveBeenCalled();
        select.close();
    });

    xit('fires setSelectedOption when you click an option', function(){
        var $last = $selectItems.last();
        select.setElements($selectItems);
        select.$el.trigger('click');
        spyOn(select,'setSelectedOption');
        eventHelpers.simulateMouseDown($last);
        eventHelpers.simulateMouseUp($last);
        expect(select.setSelectedOption).toHaveBeenCalled();
        select.close();
    });

    xit('handles mouse entering an option', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.BLUR, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseExit($selectItems.eq(0));
        select.close();
    });

    xit('handles mouse exiting an option', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseEnter($selectItems.eq(0));
        select.close();
    });

    xit('sets selected option', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        select.setSelectedOption($selectItems.eq(0)[0]);
        select.close();
    });






}); // Eof describe
}); // Eof define
