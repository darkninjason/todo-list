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

    return {
        UTCStringToMilliseconds: UTCStringToMilliseconds,
        UTCStringToSeconds: UTCStringToSeconds,
        UTCStringToLocalDate: UTCStringToLocalDate
    };
});
