define(function(require, exports, module) {

// Imports

var Select = require('built/core/controls/forms/select').Select;
var SpecHelpers = require('lib/spec-helpers');
var eventHelpers = SpecHelpers.Events;
var KeyCodes = SpecHelpers.KeyCodes;
var focus = require('built/core/events/focus');
var event = require('built/core/events/event');
var data               = require('built/core/events/data');

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
            el:$selectContainer
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

    it('initializes', function(){
        expect(select).not.toEqual(undefined);
        select.destroy();
    });

    it('sets elements through setElements', function(){
        select.setElements($selectItems);
        expect(select._$elements).not.toEqual(undefined);
        select.destroy();
    });



    it('calls insertText if selected and you type', function(){
        select.setElements($selectItems);
        select.$input.focus();
        var inputSpy = jasmine.createSpy('inputSpy');
        select.on(data.DATA, inputSpy);
        eventHelpers.insertChar(select.$input, 'l');
        expect(inputSpy).toHaveBeenCalled();
        select.destroy();
    });

    it('selects first element if open and you click down key', function(){
        select.setElements($selectItems);
        select.$input.focus();
        var focusSpy = jasmine.createSpy('focusSpy');
        select.on(focus.FOCUS, focusSpy);
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.downArrow);
        expect(focusSpy).toHaveBeenCalled();
        select.destroy();
    });

    it('selects the 2nd option when hitting down twice', function(){
        select.setElements($selectItems);
        select.$input.focus();
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.downArrow);
        select.on(focus.FOCUS, function(resp, obj){
            expect($selectItems.eq(1)[0]).toEqual(obj);
        });
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.downArrow);
        select.destroy();
    });

    it('selects first element if enter key is pressed when in focus', function(){
        select.setElements($selectItems);
        select.$input.focus();
        var selectSpy = jasmine.createSpy('selectSpy');
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.downArrow);
        select.on(event.SELECT , selectSpy);
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.return);
        expect(selectSpy).toHaveBeenCalled();
        select.destroy();
    });


    it('sets focus on last item if up arrow key is pressed first', function(){
        select.setElements($selectItems);
        select.$input.focus();
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.last()[0]).toEqual(obj);
        });
        eventHelpers.simulateKeyDown(select.$input, KeyCodes.upArrow);
        select.destroy();
    });

    it('selects an option if it is clicked', function(){
        var $last = $selectItems.last();
        select.setElements($selectItems);
        select.$input.focus();
        var clickSpy = jasmine.createSpy('clickSpy');
        select.on(event.SELECT, clickSpy);
        spyOn(select,'mouseDidClick').and.callThrough();
        eventHelpers.simulateMouseDown($last);
        eventHelpers.simulateMouseUp($last);
        expect(clickSpy).toHaveBeenCalled();
        select.destroy();
    });

    it('fires setSelectedOption when you click an option', function(){
        var $last = $selectItems.last();
        select.setElements($selectItems);
        select.$input.focus();
        spyOn(select,'setSelectedOption');
        eventHelpers.simulateMouseDown($last);
        eventHelpers.simulateMouseUp($last);
        expect(select.setSelectedOption).toHaveBeenCalled();
        select.destroy();
    });

    it('handles mouse entering an option', function(){
        select.setElements($selectItems);
        select.$input.focus();
        select.on(focus.BLUR, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseExit($selectItems.eq(0));
        select.destroy();
    });

    it('handles mouse exiting an option', function(){
        select.setElements($selectItems);
        select.$input.focus();
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseEnter($selectItems.eq(0));
        select.destroy();
    });

    it('sets selected option', function(){
        select.setElements($selectItems);
        select.$input.focus();
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        select.setSelectedOption($selectItems.eq(0)[0]);
        select.destroy();
    });






}); // Eof describe
}); // Eof define
