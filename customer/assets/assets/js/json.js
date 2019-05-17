if (typeof(Endeca) == "undefined") Endeca = {};  

Endeca.JSON = {
	parse : function(value) {
		return Endeca.jQuery.parseJSON(value);
	},

	stringify : function(object) {
		try {
			return JSON.stringify(object);
		} catch (e) {
			return Endeca.JSON._stringify(object);
		}
	},
	
	_stringify : function(object) {
		if (!object) {
			return null;
		} else if (typeof(object) == 'string') {
			return Endeca.JSON._toJSONString(object);
		} else if (typeof(object) == 'number') {
			return object;
		} else if (typeof(object) == 'boolean') {
			return object;
		} else if (typeof(object) == 'object') {
			if (object instanceof Array) {
				return Endeca.JSON._toJSONArray(object);
			} else {
				return Endeca.JSON._toJSONObject(object);
			}
		} else {
			return null;
		}
	},
	
	_toJSONString : function(string) {
		return '"' + 
			string.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/,'\\n').replace(/\t/,'\\t') + 
			'"';
	},
	
	_toJSONArray : function(array) {
		var json = '[';
		for (var i = 0; i < array.length; i++) {
			if (i > 0) {
				json += ', ';
			}
			json += Endeca.JSON._stringify(array[i]);
		}
		return json + ']';
	},
	
	_toJSONObject : function(object) {
		var json = '{';
		var i = 0;
		for (var key in object) {
			if (i > 0) {
				json += ', ';
			}
			json += Endeca.JSON._toJSONString(key) + ':' + Endeca.JSON._stringify(object[key]);
			i++;
		}
		return json + '}';
	}
};