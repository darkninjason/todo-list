define(function(require, exports, module) {
    var touches = require('blitz/ui/responders/touches');

    describe('Touch Responder', function() {

        var $input, responder = null;

        function simulateEvent($el, type, x, y){
            var e = jQuery.Event(type);

            var touch = {
                pageX: x,
                pageY: y,
                target: $el[0]
            };

            e.originalEvent = {touches: [touch]};
            e.target = $el[0];
            e.currentTarget = $el[0];

            $el.trigger(e);

            return e;
        }

        function simulateStart($el, x, y){
            return simulateEvent($el, 'touchstart', x, y);
        }

        function simulateMove($el, x, y){
            return simulateEvent($el, 'touchmove', x, y);
        }

        function simulateEnd($el){
            return simulateEvent($el, 'touchend');
        }

        function simulateCancel($el){
            return simulateEvent($el, 'touchcancel');
        }

        beforeEach(function() {
            loadFixtures('responder-touches.html');
            $input = $('#responder');
        });

        afterEach(function() {
            if(responder){
                responder.close();
            }
        });

        it('triggered touchstart', function() {

            var touch = jQuery.Event('touchstart');
            var spyEvent = spyOnEvent($input, 'touchstart');

            $input.trigger(touch);
            expect(spyEvent).toHaveBeenTriggered();
        });

        it('triggered touchmove', function() {

            var touch = jQuery.Event('touchmove');
            var spyEvent = spyOnEvent($input, 'touchmove');

            $input.trigger(touch);
            expect(spyEvent).toHaveBeenTriggered();
        });

        it('triggered touchend', function() {

            var touch = jQuery.Event('touchend');
            var spyEvent = spyOnEvent($input, 'touchend');

            $input.trigger(touch);
            expect(spyEvent).toHaveBeenTriggered();
        });

        it('triggered touchcancel', function() {

            var touch = jQuery.Event('touchcancel');
            var spyEvent = spyOnEvent($input, 'touchcancel');

            $input.trigger(touch);
            expect(spyEvent).toHaveBeenTriggered();
        });

        it('triggered TouchResponder.onClose', function() {
            // note the local assignment to of a scopedResponder
            // not using the suite's setup 'responder' var
            // we want to explicitely test close()

            var scopedResponder = new touches.TouchResponder({
                el: $input
            });

            spyOn(scopedResponder, 'onClose').andCallThrough();

            scopedResponder.close();
            expect(scopedResponder.onClose).toHaveBeenCalled();
        });

        it('removes touch events', function() {
            // note the local assignment to of a scopedResponder
            // not using the suite's setup 'responder' var
            // we want to explicitely test onClose behavior()

            var touchStart = jasmine.createSpy('touchStart');
            var touchEnd = jasmine.createSpy('touchEnd');

            var scopedResponder = new touches.TouchResponder({
                el: $input,
                touchStart: touchStart,
                touchEnd: touchEnd
            });

            scopedResponder.close();

            simulateStart($input, 10, 10);
            simulateEnd($input);

            expect(touchStart).not.toHaveBeenCalled();
            expect(touchEnd).not.toHaveBeenCalled();

            // this is probably a redundant check:
            expect(touchStart.calls.length).toEqual(0);
            expect(touchEnd.calls.length).toEqual(0);
        });

        it('calls touchStart', function() {

            var touchStart = jasmine.createSpy('touchStart');

            responder = new touches.TouchResponder({
                el: $input,
                touchStart: touchStart
            });

            simulateStart($input, 0, 0);
            expect(touchStart).toHaveBeenCalled();
        });

        it('calls touchMove', function() {

            var touchMove = jasmine.createSpy('touchMove');

            responder = new touches.TouchResponder({
                el: $input,
                touchMove: touchMove
            });

            simulateMove($input, 0, 0);
            expect(touchMove).toHaveBeenCalled();
        });

        it('calls touchEnd', function() {

            var touchEnd = jasmine.createSpy('touchEnd');

            responder = new touches.TouchResponder({
                el: $input,
                touchEnd: touchEnd
            });

            simulateEnd($input, 0, 0);
            expect(touchEnd).toHaveBeenCalled();
        });

        it('calls touchCancel', function() {

            var touchCancel = jasmine.createSpy('touchCancel');

            responder = new touches.TouchResponder({
                el: $input,
                touchCancel: touchCancel
            });

            simulateCancel($input);
            expect(touchCancel).toHaveBeenCalled();
        });
    });
});
