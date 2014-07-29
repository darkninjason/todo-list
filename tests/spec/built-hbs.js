define(function(require, exports, module) {

var _        = require('underscore');
var template = require('hbs!fixtures/hbs-test');

describe('HBS Plugin:', function() {

    it('should get render template', function() {
        data = template({'label': 'lucy'});
        expect(data).toBe('lucy\n');
    });

}); // eof describe
}); // eof define
