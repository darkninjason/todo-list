define(function(require, exports, module) {

// Imports

var $       = require('jquery');
var helpers = require('built/core/utils/helpers');

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

    it('normalizes integer', function(){
        var min, max, values, result;

        min = 0;
        max = 100;
        values = [50, -100, 200];
        results = [
            helpers.normalizeInt(values[0], min, max),
            helpers.normalizeInt(values[1], min, max),
            helpers.normalizeInt(values[2], min, max)
        ];

        expect(results[0]).toEqual(50);
        expect(results[1]).toEqual(min);
        expect(results[2]).toEqual(max);
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
