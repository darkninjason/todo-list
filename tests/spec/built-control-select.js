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
            $el:$selectContainer,
            searchTimeout: 0,
            hideList:function(){
                $selectList.hide();
            },
            showList:function(){
                $selectList.show();
            },
            searchForText:function(text){

            },

        });
        select.hideList();
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
        select.close();
    });

    it('sets elements through setElements', function(){
        select.setElements($selectItems);
        expect(select._$elements).not.toEqual(undefined);
        select.close();
    });

    it('calls showList when clicking open', function(){
        select.setElements($selectItems);
        spyOn(select, 'showList');
        select.$el.trigger('click');
        expect(select.showList).toHaveBeenCalled();
        select.close();
    });

    it('calls hideList by clicking outside if its open', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        spyOn(select,'hideList');
        $(window).trigger('click');
        expect(select.hideList).toHaveBeenCalled();
        select.close();
    });

    it('calls searchForText if select is open and you type', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        spyOn(select, 'searchForText');
        eventHelpers.insertChar(select.$el, 'l');
        expect(select.searchForText).toHaveBeenCalled();
        select.close();
    });

    it('selects first element if open and you click down key', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        var focusSpy = jasmine.createSpy('focusSpy');
        select.on(focus.FOCUS, focusSpy);
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        expect(focusSpy).toHaveBeenCalled();
        select.close();
    });

    it('selects the 2nd option when hitting down twice', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.on(focus.FOCUS, function(resp, obj){
            expect($selectItems.eq(1)[0]).toEqual(obj);
        });
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.close();
    });

    it('selects first element if enter key is pressed when in focus', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        var selectSpy = jasmine.createSpy('selectSpy');
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.downArrow);
        select.on(event.SELECT , selectSpy);
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.return);
        expect(selectSpy).toHaveBeenCalled();
        select.close();
    });

    it('closes if open and escape is pressed', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        spyOn(select,'hideList');
        eventHelpers.simulateKeyDown(select.$el, KeyCodes.escape);
        expect(select.hideList).toHaveBeenCalled();
    });

    it('sets focus on last item if up arrow key is pressed first', function(){
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

    it('fires setSelectedOption when you click an option', function(){
        var $last = $selectItems.last();
        select.setElements($selectItems);
        select.$el.trigger('click');
        spyOn(select,'setSelectedOption');
        eventHelpers.simulateMouseDown($last);
        eventHelpers.simulateMouseUp($last);
        expect(select.setSelectedOption).toHaveBeenCalled();
        select.close();
    });

    it('handles mouse entering an option', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.BLUR, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseExit($selectItems.eq(0));
        select.close();
    });

    it('handles mouse exiting an option', function(){
        select.setElements($selectItems);
        select.$el.trigger('click');
        select.on(focus.FOCUS, function(select, obj){
            expect($selectItems.eq(0)[0]).toEqual(obj);
        });
        eventHelpers.simulateMouseEnter($selectItems.eq(0));
        select.close();
    });

    it('sets selected option', function(){
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
