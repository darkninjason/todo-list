define(function(require, exports, module) {

// Imports

var Collection = require('auf/jquery/collection').Collection;
var _          = require('underscore');

describe('jQuery Collection:', function() {
    var collection;
    var $ctx;

    beforeEach(function() {
        loadFixtures('jquery-collection.html');
        $ctx = $('#jasmine-jquery-context');
        collection = new Collection();
    });

    it('should add an one element', function() {

        var $items = $ctx.find('li:first-child');
        expect($items.length).toEqual(1);

        collection.add($items);
        expect(collection.length).toEqual(1);

    });

    it('should add multiple elements', function() {

        var $items = $ctx.find('li');
        expect($items.length).toEqual(5);

        collection.add($items);
        expect(collection.length).toEqual(5);

    });

    it('should not add duplicate elements', function() {

        var $items = $ctx.find('li:first-child');
        expect($items.length).toEqual(1);

        collection.add($items);
        collection.add($items);

        expect(collection.length).toEqual(1);

    });

    it('should not add duplicate multiple elements', function() {

        var $items = $ctx.find('li');
        expect($items.length).toEqual(5);

        collection.add($items);
        collection.add($items);
        expect(collection.length).toEqual(5);

    });

    it('should only add new extra', function() {

        var $items = $ctx.find('li');
        var $extras = $ctx.find('.extra');

        expect($items.length).toEqual(5);
        expect($extras.length).toEqual(1);

        collection.add($items);
        expect(collection.length).toEqual(5);

        var $group = $($items.toArray().concat($extras.toArray()));
        expect($group.length).toEqual(6);

        collection.add($group);
        expect(collection.length).toEqual(6);
    });

    it('should retrieve extra element', function() {

        var $items = $ctx.find('li');
        var $extras = $ctx.find('.extra');

        var $group = $($items.toArray().concat($extras.toArray()));

        collection.add($group);
        expect(collection.length).toEqual(6);

        expect(collection.at(0)[0]).toEqual($items[0]);
        expect(collection.at(5)[0]).toEqual($extras[0]);
    });

    it('should return array', function() {

        var $items = $ctx.find('li');
        var $extras = $ctx.find('.extra');

        var $group = $($items.toArray().concat($extras.toArray()));

        collection.add($group);
        expect(collection.length).toEqual(6);

        expect(_.isArray(collection.toArray())).toEqual(true);
    });

    it('should remove element', function() {

        var $items = $ctx.find('li:first-child');

        collection.add($items);
        expect(collection.length).toEqual(1);

        collection.remove($items);
        expect(collection.length).toEqual(0);
    });

    it('should remove multiple element', function() {

        var $items = $ctx.find('li');

        collection.add($items);
        expect(collection.length).toEqual(5);

        collection.remove($items);
        expect(collection.length).toEqual(0);
    });

    it('should remove targeted element', function() {

        var $items = $ctx.find('li');

        collection.add($items);
        expect(collection.length).toEqual(5);

        collection.remove($items.eq(3));
        expect(collection.length).toEqual(4);

        expect(collection.at(0)[0]).toEqual($items[0]);
        expect(collection.at(1)[0]).toEqual($items[1]);
        expect(collection.at(2)[0]).toEqual($items[2]);

        // The true test
        expect(collection.at(3)[0]).toEqual($items[4]);
    });

    it('should remove nothing ', function() {

        var $items = $ctx.find('li');

        collection.add($items);
        expect(collection.length).toEqual(5);

        collection.remove($items);
        expect(collection.length).toEqual(0);

        collection.remove($items);
        expect(collection.length).toEqual(0);
    });

    it('should contain element ', function() {

        var $items = $ctx.find('li');

        collection.add($items);
        expect(collection.contains($items.eq(3))).toEqual(true);

    });

    it('should not contain element ', function() {

        var $items = $ctx.find('li');
        var $extras = $ctx.find('.extra');

        collection.add($items);
        expect(collection.contains($extras.eq(0))).toEqual(false);

    });

}); // eof describe
}); // eof define
