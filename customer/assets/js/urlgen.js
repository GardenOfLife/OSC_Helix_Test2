if (typeof(Endeca) == "undefined") Endeca = {};  

/**
 * Contructs a javascript UrlGen object.
 * <p/>
 * var urlg = new UrlGen("N=0") will create a UrlGen object
 * with one parameter.
 * <p/>
 * var urlg = new UrlGen() will create a UrlGen object from the
 * document.location.search object, similar to the Java line:<br/>
 * UrlGen urlg = new UrlGen(request.getQueryString(), "UTF-8").
 * <p/>
 * var urlg = new UrlGen("") will create a UrlGen object 
 * with no parameters.
 * @constructor
 * @param {String} queryString the queryString 
 */
Endeca.UrlGen = function (queryString) {
	if (queryString === undefined) {
		var search = document.location.search;
		if (search) {
			this.paramArray = search.substring(1, search.length).split('&');
		} else {
			this.paramArray = new Array();
		}
	} else if (queryString.length === 0) {
		this.paramArray = [];
	} else {
		this.paramArray = queryString.split('&');
	}
};
Endeca.UrlGen.prototype = {
	/**
	 * Internal array of parameters. The parameters
	 * are Strings representing the name and value, 
	 * separated by the equals sign ("="). e.g. ["N=0", "Ne=8061"].
	 * @type Array
	 */
	paramArray: undefined,
	/**
	 * Gets the given parameter from the internal array.
	 * @type String
	 * @return the value of the given parameter or
	 * <code>null</code> if no param was found.
	 */
	getParam: function (paramName) {
		var retval = null;
		for (var i = 0; i < this.paramArray.length; i++) {
			var param = this.paramArray[i];
			var nameAndValue = param.split('=');
			if (nameAndValue[0] === paramName) {
				retval = decodeURIComponent(nameAndValue[1].replace(/\+/g, '%20'));
				break;
			}
		}
		return retval;
	},
	
	/**
	 * Adds the given parameter name and value to the internal array
	 */
	addParam: function (paramName, paramValue) {
		if (!(paramValue === undefined)) {
			var paramArray = this.paramArray;
			var addToArray = true;
			for (var i = 0; i < paramArray.length; i++) {
				var param = paramArray[i];
				var nameAndValue = param.split('=');
				if (nameAndValue[0] === paramName) {
					paramArray[i] = paramName + '=' + encodeURIComponent(paramValue);
					addToArray = false;
					break;
				}
			}
			if (addToArray) {
				paramArray.push(paramName + '=' + encodeURIComponent(paramValue));
			}
		} 
	},
	
	/**
	 * Adds the given parameter name and value to the internal array,
	 * or removes it if paramValue is empty, null, or undefined
	 */
	setParam: function (paramName, paramValue) {
		if (paramValue === undefined || paramValue === null) {
			this.removeParam(paramName);
		} else {
			this.addParam(paramName, paramValue);
		}
	},
	
	/**
	 * Removes the given parameter from the internal array.
	 * @type String
	 * @return the value of the removed parameter or
	 * <code>null</code> if no param was found.
	 */
	removeParam: function (paramName) {
		var retval = null;
		for (var i = 0; i < this.paramArray.length; i++) {
			var param = this.paramArray[i];
			var nameAndValue = param.split('=');
			if (nameAndValue[0] === paramName) {
				this.paramArray.splice(i, 1);
				retval = unescape(nameAndValue[1]);
				break;
			}
		}
		return retval;
	},
	/**
	 * The query string representation of the parameters in the internal array.
	 * names and values separated by "=", parameters separated
	 * by "&". e.g. "N=0&Ne=8061"
	 * @type String
	 * @return the query string representation or "" if the internal array is empty.
	 */
	toString: function () {
		if (this.paramArray.length) {
			return '?' + this.paramArray.join('&');
		}
		return '';
	}
};