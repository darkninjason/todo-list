define(function(require, exports, module) {
    var formats = require('blitz/datetime/datetime-formats'),
        datetime = require('blitz/datetime/datetime');

    describe('Datetime Formats', function() {
        // [WARNING] these tests assume you are in PDT!
        // this not a portable suite across locales, it will need to
        // be adjusted if not run from PDT. =(

        it('should return August 29th 2012 for Date object representing 2012-08-29T20:59Z', function() {
            var date = datetime.UTCStringToLocalDate('2012-08-29T20:59Z');
            var result = formats.monthDayYearStringForDate(date);

            expect(result).toBe('August 29th 2012');
        });

        it('should return \'st\' suffix for Date objects', function() {
            var date, result;

            date = datetime.UTCStringToLocalDate('2012-08-01T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 1st 2012');

            date = datetime.UTCStringToLocalDate('2012-08-21T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 21st 2012');

            date = datetime.UTCStringToLocalDate('2012-08-31T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 31st 2012');
        });

        it('should return \'nd\' suffix for Date objects', function() {
            var date, result;

            date = datetime.UTCStringToLocalDate('2012-08-02T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 2nd 2012');

            date = datetime.UTCStringToLocalDate('2012-08-22T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 22nd 2012');
        });

        it('should return \'rd\' suffix for Date objects', function() {
            var date, result;

            date = datetime.UTCStringToLocalDate('2012-08-03T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 3rd 2012');

            date = datetime.UTCStringToLocalDate('2012-08-23T20:59Z');
            result = formats.monthDayYearStringForDate(date);
            expect(result).toBe('August 23rd 2012');
        });

        it('should return August 29th 2012 for 2012-08-29T20:59Z', function() {
            var result = formats.monthDayYearStringForUTCString('2012-08-29T20:59Z');
            expect(result).toBe('August 29th 2012');
        });

        it('should return Wed 29 Aug 12:59 pm for Date object representing 2012-08-29T20:59Z', function() {
            var date = datetime.UTCStringToLocalDate('2012-08-29T20:59Z');
            var result = formats.shortDayMonthTimeStringForDate(date);

            expect(result).toBe('Wed 29 Aug 1:59 pm');
        });


        it('should return Wed 29 Aug 13:59 pm for 2012-08-29T20:59Z', function() {
            var result = formats.shortDayMonthTimeStringForUTCString('2012-08-29T20:59Z');
            expect(result).toBe('Wed 29 Aug 1:59 pm');
        });

        it('should yield \'st\' suffix', function() {
            expect(formats.daySuffix(1)).toBe('st');
            expect(formats.daySuffix(21)).toBe('st');
            expect(formats.daySuffix(31)).toBe('st');
        });

        it('should yield \'nd\' suffix', function() {
            expect(formats.daySuffix(2)).toBe('nd');
            expect(formats.daySuffix(22)).toBe('nd');
        });

        it('should yield \'rd\' suffix', function() {
            expect(formats.daySuffix(3)).toBe('rd');
            expect(formats.daySuffix(23)).toBe('rd');
        });

        it('should yield \'th\' suffix', function() {
            expect(formats.daySuffix(4)).toBe('th');
            expect(formats.daySuffix(5)).toBe('th');
            expect(formats.daySuffix(6)).toBe('th');
            expect(formats.daySuffix(7)).toBe('th');
            expect(formats.daySuffix(8)).toBe('th');
            expect(formats.daySuffix(9)).toBe('th');
            expect(formats.daySuffix(10)).toBe('th');
            expect(formats.daySuffix(11)).toBe('th');
            expect(formats.daySuffix(12)).toBe('th');
            expect(formats.daySuffix(13)).toBe('th');
            expect(formats.daySuffix(14)).toBe('th');
            expect(formats.daySuffix(15)).toBe('th');
            expect(formats.daySuffix(16)).toBe('th');
            expect(formats.daySuffix(17)).toBe('th');
            expect(formats.daySuffix(18)).toBe('th');
            expect(formats.daySuffix(19)).toBe('th');
            expect(formats.daySuffix(12)).toBe('th');
            expect(formats.daySuffix(24)).toBe('th');
            expect(formats.daySuffix(25)).toBe('th');
            expect(formats.daySuffix(26)).toBe('th');
            expect(formats.daySuffix(27)).toBe('th');
            expect(formats.daySuffix(28)).toBe('th');
            expect(formats.daySuffix(29)).toBe('th');
            expect(formats.daySuffix(30)).toBe('th');
        });


        it('should format 12 hour time', function() {
            expect(formats.format12HourTime(13, 1, true)).toBe('1:01 pm');
            expect(formats.format12HourTime(8, 20, true)).toBe('8:20 am');

            expect(formats.format12HourTime(13, 1)).toBe('1:01');
            expect(formats.format12HourTime(8, 20)).toBe('8:20');

            expect(formats.format12HourTime(23, 23, true)).toBe('11:23 pm');
        });

        it('should create a relative date', function() {
            // toISOString is an ECMAScript 5 addition
            var d = new Date();
            var justNow = d.toISOString();

            d.setSeconds(d.getSeconds() - 30);
            var secondsAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 70);
            var aboutAMinuteAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 1800);
            var thirtyMinutesAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 3600 * 1.5);
            var aboutAnHourAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 3600 * 5);
            var fiveHoursAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 86400 * 1.5);
            var aboutADayAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 86400 * 5);
            var fiveDaysAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 86400 * 7.5);
            var aboutAWeekAgo = d.toISOString();

            d = new Date();
            d.setSeconds(d.getSeconds() - 604800 * 5);
            var fiveWeeksAgo = d.toISOString();

            expect(formats.relativeDate(justNow)).toBe('just now');
            expect(formats.relativeDate(secondsAgo)).toBe('30 seconds ago');
            expect(formats.relativeDate(aboutAMinuteAgo)).toBe('about a minute ago');
            expect(formats.relativeDate(thirtyMinutesAgo)).toBe('30 minutes ago');
            expect(formats.relativeDate(aboutAnHourAgo)).toBe('about an hour ago');
            expect(formats.relativeDate(fiveHoursAgo)).toBe('5 hours ago');
            expect(formats.relativeDate(aboutADayAgo)).toBe('1 day ago');
            expect(formats.relativeDate(aboutADayAgo)).toBe('1 day ago');
            expect(formats.relativeDate(fiveDaysAgo)).toBe('5 days ago');
            expect(formats.relativeDate(aboutAWeekAgo)).toBe('1 week ago');
            expect(formats.relativeDate(fiveWeeksAgo)).toBe('5 weeks ago');
        });
    });
});
