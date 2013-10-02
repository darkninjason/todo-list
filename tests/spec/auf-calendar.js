define(function(require, exports, module) {

// Imports

var calendar = require('auf/calendar/calendar');
var _        = require('underscore');

describe('Calendar:', function() {

    it('should get the number of days in a month', function() {
        var days = calendar.daysInJavaScriptMonth(2012, 1);
        expect(days).toEqual(29); // leap year

        days = calendar.daysInJavaScriptMonth(2013, 1);
        expect(days).toEqual(28); // not a leap year

        days = calendar.daysInJavaScriptMonth(2013, 7);
        expect(days).toEqual(31);

        days = calendar.daysInJavaScriptMonth(2013, 8);
        expect(days).toEqual(30);
    });

    it('should get the number of days the current month', function() {
        var now = new Date();

        // The 0 for the days in our date constructor means
        // The last of the previous month.
        // We need to add 1 to our JS month to be sure
        // The "last month" means our current month.
        var currentDays = new Date(
            now.getFullYear(),
            now.getMonth() + 1, 0).getDate();

        var days = calendar.daysInJavaScriptMonth();

        expect(days).toEqual(currentDays);
    });

    it('should get all of the days in Sept 2013', function(){
        var days = calendar.calendarMonthDays(2013, 9);

        expect(days.length).toEqual(30);
    });

    it('should get all of the days in Sept 2013 from Date', function(){
        var date = new Date(2013, 8, 1);
        var days = calendar.calendarMonthDays(date);

        expect(days.length).toEqual(30);
    });

    it('should get all of the days in Sept 2013 as Date()', function(){
        var days = calendar.calendarMonthDays(2013, 9, {useDates:true});
        expect(days.length).toEqual(30);
        expect(_.isDate(days[0])).toBe(true);
        expect(_.isDate(days[29])).toBe(true);
    });

    it('should return a buffered calendar array of days for Jan 2013 as Date()', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 1, {useDates: true});

        expect(result.length).toEqual(42);

        _.each(result, function(x){
            expect(_.isDate(x)).toBe(true);
        });
    });

    it('should return a buffered calendar array of days for Jan 2013 from Date', function() {
        var result = calendar.bufferedCalendarMonthDays(new Date(2013, 0, 1));

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(30);
        expect(result[1]).toEqual(31);
        expect(result[2]).toEqual(1);

        expect(result[35]).toEqual(3);
        expect(result[36]).toEqual(4);
        expect(result[37]).toEqual(5);
    });

    it('should return a buffered calendar array of days for Jan 2013 from Date as Date()', function() {
        var result = calendar.bufferedCalendarMonthDays(new Date(2013, 0, 1), null, {useDates: true});

        expect(result.length).toEqual(42);

        _.each(result, function(x){
            expect(_.isDate(x)).toBe(true);
        });
    });

    it('should return a buffered calendar array of days for Jan 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 1);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(30);
        expect(result[1]).toEqual(31);
        expect(result[2]).toEqual(1);

        expect(result[35]).toEqual(3);
        expect(result[36]).toEqual(4);
        expect(result[37]).toEqual(5);
    });

    it('should return a buffered calendar array of days for Feb 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 2);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(27);
        expect(result[1]).toEqual(28);
        expect(result[2]).toEqual(29);

        expect(result[35]).toEqual(3);
        expect(result[36]).toEqual(4);
        expect(result[37]).toEqual(5);
    });

    it('should return a buffered calendar array of days for March 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 3);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(24);
        expect(result[1]).toEqual(25);
        expect(result[2]).toEqual(26);

        expect(result[35]).toEqual(31);
        expect(result[36]).toEqual(1);
        expect(result[37]).toEqual(2);
    });

    it('should return a buffered calendar array of days for April 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 4);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(31);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual(2);

        expect(result[35]).toEqual(5);
        expect(result[36]).toEqual(6);
        expect(result[37]).toEqual(7);
    });

    it('should return a buffered calendar array of days for May 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 5);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(28);
        expect(result[1]).toEqual(29);
        expect(result[2]).toEqual(30);

        expect(result[35]).toEqual(2);
        expect(result[36]).toEqual(3);
        expect(result[37]).toEqual(4);
    });

    it('should return a buffered calendar array of days for June 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 6);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(26);
        expect(result[1]).toEqual(27);
        expect(result[2]).toEqual(28);

        expect(result[35]).toEqual(30);
        expect(result[36]).toEqual(1);
        expect(result[37]).toEqual(2);
    });

    it('should return a buffered calendar array of days for July 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 7);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(30);
        expect(result[1]).toEqual(1);
        expect(result[2]).toEqual(2);

        expect(result[35]).toEqual(4);
        expect(result[36]).toEqual(5);
        expect(result[37]).toEqual(6);
    });

    it('should return a buffered calendar array of days for Aug 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 8);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(28);
        expect(result[1]).toEqual(29);
        expect(result[2]).toEqual(30);

        expect(result[35]).toEqual(1);
        expect(result[36]).toEqual(2);
        expect(result[37]).toEqual(3);
    });

    it('should return a buffered calendar array of days for Sept 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 9);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(2);
        expect(result[2]).toEqual(3);

        expect(result[35]).toEqual(6);
        expect(result[36]).toEqual(7);
        expect(result[37]).toEqual(8);
    });

    it('should return a buffered calendar array of days for Oct 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 10);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(29);
        expect(result[1]).toEqual(30);
        expect(result[2]).toEqual(1);

        expect(result[35]).toEqual(3);
        expect(result[36]).toEqual(4);
        expect(result[37]).toEqual(5);
    });

    it('should return a buffered calendar array of days for Nov 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 11);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(27);
        expect(result[1]).toEqual(28);
        expect(result[2]).toEqual(29);

        expect(result[35]).toEqual(1);
        expect(result[36]).toEqual(2);
        expect(result[37]).toEqual(3);
    });

    it('should return a buffered calendar array of days for Dec 2013', function() {
        var result = calendar.bufferedCalendarMonthDays(2013, 12);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(2);
        expect(result[2]).toEqual(3);

        expect(result[35]).toEqual(5);
        expect(result[36]).toEqual(6);
        expect(result[37]).toEqual(7);
    });

    it('should return a buffered calendar array of days for Feb 2012 (leap year)', function() {
        var result = calendar.bufferedCalendarMonthDays(2012, 2);

        expect(result.length).toEqual(42);

        expect(result[0]).toEqual(29);
        expect(result[1]).toEqual(30);
        expect(result[2]).toEqual(31);

        expect(result[35]).toEqual(4);
        expect(result[36]).toEqual(5);
        expect(result[37]).toEqual(6);
    });

    it('should return a calendar array of buffered weeks for Jan 2013 no prefix days', function() {
        var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {prefixDays: false});
        var firstWeek = result[0];
        var lastWeek  = result[5];

        expect(result.length).toEqual(6);

        expect(firstWeek.length).toEqual(7);
        expect(firstWeek[0]).toEqual(undefined);
        expect(firstWeek[1]).toEqual(undefined);
        expect(firstWeek[2]).toEqual(1);
        expect(firstWeek[3]).toEqual(2);
        expect(firstWeek[4]).toEqual(3);
        expect(firstWeek[5]).toEqual(4);
        expect(firstWeek[6]).toEqual(5);

        expect(lastWeek.length).toEqual(7);
        expect(lastWeek[0]).toEqual(3);
        expect(lastWeek[1]).toEqual(4);
        expect(lastWeek[2]).toEqual(5);
    });

    it('should return a calendar array of buffered weeks for Jan 2013 no suffix days', function() {
        var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {suffixDays: false});
        var firstWeek = result[0];
        var lastWeek  = result[5];

        expect(result.length).toEqual(6);

        expect(firstWeek.length).toEqual(7);
        expect(firstWeek[0]).toEqual(30);
        expect(firstWeek[1]).toEqual(31);
        expect(firstWeek[2]).toEqual(1);
        expect(firstWeek[3]).toEqual(2);
        expect(firstWeek[4]).toEqual(3);
        expect(firstWeek[5]).toEqual(4);
        expect(firstWeek[6]).toEqual(5);

        expect(lastWeek.length).toEqual(7);
        expect(lastWeek[0]).toEqual(undefined);
        expect(lastWeek[1]).toEqual(undefined);
        expect(lastWeek[2]).toEqual(undefined);
    });

    it('should return a calendar array of buffered weeks for Jan 2013 no prefix or suffix days', function() {
        var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {prefixDays: false, suffixDays: false});
        var firstWeek = result[0];
        var lastWeek  = result[5];

        expect(result.length).toEqual(6);

        expect(firstWeek.length).toEqual(7);
        expect(firstWeek[0]).toEqual(undefined);
        expect(firstWeek[1]).toEqual(undefined);
        expect(firstWeek[2]).toEqual(1);
        expect(firstWeek[3]).toEqual(2);
        expect(firstWeek[4]).toEqual(3);
        expect(firstWeek[5]).toEqual(4);
        expect(firstWeek[6]).toEqual(5);

        expect(lastWeek.length).toEqual(7);
        expect(lastWeek[0]).toEqual(undefined);
        expect(lastWeek[1]).toEqual(undefined);
        expect(lastWeek[2]).toEqual(undefined);
    });

    it('should return a buffered calendar array of weeks for Jan 2013', function() {
        var result    = calendar.bufferedCalendarMonthWeeks(2013, 1);
        var firstWeek = result[0];
        var lastWeek  = result[5];

        expect(result.length).toEqual(6);

        expect(firstWeek[0]).toEqual(30);
        expect(firstWeek[1]).toEqual(31);
        expect(firstWeek[2]).toEqual(1);

        expect(lastWeek[0]).toEqual(3);
        expect(lastWeek[1]).toEqual(4);
        expect(lastWeek[2]).toEqual(5);
    });

    it('should return a buffered calendar array of weeks for Jan 2013 as Date()', function() {
        var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {useDates: true});
        var firstWeek = result[0];
        var lastWeek  = result[5];

        expect(result.length).toEqual(6);

        expect(_.isDate(firstWeek[0])).toEqual(true);
        expect(_.isDate(firstWeek[1])).toEqual(true);
        expect(_.isDate(firstWeek[2])).toEqual(true);

        expect(_.isDate(lastWeek[0])).toEqual(true);
        expect(_.isDate(lastWeek[1])).toEqual(true);
        expect(_.isDate(lastWeek[2])).toEqual(true);
    });

}); // eof describe
}); // eof define
