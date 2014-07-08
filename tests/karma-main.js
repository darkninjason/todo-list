var tests = [
    'lib/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',

    'spec/built-hbs',
    'spec/built-calendar',
    'spec/built-control-drag-drop-list',
    'spec/built-control-input-select',
    'spec/built-control-slider-horizontal-range',
    'spec/built-control-slider-horizontal',
    'spec/built-datetime-formats',
    'spec/built-datetime',
    'spec/built-gestures-swipe',
    'spec/built-jquery-collection',
    'spec/built-managers-array',
    'spec/built-managers-focus-single',
    'spec/built-managers-focus',
    'spec/built-managers-index',
    'spec/built-managers-key-equivalent',
    'spec/built-managers-range',
    'spec/built-responders-drag',
    'spec/built-managers-scroll',
    'spec/built-responders-drop',
    'spec/built-responders-keys',
    'spec/built-responders-mouse',
    'spec/built-responders-touches',
    'spec/built-responders-window',
    'spec/built-ui-helpers-dom-getElement',
    'spec/built-ui-helpers-dom',
    'spec/built-utils-helpers-registerElement',
    'spec/built-utils-helpers',
    'spec/built-utils-ioc',
    'spec/built-control-select'


];

requirejs.config({
    baseUrl: '/base/tests',

    shim: {
        'lib/jasmine/jasmine-jquery': {
            'deps': ['jquery']
        },
    },

    deps: tests,

    callback: function(){
        jasmine.getFixtures().fixturesPath = '/base/tests/fixtures';
        window.__karma__.start();
    }
});
