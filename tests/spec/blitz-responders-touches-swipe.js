define(function(require, exports, module) {
    var SwipeGesture = require('auf/ui/gestures/swipe');

    describe('Swipe Gesture', function() {

        var $input, responder = null;

        function createTouchEvent($el, type, x, y){
            var e = jQuery.Event(type);

            var touch = {
                pageX: x,
                pageY: y,
                target: $el[0]
            };

            e.originalEvent = {touches: [touch]};
            e.target = $el[0];
            e.currentTarget = $el[0];

            return e;
        }

        function simulateEvent($el, type, x, y){
            var e = createTouchEvent($el, type, x, y);
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

        function swipeLeft($el){
            simulateStart($input, 300, 300);
            simulateMove($input, 0, 290);
            simulateEnd($input);
        }

        function swipeRight($el){
            simulateStart($input, 0, 300);
            simulateMove($input, 300, 290);
            simulateEnd($input);
        }

        function swipeUp($el){
            simulateStart($input, 300, 400);
            simulateMove($input, 290, 50);
            simulateEnd($input);
        }

        function swipeDown($el){
            simulateStart($input, 300, 50);
            simulateMove($input, 290, 400);
            simulateEnd($input);
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

        it('did trigger swipe left', function() {

            var handleGesture = jasmine.createSpy('handleGesture');
            responder = new SwipeGesture({
                el: $input,
                direction: 'left',
                handleGesture: handleGesture
            });


            swipeLeft($input);
            expect(handleGesture).toHaveBeenCalled();
        });

        it('did not trigger swipe left', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'left',
                handleGesture: handleGesture
            });

            swipeRight($input);
            swipeUp($input);
            swipeDown($input);
            expect(handleGesture).not.toHaveBeenCalled();
        });

        it('did trigger swipe right', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'right',
                handleGesture: handleGesture
            });


            swipeRight($input);
            expect(handleGesture).toHaveBeenCalled();
        });

        it('did not trigger swipe right', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'right',
                handleGesture: handleGesture
            });

            swipeLeft($input);
            swipeUp($input);
            swipeDown($input);

            expect(handleGesture).not.toHaveBeenCalled();
        });

        it('did trigger swipe up', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'up',
                handleGesture: handleGesture
            });


            swipeUp($input);
            expect(handleGesture).toHaveBeenCalled();
        });

        it('did not trigger swipe up', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'up',
                handleGesture: handleGesture
            });

            swipeLeft($input);
            swipeRight($input);
            swipeDown($input);

            expect(handleGesture).not.toHaveBeenCalled();
        });

        it('did trigger swipe down', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'down',
                handleGesture: handleGesture
            });


            swipeDown($input);
            expect(handleGesture).toHaveBeenCalled();
        });

        it('did not trigger swipe down', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'down',
                handleGesture: handleGesture
            });

            swipeLeft($input);
            swipeRight($input);
            swipeUp($input);

            expect(handleGesture).not.toHaveBeenCalled();
        });

        it('did trigger swipe left requiring 2 touches', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'left',
                numberOfTouchesRequired: 2,
                handleGesture: handleGesture
            });

            var startEvent = createTouchEvent($input, 'touchstart', 300, 300);
            startEvent.originalEvent.touches.push({
                pageX: 290,
                pageY: 320});

            var moveEvent = createTouchEvent($input, 'touchmove', 0, 300);
            moveEvent.originalEvent.touches.push({
                pageX: 30,
                pageY: 320});


            $input.trigger(startEvent);
            $input.trigger(moveEvent);
            simulateEnd($input);

            expect(handleGesture).toHaveBeenCalled();
        });

        it('did not trigger swipe left requiring 2 touches', function() {

            var handleGesture = jasmine.createSpy('handleGesture');

            responder = new SwipeGesture({
                el: $input,
                direction: 'left',
                numberOfTouchesRequired: 2,
                handleGesture: handleGesture
            });

            swipeLeft($input);
            expect(handleGesture).not.toHaveBeenCalled();
        });
    });
});
