require(['jquery', 'spec/index'], function($, index) {

  var jasmineEnv = jasmine.getEnv();

  // jquery-jasmine
  jasmine.getFixtures().fixturesPath = 'fixtures';

  // phantom-jasmine
  // var console_reporter = new jasmine.ConsoleReporter();
  // jasmineEnv.addReporter(new jasmine.TrivialReporter());
  // jasmineEnv.addReporter(console_reporter);

  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  // var jasmineEnv = jasmine.getEnv();
  //     htmlReporter = new jasmine.HtmlReporter();

  // jasmineEnv.addReporter(htmlReporter);

  // jasmineEnv.specFilter = function(spec) {
  //   return htmlReporter.specFilter(spec);
  // };

  $(function() {
    require(index.specs, function() {
      jasmineEnv.execute();
    });
  });
});





// var jasmineEnv = jasmine.getEnv();
//       jasmineEnv.updateInterval = 1000;

//       var htmlReporter = new jasmine.HtmlReporter();

//       jasmineEnv.addReporter(htmlReporter);

//       jasmineEnv.specFilter = function(spec) {
//         return htmlReporter.specFilter(spec);
//       };

//       var currentWindowOnload = window.onload;

//       window.onload = function() {
//         if (currentWindowOnload) {
//           currentWindowOnload();
//         }
//         execJasmine();
//       };

//       function execJasmine() {
//         jasmineEnv.execute();
//       }
