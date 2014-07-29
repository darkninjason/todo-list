// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
<<<<<<< HEAD
        {pattern: 'src/static/js/common.js', included: true},
        {pattern: 'src/static/js/app/**/*.js', included: false},
        {pattern: 'src/static/js/app/**/*.html', included: false},
        {pattern: 'src/static/js/vendor/**/*.js', included: false, served: true},
        {pattern: 'src/static/js/specs/**/*.js', included: false, served: true},
        {pattern: 'src/static/js/specs/**/*.html', included: false, served: true},

        'src/static/js/karma-main.js'
=======
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
>>>>>>> 16651653a311587ab593897471e723586d5dcd06
    ],

    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false

  });
<<<<<<< HEAD
};
=======
};
>>>>>>> 16651653a311587ab593897471e723586d5dcd06
