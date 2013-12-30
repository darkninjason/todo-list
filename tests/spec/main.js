require(

[
    'jquery',
    'jasmine/boot', // requires jasmine/jasmine, exposes 'jasmine'
    'spec/index',

    // jasmine augmentation, they return nothing useful.
    'jasmine/jasmine-html',
    'jasmine/jasmine-jquery',
    'jasmine/console',
],

function($, jasmine, index) {


    var jasmineEnv = jasmine.getEnv();

    // jquery-jasmine
    jasmine.getFixtures().fixturesPath = 'fixtures';
    //jasmineEnv.updateInterval = 1000;

    // var htmlReporter = new jasmine.HtmlReporter({env: jasmineEnv});
    // jasmineEnv.addReporter(htmlReporter);

    // jasmineEnv.specFilter = function(spec) {
    //     return htmlReporter.specFilter(spec);
    // };

    $(function() {
        require(index.specs, function() {
            // jasmine/boot sets the onload handler
            // we call it since we know we are ready.
            //
            // effectively calls this:
            // htmlReporter.initialize();
            // env.execute();
            window.onload();
        });
    });

}  // eof callback
); // eof require
