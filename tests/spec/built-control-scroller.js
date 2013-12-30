define(function(require, exports, module) {

// Imports

_ = require('underscore');
$ = require('jquery');

EventHelpers  = require('lib/spec-helpers').Events;
Scroller      = require('built/core/controls/page/scroller').Scroller;
var events = require('built/core/events/event');

describe('Scroller', function() {

    var control = null;

    // Setup

    beforeEach(function() {
        loadFixtures('manager-scroll.html');
    });

    afterEach(function() {
        $(window).scrollTop();

        if(!_.isEmpty(control)) {
            control.close();
            control = null;
        }
    });

    function getOptions(augments) {
        augments = augments || {};

        var testSuiteDefaults = {
            el:$(window),
            duration: 100
        };

        return _.extend(testSuiteDefaults, augments);
    }

    function getPageElements() {
        return {
            $window: $(window),
            $body: $('body'),
            $container: $('.container'),
            $content: $('.content'),
            $paragraphs: $('p'),
        };
    }

    function getControl(augments) {
        return new Scroller(getOptions(augments));
    }

    // Test Suite

    it('animates scroll when setting scroll value for window', function(done) {
        var elements  = getPageElements();
        var control   = getControl();
        var positions = 0;

        var asyncTimeout = 150;

        function scroll(sender, position, value) {
            positions += position;
        }

        var action = function(){
            var deferred = $.Deferred();

            control.setScrollPosition(1);

            setTimeout(function(){
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        };

        control.on('scroll', scroll);

        action().then(function(){
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
            done();
        });
    });

    it('animates scroll when setting scroll value for container 1', function(done) {
        var elements  = getPageElements();
        var control   = getControl({el: elements.$container});
        var positions = 0;

        var asyncTimeout = 200;

        function scroll(sender, position, value) {
            positions += position;
        }

        function action(){
            var deferred = $.Deferred();
            control.setScrollPosition(1);

            setTimeout(function(){
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }

        control.on('scroll', scroll);

        action().then(function(){
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
            done();
        });
    });


    it('animates scroll when setting scroll value for container 2', function(done) {
        var elements  = getPageElements();
        var control   = getControl({el: elements.$container});
        var positions = 0;

        var asyncTimeout = 200;

        function scroll(sender, position, value) {
            positions += position;
        }

        function action(){
            var deferred = $.Deferred();

            control.setScrollPosition(1);

            setTimeout(function(){
                deferred.resolve();
            }, asyncTimeout);

            return deferred.promise();
        }

        control.on('scroll', scroll);

        action().then(function(){
            expect(control.getScrollPosition()).toEqual(1);

            // positions is used to track that we went incrementally
            // through scroll positions. If positions is not greater
            // than 1, it probably only fired once which implies
            // animation did not take place.
            expect(positions).toBeGreaterThan(1);
            done();
        });
    });



}); // eof describe
}); // eof define
