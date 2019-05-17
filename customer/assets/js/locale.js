if (typeof(Endeca) == "undefined") Endeca = {};  

Endeca.Locale = {
	strings : {
		"Preview" : "Preview", // Title for Preview
		"Profile" : "Profile", // Title for Preview Profile
		"Time" : "Time", // Title for Preview Time
		"Submit" : "Submit",
		"Current Time" : "Current Time",
		"Custom Time" : "Custom Time",
		"None" : "None",
		"Audit" : "Audit",
		"Error" : "Error",
		"Unable to connect to InFront Workbench" : "Unable to connect to InFront Workbench",
		"Your site is not configured for Preview correctly.":
			"Your site is not configured for Preview correctly.",
		"The configured preview url doesn't match the url you are trying to preview.":
			"The configured preview url doesn't match the url you are trying to preview.",
		"Please contact your administrator." : "Please contact your administrator.",
		"Content Collection" : "Content Collection",
		"Search Terms" : "Search Terms",
		"Applies at all locations" : "Applies at all locations",
		"NAME" : "NAME", // Audit table headers
		"LOCATION" : "LOCATION", // Audit table headers
		"PROFILE" : "PROFILE", // Audit table headers
		"SCHEDULE" : "SCHEDULE", // Audit table headers
		"PRIORITY" : "PRIORITY", // Audit table headers
		"STATE" : "STATE", // Audit table headers
		"Zone full"	 : "Collection full", // Audit: rule.msg from MDEX
		"Fired" : "Fired" // Audit: rule.msg from MDEX
	},
	// datepicker localization files are also available in the UI svn: http://jquery-ui.googlecode.com/svn/trunk/ui/i18n/
	datepickerDefaults : {
		closeText: 'Done',
		prevText: 'Prev',
		nextText: 'Next',
		currentText: 'Today',
		monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
		weekHeader: 'Wk',
		dateFormat: 'm/d/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	},
	// Time is the same java simple date format
	timeFormat : "h:mm a",
	localizedString : function(string) {
		var localizedString = Endeca.Locale.strings[string];
		if (localizedString)
			return localizedString;
		return string;
	}
};