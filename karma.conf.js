// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
        {pattern: 'tests/common.js', included: true},
        {pattern: 'tests/fixtures/*.html', included: false},
        {pattern: 'tests/spec/built*.js', included: false},
        {pattern: 'tests/lib/**/*.js', included: false},
        {pattern: 'built/**/*.js', included: false},

        'tests/karma-main.js'
    ],

    preprocessors: {
        'built/**/*.js': 'coverage'
    },

    exclude: [
        '**/karma.conf.js'
    ],

    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false

  });
};
