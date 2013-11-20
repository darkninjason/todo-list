define(function(require, exports, module) {

// Imports

var datetime = require('built/core/datetime/datetime');
var calendar = require('built/core/calendar/calendar');

describe('Datetime:', function() {

    it('should convert a UTC string to a local date (PDT)', function() {
        // toISOString is an ECMAScript 5 addition
        var now = new Date();
        var d   = datetime.UTCStringToLocalDate(now.toISOString());

        expect(d.getFullYear()).toBe(now.getFullYear());
        expect(d.getMonth()).toBe(now.getMonth());
        expect(d.getDate()).toBe(now.getDate());
        expect(d.getHours()).toBe(now.getHours());
        expect(d.getMinutes()).toBe(now.getMinutes());
        expect(d.getSeconds()).toBe(now.getSeconds());
    });

    it('should yield an ISO Date string that equals 2012-08-29T20:59:00.000Z', function() {
        // toISOString is an ECMAScript 5 addition
        var d = datetime.UTCStringToLocalDate('2012-08-29T20:59Z');

        expect(d.toISOString()).toBe('2012-08-29T20:59:00.000Z');
    });

    it('should convert 2012-08-29T20:59Z to 1346273940000 millseconds', function() {
        var d = datetime.UTCStringToMilliseconds('2012-08-29T20:59Z');

        expect(d).toBe(1346273940000);
    });

    it('should convert 2012-08-29T20:59Z to 1377809940 seconds', function() {
        var d = datetime.UTCStringToSeconds('2012-08-29T20:59Z');

        expect(d).toBe(1346273940);
    });

}); // eof describe
}); // eof define
