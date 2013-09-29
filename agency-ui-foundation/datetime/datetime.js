define(function(require){


    // All values assumed to be ISO 8601 and in UTC
    // 2013-08-29T14:29Z
    // 2013-08-29T14:29.000Z
    // 2013-08-29T14:29+0000
    // 2013-08-29T14:29:30.123+0000
    var isoRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?:\:(\d{2})(?:\.(\d+))?)?(?:Z|\+0000)?/;

    function UTCStringToMilliseconds(value){
        // 2013-08-29T15:02:00Z
        // milliseconds and seconds are optional
        // if omitted, 0's are assumed.
        var c = isoRegex.exec(value);
        var year, month, day, hours, minutes, seconds, millisecond = 0;
        year = c[1];
        month = (c[2] - 1);
        day = c[3];
        hour = c[4];
        minute = c[5];
        second = c[6] || 0;
        millisecond = c[7] || 0;

        return Date.UTC(year, month, day, hour, minute, second, millisecond);
    }

    function UTCStringToSeconds(value){
        var utcMilliSeconds = UTCStringToMilliseconds(value);
        return parseInt((utcMilliSeconds / 1000), 10);
    }

    function UTCStringToLocalDate(value){
        var utcSeconds = UTCStringToMilliseconds(value);

        var date = new Date(0);
        date.setTime(utcSeconds);

        return date;
    }

    function daysInMonth(year, month){
        if (!year && !month){
            var now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
        }

        var d = new Date(year, month, 0);
        return d.getDate();
    }

    function bufferedCalendarMonth(year, month, options){

        var firstDayOfWeek = options.firstDayOfWeek || 0;
        var useDates = options.useDates || false;

        if (!year && !month){
            var now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
        }

        var date = new Date(year, month, 1);
        var weekdaysCount = date.getDay() - firstDayOfWeek;

        if (weekdaysCount == -1) weekdaysCount = 6;

        var lastMonth = new Date(date.getTime() - 1);

        console.log(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate());
        console.log(weekdaysCount);

        for(var i = 0; i < weekdaysCount; i++) {
            var day = lastMonth.getDate() - (weekdaysCount - i) + 1;
            var d = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), day);
            console.log(d.getDate());
            //this.injectDay(row, this.viewDate.clone().decrement('month').set('date', y - (weekdaysCount - i) + 1), true);
        }

        //console.log(firstDay.getDay());



    }

    return {
        UTCStringToMilliseconds: UTCStringToMilliseconds,
        UTCStringToSeconds: UTCStringToSeconds,
        UTCStringToLocalDate: UTCStringToLocalDate,
        daysInMonth: daysInMonth
    };
});
