// Karma configuration
// Generated on Fri Oct 11 2013 11:32:27 GMT-0700 (PDT)


module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
        // using jasmine-jquery, we would like to serve our fixtures:
        {pattern: 'tests/fixtures/*.html', included: false, served: true},
        {pattern: 'tests/spec/auf*.js', included: false},
        {pattern: 'tests/lib/**/*.js', included: false, served: true},
        {pattern: 'agency-ui-foundation/**/*.js', included: false, served: true},

        'tests/karma-main.js'
    ],

    // don't be fancy with html files:
    // using jasmine-jqkarma uery, we do not want karma messing with our html files.
    // https://github.com/karma-runner/karma/issues/740
    preprocessors: {
        // Istanbul required for coverage (npm install -g istanbul)
        // karma-coverage required for coverage (npm install -g karma-coverage)
        'agency-ui-foundation/**/*.js': 'coverage'
    },


    // list of files to exclude
    exclude: [
        '**/karma.conf.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'

    reporters: [
    'dots',
    //'progress',

    // Istanbul required for coverage (npm install -g istanbul)
    // karma-coverage required for coverage (npm install -g karma-coverage)
    'coverage'
    ],
    //reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    //browsers: ['Chrome', 'Firefox', 'Safari'],
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};
