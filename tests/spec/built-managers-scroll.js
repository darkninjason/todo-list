define(function(require, exports, module) {

require('greensock/TweenMax');
require('jquery/jquery.scrollmagic');
require('jquery/jquery.scrollmagic.debug');

// Imports

var _ = require('underscore');
var ScrollManager = require('built/core/managers/x-scroll').ScrollManager;

var tickDriver = function(options, tickHandler){
    var on = function(){
        options.container.on('scroll resize', tickHandler);
    };

    var off = function(){
        options.container.off('scroll resize', tickHandler);
    };

    return {on: on, off: off};
};

describe('Scroller', function() {

    // Object Vars


    // Setup

    beforeEach(function(){
        loadFixtures('manager-scroll.html');
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });


    afterEach(function(){

    });

    // Test Suite
    it('initializes', function(){
        var scrollManager = new ScrollManager();
        expect(scrollManager instanceof ScrollManager).toBe(true);
    });

    it('can add a marker', function(){
        var scrollManager = new ScrollManager();

        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
    });

    it('closes', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.close();
        // don't call this...only doing this for tests
        expect(scrollManager._getMarker(marker)).toBe(undefined);
    });

    it('sets/gets a duration on a marker', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.duration(marker, 250);
        expect(scrollManager.duration(marker)).toEqual(250);
    });

    it('sets/gets enabled on a marker', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.enabled(marker, false);
        expect(scrollManager.enabled(marker)).toEqual(false);
    });

    it('triggers for element', function(done){

        var $el = $('#scroll-container');

        var ctx = {
            action: function(){
                done();
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});
        var options = {trigger: ".step:eq(5)", duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', ctx.action);

        $el.scrollTop(150);
    });

    it('should NOT trigger for element', function(done){

        var $el = $('#scroll-container');
        var fail = false;
        var ctx = {
            action: function(){
                fail = true;
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});
        var options = {trigger: ".step:eq(5)", duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', ctx.action);

        $el.scrollTop(149);

        setTimeout(function(){
            expect(ctx.action).not.toHaveBeenCalled();
            expect(fail).toBe(false);
            done();
        }, 100);
    });

    it('should trigger for element 3x', function(done){

        var $el = $('#scroll-container');
        var triggerSpy = jasmine.createSpy('triggerSpy');

        var scrollManager = new ScrollManager({
            $el: $el,
            tickDriver: tickDriver});

        // we set a duration here as ScrollScene.progress
        // as some interesting paths it takes when the duration
        // is 0. Namely enter/leave is triggered for each pass though
        // a boundary causing this test to trigger
        // the spy 3 times.
        var options = {trigger: ".step:eq(5)", duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', triggerSpy);

        var moveTop = function(){$el.scrollTop(0);};
        var moveMid = function(){$el.scrollTop(155);};

        // there is some unknown issue here
        // the timings here are versy specific for a reason.
        // when we do say, [50, 100] we won't get all of our
        // events and this test will fail the first time out.
        // subsequent runs will pass however.

        moveMid();
        setTimeout(moveTop, 300);
        setTimeout(moveMid, 600);

        setTimeout(function(){
            expect(triggerSpy).toHaveBeenCalled();
            expect(triggerSpy.calls.count()).toBe(3);
            done();
        }, 900);
    });

    it('should trigger for percent 3x', function(done){

        var $el = $('#scroll-container');
        var triggerSpy = jasmine.createSpy('triggerSpy');

        var scrollManager = new ScrollManager({
            $el: $el,
            tickDriver: tickDriver});

        // we set a duration here as ScrollScene.progress
        // as some interesting paths it takes when the duration
        // is 0. Namely enter/leave is triggered for each pass though
        // a boundary causing this test to trigger
        // the spy 3 times.
        var options = {trigger: "50%", duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', triggerSpy);

        var moveTop = function(){$el.scrollTop(0);};
        var moveMid = function(){$el.scrollTop(155);};

        // there is some unknown issue here
        // the timings here are versy specific for a reason.
        // when we do say, [50, 100] we won't get all of our
        // events and this test will fail the first time out.
        // subsequent runs will pass however.

        moveMid();
        setTimeout(moveTop, 300);
        setTimeout(moveMid, 600);

        setTimeout(function(){
            expect(triggerSpy).toHaveBeenCalled();
            expect(triggerSpy.calls.count()).toBe(3);
            done();
        }, 900);
    });

    it('should trigger for pixels 3x', function(done){

        var $el = $('#scroll-container');
        var triggerSpy = jasmine.createSpy('triggerSpy');

        var scrollManager = new ScrollManager({
            $el: $el,
            tickDriver: tickDriver});

        // we set a duration here as ScrollScene.progress
        // as some interesting paths it takes when the duration
        // is 0. Namely enter/leave is triggered for each pass though
        // a boundary causing this test to trigger
        // the spy 3 times.
        var options = {trigger: 250, duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', triggerSpy);

        var moveTop = function(){$el.scrollTop(0);};
        var moveMid = function(){$el.scrollTop(155);};

        // there is some unknown issue here
        // the timings here are versy specific for a reason.
        // when we do say, [50, 100] we won't get all of our
        // events and this test will fail the first time out.
        // subsequent runs will pass however.

        moveMid();
        setTimeout(moveTop, 300);
        setTimeout(moveMid, 600);

        setTimeout(function(){
            expect(triggerSpy).toHaveBeenCalled();
            expect(triggerSpy.calls.count()).toBe(3);
            done();
        }, 900);
    });

    it('triggers for percent', function(done){

        var $el = $('#scroll-container');

        var ctx = {
            action: function(){
                done();
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});

        var options = {trigger: "50%", duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', ctx.action);

        // our container has a max scroll of 300;
        // 150 is 50%
        $el.scrollTop(150);
    });

    it('should NOT trigger for percent', function(done){

        var $el = $('#scroll-container');
        var fail = false;
        var ctx = {
            action: function(){
                fail = true;
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});

        var options = {trigger: "50%", duration: 0};
        var marker = scrollManager.addMarker(options);
        var scene = scrollManager._getMarker(marker);

        scrollManager.markerOn(marker, 'enter', ctx.action);

        // our container has a max scroll of 300;
        // 150 is 50%. It should not trigger at 149;
        $el.scrollTop(149);

        setTimeout(function(){
            expect(ctx.action).not.toHaveBeenCalled();
            expect(fail).toBe(false);
            done();
        }, 100);
    });

    it('triggers for pixels (int)', function(done){
        var $el = $('#scroll-container');

        var ctx = {
            action: function(){
                done();
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});

        var options = {trigger: 250, duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', ctx.action);

        // our container has a max scroll of 300;
        // 150 is 50%
        $el.scrollTop(150);
    });

    it('triggers for pixels (string)', function(done){
        var $el = $('#scroll-container');

        var ctx = {
            action: function(){
                done();
            }
        };

        spyOn(ctx, 'action').and.callThrough();

        var scrollManager = new ScrollManager({$el: $el});

        var options = {trigger: '250', duration: 0};
        var marker = scrollManager.addMarker(options);

        var scene = scrollManager._getMarker(marker);
        //scene.addIndicators({zindex: 999});

        scrollManager.markerOn(marker, 'enter', ctx.action);

        // our container has a max scroll of 300;
        // 150 is 50%
        $el.scrollTop(150);
    });

    it('sets/gets log level', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.loglevel(marker, 1);
        expect(scrollManager.loglevel(marker)).toEqual(1);
    });

    it('adds/triggers event listeners', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var triggerSpy = jasmine.createSpy('triggerSpy');

        scrollManager.markerOn(marker, 'update', triggerSpy);
        scrollManager.markerTrigger(marker, 'update');
        scrollManager.markerOff(marker, 'update', triggerSpy);
        expect(triggerSpy).toHaveBeenCalled();
    });

    it('removes and doesn\'t trigger event listener', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var triggerSpy = jasmine.createSpy('triggerSpy');

        scrollManager.markerOn(marker, 'update', triggerSpy);
        scrollManager.markerOff(marker, 'update', triggerSpy);
        scrollManager.markerTrigger(marker, 'update');
        expect(triggerSpy).not.toHaveBeenCalled();
    });

    it('sets/gets offset', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.offset(marker, 12);
        expect(scrollManager.offset(marker)).toEqual(12);
    });

    it('sets/gets progress', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.progress(marker, 0.4);
        expect(scrollManager.progress(marker)).toEqual(0.4);
    });

    it('removes target', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.remove(marker);
        expect(scrollManager._getMarker(marker)).toEqual(undefined);
    });

    it('can call removePin without error', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.removePin(marker);
        scrollManager.removePin(marker, true);
        scrollManager.removePin(marker, false);
        // i could add a spy on the marker...but w/e
    });

    it('can call removeTween without error', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.removeTween(marker);
        scrollManager.removeTween(marker, true);
        scrollManager.removeTween(marker, false);
    });

    it('can call reverse without error', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        scrollManager.reverse(marker, true);
        var dir = scrollManager.reverse(marker);
        expect(dir).toEqual(true);
        scrollManager.reverse(marker, false);
        dir = scrollManager.reverse(marker);
        expect(dir).toEqual(false);
    });

    it('returns scrollOffset', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var loc = scrollManager.scrollOffset(marker);
        expect(loc).not.toEqual(undefined);
    });

    it('calls setPin without error', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var pinOptions = {
            pushFollowers: true,
            spacerClass: 'scrollmagic-pin-spacer',
            pinnedClass: ''
        };
        var element = '#trigger';
        scrollManager.setPin(marker, element, pinOptions);
    });

    it('calls setTween without error', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var tweenObject = TweenMax.to("obj");
        scrollManager.setTween(marker, tweenObject);
    });

    it('returns current state', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var state = scrollManager.state(marker);
        expect(state).toEqual('BEFORE');
    });

    it('sets/gets triggerElement', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        var el = scrollManager.triggerElement(marker);
        expect(el).toEqual('#trigger');
        scrollManager.triggerElement(marker, 'body');
        el = scrollManager.triggerElement(marker);
        expect(el).toEqual('body');
    });

    it('sets/gets triggerHook', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        // get
        var num = scrollManager.triggerHook(marker);
        expect(num).not.toEqual(undefined);
        expect(typeof num).toEqual('number');
        // set
        scrollManager.triggerHook(marker, 0.7);
        num = scrollManager.triggerHook(marker);
        expect(num).toEqual(0.7);
    });

    it('gets triggerOffset', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        // get
        var num = scrollManager.triggerOffset(marker);
        expect(num).not.toEqual(undefined);
        expect(typeof num).toEqual('number');
    });

    it('gets/sets tweenChanges option', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        // get
        var bool = scrollManager.tweenChanges(marker);
        expect(bool).toEqual(false);
        scrollManager.tweenChanges(marker, true);
        bool = scrollManager.tweenChanges(marker);
        expect(bool).toEqual(true);
    });

    it('calls update with optional now', function(){
        var scrollManager = new ScrollManager();
        var options = {trigger: "#trigger", duration: 150};
        var marker = scrollManager.addMarker(options);
        // get
        scrollManager.update(marker);
        scrollManager.update(marker, true);
    });



}); // eof describe
}); // eof define
