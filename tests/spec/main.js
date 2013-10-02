require(

[
    'jquery',
    'jasmine/jasmine',
    'spec/index',

    // jasmine augmenters, they return nothing useful.
    'jasmine/jasmine-html',
    'jasmine/jasmine-jquery',
    'jasmine/console-runner'
],

function($, Jasmine, index) {

    var jasmineEnv = Jasmine.getEnv();

    // jquery-jasmine
    Jasmine.getFixtures().fixturesPath = 'fixtures';

    // phantom-jasmine
    // jasmineEnv.addReporter(new Jasmine.TrivialReporter());
    jasmineEnv.addReporter(new Jasmine.ConsoleReporter());

    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new Jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    $(function() {
        require(index.specs, function() {
            jasmineEnv.execute();
        });
    });

}  // eof callback
); // eof require
