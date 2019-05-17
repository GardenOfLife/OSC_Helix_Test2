if (typeof(Endeca) == "undefined") Endeca = {};

Endeca.Util = {

    PROFILES_PARAM : 'Endeca_profiles',
    TIME_PARAM : 'Endeca_time',
    DEVICE_PARAM : 'Endeca_device',
    AUDIT_PARAM : 'Endeca_audit',

    setCookie : function(c_name, c_value) {
        document.cookie = c_name + "=" + encodeURIComponent(c_value);
    },
    
    getCookie : function(c_name) {
        var i, x, y, cookies = document.cookie.split(";");
        for (i = 0; i < cookies.length; i++)
        {
            x = cookies[i].substr(0, cookies[i].indexOf("="));
            y = cookies[i].substr(cookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, ""); // trim
            if (x == c_name)
            {
                // For whatever reason, java escapes spaces as plus signs ("+"), but javascript does not decode plus signs.
                return decodeURIComponent(y.replace(/\+/g, '%20')); 
            }
        }
        return null;
    },
    
    _scrollbarWidth : undefined,    
    _getScrollbarWidth : function() {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild (inner);

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
    },
    
    scrollbarWidth : function() { 
        if (this._scrollbarWidth === undefined) {
            this._scrollbarWidth = this._getScrollbarWidth();
        }
        return this._scrollbarWidth;
    },
    
    formatPreviewTime : function(value) {
        var datepickerDefaults = Endeca.Locale.datepickerDefaults;
        if (!datepickerDefaults)
            throw 'Endeca.Locale.datepickerDefaults must be specified';
        if (!Endeca.Locale.timeFormat)
            throw 'Endeca.Locale.timeFormat must be specified';
        
        var dateAndTime = value.split("T");
        
        var d = Endeca.jQuery.datepicker.parseDate(Endeca.Controls.Preview.DATE_FORMAT, dateAndTime[0]);
        var t = Endeca.Util.parseTime(Endeca.Controls.Preview.TIME_FORMAT, dateAndTime[1]);
        
        return Endeca.jQuery.datepicker.formatDate(datepickerDefaults.dateFormat, d, datepickerDefaults) 
            + " " + Endeca.Util.formatTime(Endeca.Locale.timeFormat, t);
    },
    
    /**
     * Time is the java format
     * a    Am/pm marker (PM)
     * H    Hour in day (0-23)
     * k    Hour in day (1-24)
     * K    Hour in am/pm (0-11)
     * h    Hour in am/pm (1-12)
     * m    Minute in hour (0-60)
     * '...' - literal text
     */
    formatTime : function(format, date) {
        // Based on the jquery.ui.datepicker formatDate implementation
        if (!date)
            return '';
        var hours = date.getHours();
        // Check whether a format character is doubled
        var lookAhead = function(match) {
            var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
            if (matches)
                iFormat++;
            return matches;
        };
        // Format a number, with leading zero if necessary
        var formatNumber = function(match, value, len) {
            var num = '' + value;
            if (lookAhead(match))
                while (num.length < len)
                    num = '0' + num;
            return num;
        };
        var output = '';
        var literal = false;
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal)
                if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                    literal = false;
                else
                    output += format.charAt(iFormat);
            else
                switch (format.charAt(iFormat)) {
                    case 'H':
                        output += formatNumber('H', hours, 2);
                        break;
                    case 'k':
                        output += formatNumber('k', (hours + 23) % 24 + 1, 2);
                        break;
                    case 'K':
                        output += formatNumber('K', hours % 12, 2);
                        break;
                    case 'h':
                        output += formatNumber('h', (hours + 11) % 12 + 1, 2);
                        break;
                    case 'm':
                        output += formatNumber('m', date.getMinutes(), 2);
                        break;
                    case 'a':
                        output += hours > 12 ? 'PM' : 'AM';
                        break;
                    case "'":
                        if (lookAhead("'"))
                            output += "'";
                        else
                            literal = true;
                        break;
                    default:
                        output += format.charAt(iFormat);
                }
        }
        return output;
        
    },
    
    /**
     * Return a new Date(), with the hours and minutes set to the values parsed from the value,
     * given the format.
     */
    parseTime: function (format, value) {
        // Based on the jquery.ui.datepicker parseDate implementation
        if (format === null || value === null)
            throw 'Invalid arguments';
        value = (typeof value == 'object' ? value.toString() : value + '');
        if (value === '')
            return null;
        var hours = 0;
        var minutes = -1;
        var literal = false;
        // Check whether a format character is doubled
        var lookAhead = function(match) {
            var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
            if (matches)
                iFormat++;
            return matches;
        };
        // Extract a number from the string value
        var getNumber = function(match) {
            lookAhead(match);
            var digits = new RegExp('^\\d{1,2}');
            var num = value.substring(iValue).match(digits);
            if (!num)
                throw 'Missing number at position ' + iValue + ' for "' + match + '"';
            iValue += num[0].length;
            return parseInt(num[0], 10);
        };
        var getMarker = function(match) {
            lookAhead(match);

            var mark = value.substring(iValue, iValue + 2);
            if (mark.toUpperCase() == 'AM' || mark.toUpperCase() == 'PM') {
                iValue += 2;
                if (mark.toUpperCase() == 'PM') {
                    hours += 12;
                }
            } else {
                throw 'Expected "AM" or "PM" at position ' + iValue;
            }
            return true;
        };
        // Confirm that a literal character matches the string value
        var checkLiteral = function() {
            if (value.charAt(iValue) != format.charAt(iFormat))
                throw 'Unexpected literal at position ' + iValue;
            iValue++;
        };
        var iValue = 0;
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal)
                if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                    literal = false;
                else
                    checkLiteral();
            else
                switch (format.charAt(iFormat)) {
                    case 'H':
                        hours += getNumber('H');
                        break;
                    case 'h':
                        hours += getNumber('h');
                        break;
                    case 'K':
                        hours += getNumber('K');
                        break;
                    case 'k':
                        hours += getNumber('k');
                        break;
                    case 'm':
                        minutes = getNumber('m');
                        break;
                    case 'a':
                        getMarker('a');
                        break;
                    case "'":
                        if (lookAhead("'"))
                            checkLiteral();
                        else
                            literal = true;
                        break;
                    default:
                        checkLiteral();
                }
        }
        if (iValue < value.length) {
            throw "Extra/unparsed characters found in date: " + value.substring(iValue);
        }
        
        var date = new Date();
        
        if (hours) {
            date.setHours(hours % 24);
        }
        if (minutes >= 0 && minutes <= 59) {
            date.setMinutes(minutes);
        }
        
        return date;
    },
    
    changeTime : function () {
        var element = Endeca.jQuery('#clock')[0],
            d = new Date();
        
        element.innerHTML = Endeca.Util.formatTime(Endeca.Locale.timeFormat, d);
        
        setTimeout(Endeca.Util.changeTime, (60 - d.getSeconds())*1000);
    },

    isAuditEnabled : function () {
        return this.getCookie(this.AUDIT_PARAM) === "true";
    }

};