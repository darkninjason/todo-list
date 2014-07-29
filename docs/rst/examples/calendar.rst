built.core.calendar.calendar
=======================================


.. _example.calendar.firstOfMonth:

firstOfMonth
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var date = new Date(2012, 7, 29);
    var first = calendar.firstOfMonth(date);
    // first == Date object

.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var first = calendar.firstOfMonth();


.. _example.calendar.previousMonthForYearMonth:

previousMonthForYearMonth
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var first = calendar.previousMonthForYearMonth(2012, 9);
    // first == Date object


.. _example.calendar.nextMonthForYearMonth:

nextMonthForYearMonth
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var first = calendar.nextMonthForYearMonth(2012, 9);
    // first == Date object


.. _example.calendar.previousMonthForDate:

previousMonthForDate
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var first = calendar.previousMonthForDate(new Date());
    // first == Date object

.. _example.calendar.nextMonthForDate:

nextMonthForDate
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var date = new Date(2012, 6, 29);
    var first = calendar.nextMonthForDate(date);
    // first == Date object
    // first.getFullYear() == 2012
    // first.getMonth() == 7
    // first.getDate() == 1


.. _example.calendar.daysInJavaScriptMonth:

daysInJavaScriptMonth
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var first = calendar.daysInJavaScriptMonth(2013, 1);
    // first == 28



.. _example.calendar.calendarMonthDays:

calendarMonthDays
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var days = calendar.calendarMonthDays(2013, 9);
    // days == 30


.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var date = new Date(2012, 7, 29);
    var results = calendar.calendarMonthDays(date, null, {useDates: true});
    // days == 31



.. _example.calendar.bufferedCalendarMonthDays:

bufferedCalendarMonthDays
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var date = new Date(2012, 7, 29);
    var results = calendar.bufferedCalendarMonthDays(date, null, {useDates: true});
    // results.length == 42
    // results[0] == a Date Obj


.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var date = new Date(2012, 7, 29);
    var results = calendar.bufferedCalendarMonthDays(date, null, {useDates: true});
    // results.length == 31
    // results[0] == Date (useDates was set to true true)


.. _example.calendar.bufferedCalendarMonthWeeks:

bufferedCalendarMonthWeeks
----------------------------------
.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {prefixDays: false});
    // results[0] == an array (len 7) of numbers (date in the month)

.. code-block:: js

    var calendar = require('built/core/calendar/calendar');
    var result    = calendar.bufferedCalendarMonthWeeks(2013, 1, {prefixDays: false, useDates: true});
    // results[0] == an array (len 7) of Date's



