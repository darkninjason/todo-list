define(function(require, exports, module) {

// Imports

var $       = require('jquery');
var helpers = require('auf/utils/helpers');

describe('Utils Helpers', function() {

    // Setup

    beforeEach(function() {
        loadFixtures('utils-helpers.html');
    });

    afterEach(function() {

    });

    // Test Suite

    it('expects $element for string', function() {
        var $el = helpers.getElement('#helper-target');
        expect($el instanceof $).toEqual(true);
    });

    it('expects $element for $element', function() {
        var $target = $('#helper-target');
        var $el = helpers.getElement($target);
        expect($el instanceof $).toEqual(true);
    });

    it('composes functions and maintains original scope', function() {
        var ModuleA, ModuleB, moduleB;

        ModuleA = function() {
        };
        ModuleA.prototype.foo = function() {
            return {
                self: this
            };
        };
        ModuleB = function() {
            this.moduleA = new ModuleA();
            helpers.compose(this, this.moduleA, 'foo');
        };

        moduleB = new ModuleB();

        expect(moduleB.foo).not.toThrow();
        expect(moduleB.foo().self instanceof ModuleA).toBe(true);
    });

    it('composes all functions and maintains original scope', function() {
        var ModuleA, ModuleB, moduleB;

        ModuleA = function() {
        };
        ModuleA.prototype.foo = function() {
            return {
                self: this
            };
        };
        ModuleA.prototype.bar = function() {
            return {
                self: this
            };
        };
        ModuleB = function() {
            this.moduleA = new ModuleA();

            helpers.composeAll(
                this,
                this.moduleA,
                'foo',
                'bar'
            );
        };

        moduleB = new ModuleB();

        expect(moduleB.foo).not.toThrow();
        expect(moduleB.bar).not.toThrow();
        expect(moduleB.foo().self instanceof ModuleA).toBe(true);
        expect(moduleB.bar().self instanceof ModuleA).toBe(true);
    });

}); // eof describe
}); // eof define
