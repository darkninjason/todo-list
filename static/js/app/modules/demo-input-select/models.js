define(function( require, exports, module ){

var backbone = require('backbone');
var InputResult = backbone.Model.extend({
    defaults: {

    }
});

exports.InputResult = InputResult;

});

// example response
// git_url: "https://api.github.com/repositories/4164482/git/blobs/232054a9f157b1290843c5ba5f98f13eebb9d33c"
// html_url: "https://github.com/django/django/blob/86f4459f9e3c035ec96578617605e93234bf2700/tests/test_discovery_sample2/tests.py"
// name: "tests.py"
// path: "tests/test_discovery_sample2/tests.py"
// repository: Object
// score: 1.9718672
// sha: "232054a9f157b1290843c5ba5f98f13eebb9d33c"
// url: "https://api.github.com/repositories/4164482/contents/tests/test_discovery_sample2
