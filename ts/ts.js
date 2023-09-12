(function (global, factory) { "use strict";
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ts = factory());
}(typeof window!='undefined' ? window : this, function() { "use strict";

	var pp = console.log;
	var pd = console.dir;
	var pt = console.table;

// setting VERSION and something
	var NAME = 'Transmit';
	var VERSION = "1.0";

// check sessionStorage length and clear
	var isSupportSessionStorage = typeof sessionStorage==='object';
	if(isSupportSessionStorage) {
		_forEach(sessionStorage, (v, k)=> {
			if(!/^log-ts#/.test(k)) {
				return;
			}
			sessionStorage.removeItem(k);
		});
		// sessionStorage.clear();
	}

	var protocolRegExp = new RegExp('^([^\/:]+){1}:\/\/');

// default use the function start
	function objectType(source) {
		return Object && Object.prototype.toString.call(source);
	}

	function isArrayBuffer(source) {
		return typeof source=='object' && objectType(source)==='[object ArrayBuffer]';
	}

	function isBlob(source) {
		return typeof source=='object' && objectType(source)==='[object Blob]';
	}

	function isStorage(source) {
		return typeof source=='object' && objectType(source)==='[object Storage]';
	}

	function isDataTransfer(source) {
		return typeof source=='object' && objectType(source)==='[object DataTransfer]';
	}

	function isFileList(source) {
		return typeof source=='object' && objectType(source)==='[object FileList]';
	}

	function isFile(source) {
		return typeof source=='object' && objectType(source)==='[object File]';
	}

	function isFormData(source) {
		return typeof source=='object' && objectType(source)==='[object FormData]';
	}

	function isPromise(source) {
		return typeof source=='object' && objectType(source)==='[object Promise]';
	}

	function isAsyncFunction(source) {
		return typeof source=='function' && objectType(source)==='[object AsyncFunction]';
	}

	function isFunction(source) {
		return typeof source=='function' && objectType(source)==='[object Function]';
	}

	function isFunctions(source) {
		return isFunction(source) || isAsyncFunction(source);
	}

	function isNull(source) {
		return !(source!=null && source!=undefined);
	}

	function isElement(source) {
		return typeof source=='object' && (source instanceof Element || source instanceof HTMLElement);
	}

	function isArray(source) {
		return typeof source=='object' && objectType(source)==='[object Array]' && source instanceof Array;
	}

	function isArrays(source) {
		return isArray(source) && source.length;
	}

	function isObject(source) {
		return typeof source=='object' && objectType(source)==='[object Object]';
	}

	function isObjects(source) {
		return isObject(source) && (Object && Object.keys(source).length);
	}

	function isString(source) {
		return typeof source=='string';
	}

	function isStrings(source) {
		return isString(source) && source.trim()!='';
	}

	function isBoolean(source) {
		return typeof source=='boolean';
	}

	function isNumeric(source) {
		return typeof source=='number' || (isStrings(source) && /^\d+$/.test(source));
	}

	function inObject(key, source) {
		if(!isStrings(key) || typeof source!='object' || isNull(source)) {
			return false;
		}
		return key in source;
	}

	function urlinfo(str, type) {
		if(typeof type!=='string' && typeof type!=='number') {
			type = null;
		}
		if(typeof type==='string' && type.trim()==='') {
			type = null;
		}

		str = new String(str).toString();
		var checkRegExp = /([^\/]+)+\/(.+){1}$/;
		if(!checkRegExp.test(str)) {
			return str;
		}

	// set variable
		var explode = str.match(checkRegExp);
		var dirname = explode[1];
		var basename = explode[2];
		var filename, extension, hash, search, protocol, host, hostname, origin, username, password, port, pathname, list, i, key, value;

	// check default start
		if(basename.indexOf('#')!==-1) {
			hash = basename.substring(basename.indexOf('#'));
			basename = basename.substring(0, basename.indexOf('#'));
		}
		if(basename.indexOf("?")!==-1) {
			search = basename.substring(basename.indexOf("?"));
			basename = basename.substring(0, basename.indexOf("?"));
		}
		if(basename.lastIndexOf("/")!==-1) {
			basename = basename.substring(0, basename.lastIndexOf("/"));
			dirname+= `/${basename}`;
			basename = '';
		}else if(basename.lastIndexOf(".")!==-1) {
			extension = basename.substring(basename.lastIndexOf(".") + 1); 
			filename = basename.substring(0, basename.lastIndexOf("."));
		}else if(basename.lastIndexOf(".")===-1) {
			dirname+= `/${basename}`;
			basename = '';
		}

	// default out data
		var implode = {
			original: str,
			dirname: dirname,
			basename: basename,
			extension: extension,
			filename: filename
		};

	// check more setting
		checkRegExp = /^([^\/]+){1}\/\/(([^\/:@]+:[^\/:@]+|[^\/:@]+)+@)*([^\/:@]+){1}(:[^\/:@]+)*(\/.+)*/;
		if(checkRegExp.test(dirname)) {
			explode = dirname.match(checkRegExp);
			origin = `${explode[1]}//${explode[4]}`;
			protocol = explode[1];
			if(explode[3] && explode[3]!=='') {
				username = explode[3];
				if(explode[3].indexOf(':')!==-1) {
					username = explode[3].substring(0, explode[3].indexOf(':'));
					password = explode[3].substring(explode[3].indexOf(':') + 1);
				}
			}
			host = hostname = explode[4];
			if(explode[5] && explode[5]!=='') {
				port = explode[5].substring(explode[5].indexOf(':') + 1);
			}
			if(explode[6] && explode[6]!=='') {
				pathname = `${explode[6]}/${basename}`;
			}
		}

		list = 'search hash protocol host hostname origin username password port pathname'.split(' ');
		list.forEach(key=> {
			value = eval(`${key}`);
			if(value===null || value===undefined) {
				return;
			}
			implode[key] = value;
		});

	// check is use return specify name
		if(typeof type!==null && (type!==null && type!==undefined) && type!=='') {
			list = 'dirname basename filename extension search hash protocol host hostname origin username password port pathname'.split(' ');
			list.forEach((key, i)=> {
				if([i, '' + i, key].indexOf(type)!==-1 && key in implode) {
					value = implode[key];
					return false;
				}
			});
			return value || '';
		}

	// clear variable value
		value = key = i = list = protocol = hostname = host = origin = username = password = port = pathname = search = hash = extension = filename = basename = dirname = explode = checkRegExp = str = null;

		return implode;
	}

	function toObject(source) {
		var firstCharacters = source.substr(0);
		var lastCharacters = source.substr(-1);
		if(!isStrings(source) || (firstCharacters!=='{' && lastCharacters!=='}') && (firstCharacters!=='[' && lastCharacters!==']') || typeof JSON!=='object') {
			return source;
		}
		lastCharacters = firstCharacters = null;
		return JSON.parse(source);
	}

	function toJsonString(source) {
		if(!isObject(source) && !isArray(source) || typeof JSON!=='object') {
			return source;
		}
		return JSON.stringify(source);
	}

	function toNumeric(source) {
		if(!isNumeric(source)) {
			return source;
		}
		if(source.indexOf('.')!==-1) {
			return parseFloat(source);
		}
		return parseInt(source, 10);
	}

	function capitalize(source, all) {
		return (all && (all===true || all===1) ? source.toLowerCase() : source).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
	}

	// default use the function end

//
	function _extend() {
		var src, copy, name, options, clone, maps;
		var target = arguments[0] || {}
		var i = 1;
		var length = arguments.length;
		var deep = false;

		if(isBoolean(target)) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}

		if(typeof target!=='object' && !isFunctions(target)) {
			target = {};
		}

		for(; i < length; i++) {
			if(!isNull(options = arguments[i])) {
				if(isFunctions(target)) {
					maps = utils.grep(options, (value, key)=> { return { key: key, value: value }; });
					if(!isArrays(maps)) {
						continue;
					}
					if(deep===true) {
						utils.bindProps(target, maps);
					}else {
						utils.forEach(maps, object=> {
							if(!isObjects(object)) {
								return;
							}
							target[object.key] = object.value;
						});
					}
					maps = null;
				}else {
					for(name in options) {
						src = target[name];
						copy = options[name];
						if(target===copy) {
							continue;
						}

						if(deep && copy && (isObject(copy) || isArray(copy))) {
							clone = isObject(src) || isArray(src) || isFormData(src) ? src : (isArray(src) ? [] : {});
							target[name] = utils.extend(deep, clone, copy);
						}else if(copy!==undefined) {
							clone = copy;
							if(isFormData(src) && isFormData(copy)) {
								clone = src;
								copy.forEach((val, key)=> clone.append(key, val));
							}else if(isArray(src) && isArray(copy)) {
								clone = [ ...src, ...copy ];
							}else if(isObject(src) && isObject(copy)) {
								clone = { ...src, ...copy };
							}
							target[name] = clone;
						}

						copy = src = null;
					}
				}
			}
		}

		return target;
	}

//
	function _forEach(source, fn, reverse) {
		var check1 = !isObjects(source) && !isStorage(source) && !isArrays(source) && !isFileList(source);
		var check2 = !isFunctions(fn);
		if(check1 || check2) {
			return;
		}
		check2 = check1 = null;

		if(isNumeric(reverse)) {
			reverse = reverse===1;
		}
		if(!isBoolean(reverse)) {
			reverse = false;
		}

		function callfn(v, i) {
			return fn.call(null, v, i);
		}

		var i, k, keys, len;
		if(isArrays(source) || isFileList(source)) {
			len = source.length;
		}else if(isStorage(source)) {
			keys = _grep(source, (v, k)=> { return k; }) || null;
			len = keys && keys.length || 0;
		}else if(isObjects(source)) {
			keys = Object.keys(source) || null;
			len = keys && keys.length || 0;
		}
		if(reverse===true && len > 1) {
			for(i = len - 1; i > 0 ; i--) {
				k = isArrays(keys) ? keys[i] : i;
				callfn(source[k], k);
				k = null;
			}
		}else {
			for(i = 0; i < len; i++) {
				k = isArrays(keys) ? keys[i] : i;
				callfn(source[k], k);
				k = null;
			}
		}
		len = keys = i = null;
	}

//
	function _randomString(size, alphabet) {
		if(!isNumeric(size)) {
			size = 16;
		}
		if(!isStrings(alphabet)) {
			alphabet = 'abcdefghijklmnopqrstuvwxyz';
			alphabet+= alphabet.toUpperCase();
			alphabet+= '0123456789';
		}
		var str = '';
		var length = alphabet.length;
		while(size--) {
			str+= alphabet[Math.random() * length | 0];
		}
		return str;
	}

//
	function _generateID() {
		var id = 'ts#' + utils.randomString();
		if(utils.ids.indexOf(id)!==-1) {
			return _generateID();
		}
		utils.ids.push(id);
		return id;
	}

//
	async function _convertBlob(blob, formats) {
		if(isArrayBuffer(blob)) {
			blob = new Blob([blob]);
		}
		if(!isBlob(blob)) {
			return;
		}
		if(!isStrings(formats) || 'base64 text arraybuffer'.split(' ').indexOf(formats.toLowerCase())===-1) {
			formats = 'text';
		}
		return await new Promise((resolve, reject)=> {
			try {
				var reader = new FileReader();
				reader.onloadend = ()=> resolve(reader.result);
				if(formats.toLowerCase()==='base64') {
					reader.readAsDataURL(blob);
				}else if(formats.toLowerCase()==='arraybuffer') {
					reader.readAsArrayBuffer(blob)
				}else if(formats.toLowerCase()==='text') {
					reader.readAsText(blob);
				}
			}catch(error) {
				var message = `Covert Blob fail, Deatil message:\n${error}`;
				utils.log(message, 0, 3);
				reject(message);
			}
		});
	}

	function _blobAsBase64(blob) {
		return _convertBlob(blob, 'base64');
	}

	function _blobAsText(blob) {
		return _convertBlob(blob, 'text');
	}

//
	function _saveBlobData(blob, filename) {
		if(isArrayBuffer(blob)) {
			blob = new Blob([blob]);
		}
		if(!isBlob(blob)) {
			return;
		}
		var link = document.createElement('a');
		var url = URL.createObjectURL(blob);
		link.href = url;
		link.download = filename;
		link.click();
		link.href = '';
		URL.revokeObjectURL(url);
		link.remove();
		link = null;
	}

//
	function _getCombineURL(configs) {
		if(!isObjects(configs)) {
			return;
		}

		var url = configs.url;
		var baseURL = configs.baseURL;

		var pathURL = url;
		var locInfo = urlinfo(location.href);

		if(isStrings(baseURL)) {
			if(/^(\/){2}.+/.test(baseURL)) {
				baseURL = `${locInfo.protocol}${baseURL}`;
			}
			if(isStrings(url)) {
				if(!protocolRegExp.test(url)) {
					if(/^(\/){1}.+/.test(url) && !/^(\/){1}.+/.test(baseURL)) {
						var baseInfo = urlinfo(baseURL);
						// pp('baseInfo',baseInfo)
						if(isObjects(baseInfo) && protocolRegExp.test(baseInfo.original)) {
							pathURL = `${baseInfo.original}${url}`;
						}
						baseInfo = null;
					}else {
						pathURL = [baseURL, url].join(/^(\/){1}.+/.test(url) ? '' : '/');
					}
				}
			}else {
				pathURL = baseURL;
			}
		}
		// pp('pathURL', pathURL)

	//check pathURL is full url
		if(!protocolRegExp.test(pathURL)) {
			if(/^(\/){1}.+/.test(pathURL)) {
				pathURL = `${locInfo.origin}${pathURL}`;
			}else {
				if(/^(\.\/){1}.+/.test(pathURL)) {
					pathURL = pathURL.substring(2);
				}
				pathURL = `${locInfo.dirname}/${pathURL}`;
			}
		}

		locInfo = baseURL = url = null;

		return pathURL;
	}

//
	function _encryptionRequestData(data, headers) {
		if(typeof Base64==='undefined') {
			return utils.log("Can't find Base64 class module.", 0, 2);
		}
		if(isObjects(data) && typeof headers==='object') {
			return utils.extend(false, headers, {
				'X-Request': Base64.encode(toJsonString(data))
			});
		}
	}

// object grep data
	function _grep(source, fn) {
		if(typeof source!=='object' && typeof source!=='function') {
			return source;
		}
		// var keys = Object.keys(source);
		var keys = Object.getOwnPropertyNames(source);
		var skip;
		if(typeof source==='function') {
			skip = 'name length prototype constructor callee caller arguments'.split(' ');
		}
		var out = null;
		for(var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if(skip && skip.indexOf(key.toLowerCase())!==-1) {
				continue;
			}
			if(!isArray(out)) {
				out = [];
			}
			var value = fn.call(null, source[key], key);
			if(isNull(value)) {
				continue;
			}
			out.push(value);
			value = key = null;
		}
		skip = keys = null;
		return out;
	}

// check configs key and value is not wrong
	function _checkConfigs(configs) {
		if(!isObjects(configs)) {
			return;
		}
		var k, keys = 'async autoContentType cache encryption log baseURL method logRecord timeouts withcredentials responseType url data headers done fail cancel abort error loadend readystatechange timeout download downloadProgress upload uploadProgress'.toLowerCase().split(' ');
		var data = {};
		for(k in configs) {
			var key = k.toLowerCase();
			if(keys.indexOf(key)===-1) {
				data[k] = configs[k];
				delete configs[k];
				continue;
			}
			var value = configs[k];
		// system record log not setting
			if(key==='log') {
				value = null;
			}else if(key==='data') {
				if(!isObjects(value) && !isFormData(value)) {
					value = {};
				}
			}else if(key==='timeouts') {
		// check timeout setting
				if(isStrings(value)) {
					var calc;
					var list = 'h m s'.split(' ');
					var lastCharacters = value.substr(-1);
					if(list.indexOf(lastCharacters)!==-1) {
						value = toNumeric(value.substring(0, value.length - 1));
						if(lastCharacters===list[0]) {
							calc = 60 * 60;
						}else if(lastCharacters===list[1]) {
							calc = 60;
						}else if(lastCharacters===list[2]) {
							calc = 1;
						}
						if(isNumeric(calc)) {
							value*= (calc * 1000);
						}
					}else {
						value = toNumeric(value.replace(/[^\d\.]+/g, ''));
					}
					lastCharacters = list = calc = null;
				}else if(isNumeric(value)) {
					if(value<100) {
						value*= 1000;
					}
				}else {
					value = null;
				}
			}else if('async autoContentType cache encryption logRecord'.toLowerCase().split(' ').indexOf(key)!==-1) {
		// check value is boolean
				if(isNumeric(value)) {
					value = value===1;
				}
				if(!isBoolean(value)) {
					value = false;
				}
				if(key==='encryption' && value===true && typeof Base64==='undefined') {
					var message = [
						"Can't find Base64 class module, `Encryption` now set to false.",
						"Please include the Base64 class module, You can go to [ https://github.com/dankogai ] to get it."
					].join("\n");
					utils.log(message, 0, 2);
					value = false;
				}
			}else if('baseurl method responseType url withcredentials'.toLowerCase().split(' ').indexOf(key)!==-1) {
		// check value is string
				if(isString(value)) {
					if(key==='baseurl' && value.substr(-1)==='/') {
						value = value.substring(0, value.lastIndexOf('/'));
					}else if(key==='responsetype') {
						if('arraybuffer blob document json text'.toLowerCase().split(' ').indexOf(value.toLowerCase())===-1) {
							value = 'text';
						}
					}
				}else {
					value = key==='responsetype' ? 'text' : (key==='method' ? 'get' : null);
				}
			}else if('headers'.toLowerCase().split(' ').indexOf(key)!==-1) {
		// check value is object
				if(!isObject(value)) {
					value = {};
				}
			}else if('done fail cancel abort error loadend readystatechange timeout download downloadProgress upload uploadProgress'.toLowerCase().split(' ').indexOf(key)!==-1) {
		// check value is function
				if(!isFunctions(value)) {
					value = null;
				}
			}
			if(value===null && 'timeouts'.toLowerCase().split(' ').indexOf(key)===-1) {
				delete configs[k];
			}else {
				configs[k] = value;
			}
			value = key = null;
		}
	// merger other
		utils.extend(configs.data, data);
		data = keys = k = null;
		return configs;
	}

// defineProperty
	function _defineProperties(target, props) {
		if((typeof target!=='object' && typeof target!=='function') || !isArrays(props)) {
			return;
		}
		_forEach(props, (descriptor, i)=> {
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = descriptor.configurable || true;
			if(inObject('value', descriptor)) {
				descriptor.writable = descriptor.writable || true;
			}
			Object.defineProperty(target, descriptor.key, descriptor);
		});
	}

// bind object property
	function _bindProps(target, protoProps, staticProps) {
		if(isArrays(protoProps)) _defineProperties(target.prototype, protoProps);
		if(isArrays(staticProps)) _defineProperties(target, staticProps);
		Object.defineProperty(target, 'prototype', { writable: false });
		return target;
	}

// set error message handle
	function _Error(message, fn, status, url, configs) {
		if(!message) {
			return;
		}
		var self = this;
		Error.call(self);
		// self.prototype = Error.prototype;
		if(Error.captureStackTrace) {
			Error.captureStackTrace(self, self.constructor);
		}else {
			self.stack = new Error().stack;
		}
		self.message = message;
		self.name = 'Error';
	//
		var k, v, list = 'fn status url configs'.split(' ');
		list.forEach(k=> { v = eval(k), v && (self[k] = v), v = null; });
		v = k = list = null;

	//check stack is string and split it
		if(isStrings(self.stack)) {
			var limit = 3;
			var stack = self.stack.split("\n");
			if(stack && stack.length > limit) {
			//check first line string
				if(!new RegExp(`^${self.name}:\s${self.message}`).test(stack[0])) {
					stack.splice(0, 0, `${self.name}: ${self.message}`);
				}
				stack = stack.slice(0, limit);
				self.stack = stack.join("\n");
			}
			stack = limit = null;
		}
	}

// add console log added style
//		type as call 0=log, 1=info, 2=warn, 3=error, 4=dir, 5=table
//		mode as color 0=#000, 1=#00d, 2=#440, 3=#f00
	function _log(source, type, mode) {
		var allowType = 'log info warn error dir table'.split(' ');
		if((!isNumeric(mode) && mode!==null && mode!==undefined) || (isNumeric(mode) && mode > 3)) {
			mode = 0;
		}
		if((!isNumeric(type) && !isStrings(type)) || (isNumeric(type) && type > allowType.length) || (isStrings(type) && allowType.indexOf(type)===-1)) {
			type = 0;
		}
		if(isStrings(type)) {
			type = allowType.indexOf(type);
		}

		function nullStyle() {
			return [
				`color: initianl`,
				`background-color: transparent`,
				'margin: 0',
				'padding: 0',
				'line-height: normal'
			].join(';');
		}
		function tsStyle(color, bg) {
			return [
				`color: ${color}`,
				`background-color: ${bg}`,
				'text-transform: uppercase',
				'line-height: normal',
				'margin: 2px 2px 4px',
				'padding: 2px 4px',
				'border-radius: 4px'
			].join(';');
		}
		function getStyle(color, bg) {
			return [
				`color: ${color}`,
				`background-color: ${bg}`,
				`border-left: 4px solid ${color}`,
				'line-height: normal',
				'margin: 2px',
				'padding: 2px 4px',
				'border-radius: 4px'
			].join(';');
		}

		var sType = allowType[type];
		if(!inObject(sType, console)) {
			console.log('%c%s%c\n%c%s', tsStyle('#fff', '#29547e'), NAME, nullStyle(), getStyle('#f00', '#fdd'), `Console not support console.${sType}`);
			return;
		}

		if(type > 1 && !isNull(mode)) {
			mode = null;
		}

		var colorList = ['#000', '#00d', '#440', '#f00'];
		var bgList = ['transparent', '#eef', '#fffbdc', '#fdd'];
		if(!isNull(mode) && (mode >= 0 && mode < 4)) {
			console[sType]('%c%s%c\n%c' + (typeof source==='object' ? '%o' : '%s'), tsStyle('#fff', '#29547e'), NAME, nullStyle(), getStyle(colorList[mode], bgList[mode]), source);
		}else {
			console[sType](source);
		}
		bgList = colorList = sType = allowType = null;
	}

//bind props to _log function
	_bindProps(_log, null, [{
		key: 'add',
		value: function logAdd(fn, status, url, configs, contents) {
			if(!this || !this.id || (this.configs && this.configs.logRecord!==true)) {
				return;
			}
			var log = this.logGet();
			log.push({
				function: fn || null,
				status: status || null,
				url: url || null,
				configs: configs || null,
				contents: contents || null,
				timestamp: new Date().getTime()
			});
			if(isSupportSessionStorage) {
				sessionStorage.setItem(`log-${this.id}`, toJsonString(log));
			}
			log = null;
			return this;
		}
	}, {
		key: 'get',
		value: function logGet() {
			if(!this || !this.id) {
				return;
			}
			var log;
			if(isSupportSessionStorage) {
				log = sessionStorage.getItem(`log-${this.id}`) || [];
				if(isStrings(log)) {
					log = toObject(log);
				}
			}else {
				log = this.log;
			}
			return log;
		}
	}, {
		key: 'show',
		value: function logShow() {
			if(!this || !this.id) {
				return;
			}
			if(this.configs && this.configs.logRecord!==true) {
				return utils.log("Logging not turned on", 0, 2);
			}
			var log = this.logGet();
			if(!log.length) {
				return utils.log("No logs now", 0, 2);
			}
			console.table(log);
			log = null;
			return this;
		}
	}]);

// set adapter start
	async function _Adapter(configs) {
		let self = this;
		return new Promise((resolve, reject)=> {
			utils.checkConfigs(configs);

		//
			var async = configs.async || true;
			var cache = configs.cache || false;
			var baseURL = configs.baseURL;
			var data = configs.data || {};
			var encryption = configs.encryption || false;
			var headers = configs.headers || {};
			var method = (configs.method || 'get').toUpperCase();
			var responseType = configs.responseType || null;
			var timeouts = configs.timeouts || null;
			var url = configs.url || '';
			var withCredentials = configs.withCredentials || false;
			// var isPostMode = inObject('Content-Type', headers) && headers['Content-Type']==="multipart/form-data";
			var isPostMode = 'patch post put'.toUpperCase().split(' ').indexOf(method)!==-1;
			var pathURL = utils.getCombineURL(configs);
			// pp('pathURL', pathURL)

		//check origin
			var isSameOrigin = false;
			var pathInfo = urlinfo(pathURL);
			if(inObject('origin', pathInfo) && isStrings(pathInfo.origin) && isStrings(pathInfo.host)) {
				isSameOrigin = location.origin===pathInfo.origin && location.host===pathInfo.host;
			}
			pathInfo = null;

		//check cache
			var cacheParams;
			if(cache===true) {
				cacheParams = {
					'_': Date.now()
				};
			}

		//check data
			if(isObjects(data) || isFormData(data)) {
				var files = {};
				var formData = {};
				var handleDataFunc = (val, key)=> {
					if(isFile(val)) {
						if(!inObject(key, files)) {
							files[key] = [];
						}
						files[key].push(val);
						return;
					}
					formData[key] = val;
				};
				if(isObjects(data)) {
					utils.forEach(data, handleDataFunc);
				}else if(isFormData(data)) {
					data.forEach(handleDataFunc);
				}
			//check formData is not empty
				if(isObjects(formData)) {
					data = formData;
				}
				if(isObjects(cacheParams)) {
					utils.extend(data, cacheParams);
				}
				if(encryption===true) {
				//encryption data to headers[X-Request]
					headers = utils.encryptionRequestData(data, headers);
					data = null;
				}else {
					if(!isPostMode) {
						if(pathURL.lastIndexOf('?')===-1) {
							pathURL+= '?';
						}
						if(typeof URLSearchParams==='function') {
							pathURL+= new URLSearchParams(data).toString();
						}else {
							pathURL+= utils.grep(data, (value, key)=> {
								return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
							}).join('&');
						}
						data = null;
					}else {
						if(!isFormData(data)) {
							formData = new FormData();
							utils.forEach(data, (v, k)=> formData.append(k, v));
							data = formData;
							formData = null;
						}
					}
				}
			//check files is not empty
				if(isObjects(files)) {
					if(!isFormData(data)) {
						data = new FormData();
					}
					utils.forEach(files, (val, key)=> {
						if(isArrays(val)) {
							utils.forEach(val, file=> data.append(key, file));
						}
					});
				}
				handleDataFunc = formData = files = null;
			}
			cacheParams = null;

		// start XHR request
			try {
				var list;
				var xhr = new XMLHttpRequest();
				xhr.open(method, pathURL, async);

				// xhr.setRequestHeader('X-Referer', location.href);
				// xhr.setRequestHeader('Referer', 'no-referer');

				if(isSameOrigin!==true) {
					// var allowHeaders = 'X-Requested-With Content-Type'.split(' ');
					// if(isObjects(headers)) {
					// 	utils.forEach(headers, (val, key)=> {
					// 		if(!/^(x-){1}/i.test(key) || allowHeaders.indexOf(key)!==-1) {
					// 			return;
					// 		}
					// 		allowHeaders.push(key);
					// 	});
					// }
					// xhr.setRequestHeader('Access-Control-Request-Origin', location.origin);
					// xhr.setRequestHeader('Access-Control-Request-Methods', method);
					// xhr.setRequestHeader('Access-Control-Request-Headers', allowHeaders.join(', '));
					// xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
					// allowHeaders = null;
				}

				if(isPostMode && !inObject('Content-Type', headers || {})) {
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				}

				if(isObjects(headers)) {
					utils.forEach(headers, (val, key)=> {
						if(key==='Content-Type' && !isStrings(val)) {
							return;
						}
						xhr.setRequestHeader(key, val);
					});
				}

				if(timeouts!==null &&　timeouts!==0) {
					xhr.timeout = timeouts;
				}

				if(withCredentials!==null) {
					xhr.withCredentials = withCredentials;
				}

				if(responseType!==null && configs.autoContentType!==true) {
					xhr.responseType = responseType;
				}else {
					if(/\.(avif|bmp|gif|ico|jp(e)*g|png|webp){1}/i.test(pathURL)) {
						xhr.responseType = 'blob';
					}else if(/\.(7z|au|avi|gz|mid(i)*|mov|mp(3|4)+|mp(e)*g|ra(m)*|rar|tar|ts){1}/i.test(pathURL)) {
						xhr.responseType = 'arraybuffer';
					}else if(/\.((x)*htm(l)*|xml){1}/i.test(pathURL)) {
						xhr.responseType = 'document';
					}else if(/\.(json){1}/i.test(pathURL)) {
						xhr.responseType = 'json';
					}else {
						xhr.responseType = 'text';
					}
				}

				list = 'downloadProgress uploadProgress'.split(' ');
				list.forEach(k=> {
					if(!inObject(k, configs) || !isFunctions(configs[k])) {
						return;
					}
					var targetObject = k==='uploadProgress' ? xhr.upload : xhr;
					if(isNull(targetObject)) {
						return;
					}
					var type = k.replace('Progress', '');
					targetObject.addEventListener('progress', utils.progress(configs[k], type));
					type = targetObject = null;
				});
				list = null;

				var errorProcessing = function(message, fn) {
					return new utils.error(message, `XMLHttpRequest.${fn}`, xhr.status || -1, xhr.responseURL || pathURL, configs);
				}

				list = 'abort error timeout loadend readystatechange'.split(' ');
				list.forEach(k=> {
					xhr[`on${k}`] = async function() {
						if(!xhr) {
							return;
						}
						var message;
						if('abort error timeout'.split(' ').indexOf(k)!==-1) {
							if(k==='abort') {
								return;
							}
							if(k==='timeout') {
								message = timeouts ? `Timeout of ${timeouts}ms exceeded` : 'Timeout exceeded';
							}else if(k==='abort') {
								message = 'Request aborted';
							}else if(k==='error') {
								if('arraybuffer blob'.split(' ').indexOf(configs.responseType.toLowerCase())!==-1) {
									// pp(configs)
									// return;
								}
								message = 'Network Error';
								if(isSameOrigin!==true) {
									message+= ' Or Origin has been blocked by CORS policy';
								}
							}
							reject(errorProcessing(message, k));
						}else if(k==='readystatechange') {
							if(xhr.status===0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:')===0)) {
								return;
							}
							if(xhr.readyState===2) {
							}else if(xhr.readyState===3) {
							}
							if(inObject('onloadend', xhr) || xhr.readyState!==4) {
								return;
							}
							return setTimeout(xhr.onloadend);
						}else if('loadend'.split(' ').indexOf(k)!==-1) {
							var responseHeaders = {};
							var allResponseHeaders = xhr.getAllResponseHeaders();
							allResponseHeaders.split("\r\n").forEach(value=> {
								if(!isStrings(value)) {
									return;
								}
								var key = value.match(/^([^:]+){1}:(\s)*(.+){1}$/)[1];
								responseHeaders[key] = xhr.getResponseHeader(key);
								key = null;
							});
							allResponseHeaders = null;
						//
							var responseData = !xhr.responseType || xhr.responseType === 'text' || xhr.responseType === 'json' ? xhr.responseText : xhr.response;
							var response = {
								function: k,
								configs: configs,
								data: responseData,
								headers: responseHeaders,
								url: xhr.responseURL || pathURL,
								type: xhr.responseType,
								status: xhr.status,
								statusText: xhr.statusText,
								request: xhr
							};
							responseData = responseHeaders = null;
							if(!response.status || (response.status>=200 && response.status<300)) {
								resolve(response);
							}else {
								message = 'Request failed with status code ' + response.status;
								reject(errorProcessing(message, k));
							}
							response = null;
						}
						message = xhr = null;
					};
				});
				list = null;

				xhr.send(data || null);
			}catch(error) {
				reject(errorProcessing(error, 'adapter.catch'));
			}
		}).then(async function onResolve(response) {
			var fn = response.function;
		//log add
			self.logAdd(`XMLHttpRequest.${fn}`, response.status, response.url, configs);

		//convert data
			var responseHeaders = response.headers;
			var responseData = response.data;
			var contentType = response.request.getResponseHeader("content-type") || '';
			if(contentType.includes("application/json")) {
				if(isArrayBuffer(responseData)) {
					responseData = String.fromCharCode.apply(String, new Uint8Array(responseData));
				}else if(isBlob(responseData)) {
					responseData = await utils.blobAsText(responseData);
				}
				if(isStrings(responseData)) {
					responseData = toObject(responseData);
				}
			}else if(contentType.includes("video/") || contentType.includes("image/")) {
				if(isArrayBuffer(responseData) || isBlob(responseData)) {
				//convert to base64
					// responseData = await utils.blobAsBase64(responseData);
				//for download
					// utils.saveBlobData(responseData, urlinfo(response.url, 1));
				}
			}

		// setting response data
			var dataResponse = {
				status: response.status,
				statusText: response.statusText,
				url: response.url,
				data: responseData,
				headers: responseHeaders
			};

		// check user custome return function
			var exlist = {
				abort: 'cancel',
				error: 'fail',
				loadend: 'done'
			};

			var callFunc;
			if(inObject(fn, exlist) && inObject(exlist[fn], configs) && isFunctions(configs[exlist[fn]])) {
				callFunc = configs[exlist[fn]];
			}else if(inObject(fn, configs) && isFunctions(configs[fn])) {
				callFunc = configs[fn];
			}
			if(isFunctions(callFunc)) {
				return callFunc.call(self, dataResponse);
			}
			callFunc = exlist = contentType = responseData = responseHeaders = null;

			return dataResponse;
		}, function onReject(error) {
			if(isObjects(error)) {
			// add log
				var argus = [];
				var list = 'fn status url configs'.split(' ');
				list.forEach(k=> { argus.push(error[k] || null); });
				list = null;
				argus.push(error.message);
				self.logAdd.apply(self, argus);
				argus = null;
			//
				if(inObject('stack', error)) {
					utils.log(error.stack, 0, 3);
				}
			}
		});
	}

//dispatch request
	function _dispatchRequest(configsOrUrl, configsOrMethod, usersConfigs) {
		var isMethod = isStrings(configsOrMethod) ? utils.allowMethod.indexOf(configsOrMethod)!==-1 : false;
		var cloneAndMergerData = function(config1, config2) {
			var data = utils.extend(false, config1 || {}, config2);
			if(!inObject('data', data)) {
				data.data = {};
			}
			utils.checkConfigs(data);
			return data;
		};
		if(isStrings(configsOrUrl)) {
			usersConfigs = usersConfigs || {};
			if(isFormData(usersConfigs)) {
				usersConfigs = {
					data: usersConfigs
				};
			}
			usersConfigs.url = configsOrUrl;
			if(isMethod) {
				usersConfigs.method = configsOrMethod;
			}else {
				if(isObjects(configsOrMethod)) {
					usersConfigs = cloneAndMergerData(usersConfigs, configsOrMethod);
				}else if(isFormData(configsOrMethod)) {
					usersConfigs.data = configsOrMethod;
				}
			}
		}else {
			if(isMethod) {
				usersConfigs = usersConfigs || {};
				usersConfigs.method = configsOrMethod;
			}else {
				if(isObjects(configsOrUrl)) {
					usersConfigs = cloneAndMergerData(usersConfigs, configsOrUrl);
				}else if(isFormData(configsOrUrl)) {
					usersConfigs = usersConfigs || {};
					usersConfigs.data = configsOrUrl;
				}
			}
		}
		var instanceConfigs = utils.extend(false, this.configs, usersConfigs);
		var promise;
		try {
			promise = utils.adapter.call(this, instanceConfigs);
		}catch(erorr) {
			return Promise.reject(new utils.error(error, 'request.catch'));
		}
		return promise;
	}

	function _speedometer(samplesCount, min) {
		samplesCount = samplesCount || 10;
		var bytes = new Array(samplesCount);
		var timestamps = new Array(samplesCount);
		var head = 0;
		var tail = 0;
		var firstSampleTS;
		min = min !== undefined ? min : 1000;
		return function push(chunkLength) {
			var now = Date.now();
			var startedAt = timestamps[tail];
			if(!firstSampleTS) {
				firstSampleTS = now;
			}
			bytes[head] = chunkLength;
			timestamps[head] = now;
			var i = tail;
			var bytesCount = 0;
			while(i !== head) {
				bytesCount += bytes[i++];
				i = i % samplesCount;
			}
			head = (head + 1) % samplesCount;
			if(head === tail) {
				tail = (tail + 1) % samplesCount;
			}
			if(now - firstSampleTS < min) {
				return;
			}
			var passed = startedAt && now - startedAt;
			return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
		};
	}

//dispatch progress
	function _dispatchProgress(listener, type) {
		var bytesNotified = 0;
		var speedometer = _speedometer(50, 250);
		return function(e) {
			var loaded = e.loaded;
			var total = e.lengthComputable ? e.total : undefined;
			var progressBytes = loaded - bytesNotified;
			var rate = speedometer(progressBytes);
			var inRange = loaded <= total;
			bytesNotified = loaded;
			var data = {
				loaded: loaded,
				total: total,
				progress: total ? loaded / total : undefined,
				bytes: progressBytes,
				rate: rate ? rate : undefined,
				estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
				event: e
			};
			data[type] = true;
			listener(data);
		};
	}

//dispatch download
	function _dispatchDownload(response) {
		if(!this || !isObjects(this.configs)) {
			return;
		}
		var self = this;
		if(isStrings(response) && !/(\n|\r|\t|\s)+/.test(response)) {
			var configs = utils.extend(false, self.configs, {
				url: response,
				timeouts: false
			});
			var url = utils.getCombineURL(configs);
			if(isStrings(url) && /^([^\/:]+){1}:\/\/.+/.test(url)) {
				return self(url, configs).then(data=> {
					if(!isObjects(data) || data.status!==200) {
						utils.log(`Error: Failed to get data`, 0, 3);
						return;
					}
					return self.save(data);
				});
			}
			url = configs = null;
		}
		if(!isObjects(response) || !inObject('data', response) || !inObject('url', response)) {
			utils.log(`Error: Wrong request method\n${toJsonString(response)}`, 0, 3);
			return;
		}
		self.logAdd('save', response.status, response.url);
	//check is object data
		if(isObject(response.data) || isArray(response.data)) {
			response.data = toJsonString(response.data);
		}
	//check is string and convert to blob
		if(isStrings(response.data)) {
			response.data = new Blob([response.data]);
		}
		return utils.saveBlobData(response.data, urlinfo(response.url, 1));
	}

//dispatch upload
	function _dispatchUpload(response, sendName) {
		if(!isStrings(sendName)) {
			sendName = 'files';
		}
		if(!this || !isObjects(this.configs)) {
			return;
		}
		var self = this;
	//check is array and list is file object
		if(isArrays(response) || isFileList(response) || isFormData(response)) {
			var files;
			if(isFormData(response)) {
				files = [];
				response.forEach((file, key) => {
					if(!isFile(file)) {
						return;
					}
					files.push(file);
				});
			}else {
				files = isFileList(response) ? response : utils.grep(response, file=> {
					if(!isFile(file)) {
						return;
					}
					return file;
				});
			}
		//check files array is empty
			if(!isArrays(files) && !isFileList(files)) {
				utils.log(`Error: Not any file`, 0, 3);
				return;
			}
		//
			var data;
			if(isFormData(response)) {
				data = response;
			}else {
				if(files.length > 1 && !/(\[\]){1}$/.test(sendName)) {
					sendName = `${sendName}[]`;
				}
				data = new FormData();
				utils.forEach(files, file=> data.append(sendName, file));
			}
			var configs = utils.extend(false, self.configs, {
				headers: {
					'Content-Type': false
				},
				timeouts: false,
				method: 'post',
				data: data
			});
			var url = utils.getCombineURL(configs);
			if(isStrings(url) && /^([^\/:]+){1}:\/\/.+/.test(url)) {
				return self(url, configs);
			}
			url = configs = data = files = null;
		}
	// not run request show error
		utils.log(`Error: Wrong request method\n${toJsonString(response)}`, 0, 3);
	}

// set allow method array list
	var _allowMethod = 'get head put post patch delete options'.split(' ');

	var utils = {
		adapter: _Adapter,
		allowMethod: _allowMethod,
		bindProps: _bindProps,
		blobAsBase64: _blobAsBase64,
		blobAsText: _blobAsText,
		checkConfigs: _checkConfigs,
		convertBlob: _convertBlob,
		defineProperties: _defineProperties,
		download: _dispatchDownload,
		encryptionRequestData: _encryptionRequestData,
		error: _Error,
		extend: _extend,
		forEach: _forEach,
		generateID :_generateID,
		getCombineURL: _getCombineURL,
		grep: _grep,
		progress: _dispatchProgress,
		randomString: _randomString,
		request: _dispatchRequest,
		upload: _dispatchUpload,
		ids: [],
		log: _log,
		saveBlobData: _saveBlobData
	};

// create Transmit function
	var Transmit = function() {
		function Transmit(instanceConfigs) {
			if(!(this instanceof Transmit)) {
				throw new TypeError("Cannot call a class as a function");
			}
			this.id = utils.generateID();
			this.log = [];
			this.configs = instanceConfigs;
		}
	//
		function createBind(name, fn) {
			if(!fn) { fn = name; }
			var fns = fn.indexOf('.')!==-1 ? eval(`utils.${fn}`) : utils[fn];
			return { key: name, value: function() { return fns.apply(this, arguments); } };
		}
	//
		var bindCache = [];
		var bindList = 'download request upload'.split(' ');
		utils.forEach(bindList, key=> {
			bindCache.push(createBind(key));
			if(key==='download') {
				bindCache.push(createBind('save', key));
			}
		});
	//
		bindList = 'add get show'.split(' ');
		utils.forEach(bindList, fn=> {
			bindCache.push(createBind(`log${capitalize(fn)}`, `log.${fn}`));
		});
		bindList = null;
	//
		utils.bindProps(Transmit, bindCache);
		bindCache = null;
		return Transmit;
	}();

// add request all method
	utils.forEach(utils.allowMethod, function(method) {
		var isForm = 'put post patch'.split(' ').indexOf(method)!==-1;
		var callFunc = function(urlOrData, configs) {
			var config = utils.extend(false, configs || {}, {
				url: isStrings(urlOrData) ? urlOrData : ((configs || {}).url || ''),
				method: method,
				data: isObjects(urlOrData) || isFormData(urlOrData) ? urlOrData : ((configs || {}).data || {})
			});
			if(isForm) {
				config.headers = utils.extend(false, config.headers, {
					'Content-Type': 'multipart/form-data'
				});
			}
			return this.request.call(this, config);
		};
		Transmit.prototype[method] = callFunc;
		if(isForm) {
			Transmit.prototype[method + 'Form'] = callFunc;
		}
	});

// create instance function
	function _createInstance(defaultConfigs) {
		if(!isFunction(XMLHttpRequest)) {
			throw new utils.error('The browser does not support XMLHttpRequest');
			return;
		}
		utils.checkConfigs(defaultConfigs);
		var context = new Transmit(defaultConfigs);
		var instance = function instance() {
			return Transmit.prototype.request.apply(context, arguments);
		};
		Object.getOwnPropertyNames(Transmit.prototype).forEach(key=> {
			if('constructor'.split(' ').indexOf(key)!==-1) {
				return;
			}
			if(key==='log') {
				instance[key] = [];
			}else {
				var fn = Transmit.prototype[key];
				instance[key] = function() {return fn.apply(this, arguments)};
			}
		});
		utils.extend(instance, context);
		
		// instance.data = function data(instanceData) {
		// 	if(isObjects(instanceData)) {
		// 		utils.extend(this.configs.data, instanceData);
		// 	}
		// 	return this;
		// };

		instance.create = function create(instanceConfigs) {
			return _createInstance(utils.extend(false, defaultConfigs, instanceConfigs));
		};
		return instance;
	}

// default options
	var defaultsConfigs = {
		async: true,
		autoContentType: true,
		baseURL: null,
		cache: false,
		data: {},
		encryption: false,
		headers: {},
		log: null,
		logRecord: true,
		method: 'get',
		responseType: 'text',
		timeouts: 0,
		url: null,
		withCredentials: false
	};

// return to globals setting
	var transmit = _createInstance(defaultsConfigs);
	// transmit.utils = utils;
	transmit.VERSION = VERSION;
	transmit.Transmit = Transmit;

	return transmit;

}));