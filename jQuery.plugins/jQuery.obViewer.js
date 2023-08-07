;(function($, win){
	"use strict";
	if(type($)!=='function') {
		return console.error("Can't use jQuery!");;
	}
	function type() {
		return arguments[0] && typeof arguments[0];
	}
	function isJQuery() {
		if(!arguments[0] || type(arguments[0])!=='object') {
			return false;
		}
		return 'jquery' in arguments[0] && arguments[0].length;
	}
	function isElement() {
		return isObject(arguments[0]) && (arguments[0] instanceof Element || arguments[0] instanceof HTMLElement);
	}
	function isString() {
		return type(arguments[0])==='string';
	}
	function isStrings() {
		return isString(arguments[0]) && arguments[0].trim()!=='';
	}
	function isArray() {
		return isObject(arguments[0]) && arguments[0] instanceof Array;
	}
	function isArrays() {
		return isArray(arguments[0]) && arguments[0].length;
	}
	function isObject() {
		return typeof arguments[0]=='object' && arguments[0]!=null;
	}
	function isObjects() {
		return isObject(arguments[0]) && (Object && Object.keys(arguments[0]).length);
	}
	function isFunction() {
		return type(arguments[0])==='function';
	}
	function isNull() {
		return !(arguments[0]!=null && arguments[0]!=undefined);
	}
	function inObject() {
		if(!isStrings(arguments[0]) || !isObjects(arguments[1])) {
			return false;
		}
		return arguments[0] in arguments[1];
	}

	function obViewer() {
		return new obViewer.fn._packs._init(arguments[0], arguments[1], arguments[2]);
	}
	obViewer.fn = obViewer.prototype = {
		_packs: {
			_options: {
				selector: '*[data-viewer-title]',
				ratioRange: 0.29411764705882354
			},
			_self: function() {
				return arguments[0] && arguments[0]===obViewer.fn ? arguments[0] : obViewer.fn;
			},
			_setOptions: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'setOptions';
				if(isObjects(this)) {
					const allowList = ['selector', 'ratioRange', 'container', 'element', 'updated', 'done', 'complete'];
					Object.keys(this).forEach((k)=> {
						if(allowList.indexOf(k)===-1) {
							return;
						}
						if(k==='root') {
							pack._setContainer.call(this[k]);
						}else if(k==='element') {
							pack._setElement.call(this[k]);
						}else if(k==='updated') {
							pack._setUpdated.call(this[k]);
						}else if(['done', 'complete'].indexOf(k)!==-1) {
							pack._setCallback.call(this[k]);
						}else {
							$.extend(self.options, { [k]: this[k] });
						}
					});
				}
				return self;
			},
			_setContainer: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'setContainer';
				if(isElement(this)) {
					self.container = this;
				}
				return self;
			},
			_setElement: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'setElement';
				if(isElement(this)) {
					self.element = this;
				}
				return self;
			},
			_setUpdated: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'setUpdated';
				if(isFunction(this)) {
					self.updated = this;
				}
				return self;
			},
			_setCallback: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'setCallback';
				if(isFunction(this)) {
					self.callback = this;
				}
				return self;
			},
			_plusTop: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'plusTop';
				return Math.ceil((window.innerHeight / 100) * 25);
			},
			_scrollTop: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'scrollTop';
				let top = self.container.scrollTop || document.documentElement.scrollTop;
				return top;
			},
			_updated: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'updated';
				if(!isElement(self.element)) {
					return self;
				}
			//
				const callRun = (text)=> {
					$(self.element).text(text);
				};
			//
				let living = self.living || null;
				let text = '';
				if(!isArrays(living)) {
					callRun(text);
					return self;
				}
				$.when(function() {
					if(living.length===1) {
						return;
					}
					let x = {};
					let g = -1;
					$.when($(living).each((i, v)=> {
						const plusTop = pack._plusTop();
						let domScrollTop = pack._scrollTop();
						if(self.container!==document.documentElement && self.container!==document.body && self.container.offsetTop) {
							domScrollTop+= self.container.offsetTop;
						}
						const domHeight = domScrollTop + window.innerHeight;
						const offsetTop = v.offsetTop;
						const offsetHeight = v.offsetHeight;
						const offsetEnd = offsetTop + offsetHeight;
						let calc = 0;
					//
						if(domScrollTop>=v.offsetTop) {
							calc = offsetEnd - domScrollTop;
						}else {
							if(offsetEnd>=domHeight) {
								calc = domHeight - offsetTop;
							}else {
								calc = offsetHeight;
							}
						}
						if(calc>g) {
							g = calc;
						}
						x[calc] = v;
					})).then(()=> {
						living = $(living).filter((i, v)=> {
							if(v!==x[g]) {
								return;
							}
							return v;
						});
					});
				}()).then(()=> {
					if(living.length===1) {
						text = $(living[0]).attr('data-viewer-title');
					}
					callRun(text)
				});
				return self;
			},
			_createobViewer: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'createobViewer';
				if(!isArrays(self.targets)) {
					console.error("Create obViewer: not find targets.");
					return pack._end();
				}
				if(!isElement(self.element)) {
					console.error("Create obViewer: not find element.");
					return pack._end();
				}
				const options = self.options;
				const setting = {
					living: null,
					listen: [],
					previous: {
						visibleEntryTop: 0,
						parentScrollTop: 0
					}
				};
				$.extend(self, setting);
			// set listen
				self.targets.forEach((el, i)=> {setting.listen[i] = null});
			//
				self.obViewer = new IntersectionObserver(entries=> {
					const updated = ()=> {
						if(!isNull(self.cache)) {
							clearTimeout(self.cache);
						}
						self.living = $.map(self.listen, (status, i)=> {
							if(status!==true) {
								return;
							}
							return self.targets[i];
						});
						self.cache = setTimeout(self.updated, 1);
					};
					const activate = target=> {
						self.previous.visibleEntryTop = target.offsetTop;
						updated();
					};
					const parentScrollTop = pack._scrollTop();
					const userScrollsDown = parentScrollTop >= self.previous.parentScrollTop;
					self.previous.parentScrollTop = parentScrollTop;
					entries.forEach((entry)=> {
						const { target, isIntersecting } = entry;
						const el = $(target);
						const index = $(self.targets).index(target);
						self.listen[index] = isIntersecting;
						if(isIntersecting) {
							el.addClass('active');
						}else {
							el.removeClass('active');
							updated();
							return;
						}
						const lowerThanPrevious = target.offsetTop >= self.previous.visibleEntryTop;
						if(userScrollsDown && lowerThanPrevious) {
							activate(target);
							if(!parentScrollTop) {
								return;
							}
							return;
						}
					//
						if(!userScrollsDown && !lowerThanPrevious) {
							activate(target);
						}
					});

				}, {threshold: [0.1, options.ratioRange, 1]});
			//
				self.targets.forEach(el=> {self.obViewer.observe(el)});
				return pack._end();
			},
			_start: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'start';
				const options = self.options || null;
				if(!isObjects(options)) {
					return pack._end();
				}
				let findElements = $(self.container).find(options.selector);
				if(isJQuery(findElements)) {
					self.targets = $.map(findElements, el=> {return el});
				}
			//
				if(!isElement(self.element)) {
					findElements = $('#viewer');
					if(isJQuery(findElements)) {
						self.element = findElements[0];
					}
				}
			//
				return pack._createobViewer();
			},
			_end: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'end';

				if(isFunction(self.callback)) {
					self.callback();
				}
				return self;
			},
			_init: function() {
				const self = obViewer.fn._packs._self(this);
				const pack = self._packs;
				const name = 'init';
				const args = arguments;
				$.each(['options', 'container', 'element', 'updated', 'callback'], function(i, k) {
					const n = '_' + k;
					if(!inObject(k, self) && inObject(n, pack)) {
						self[k] = pack[n];
					}
				})
			//
				if(isStrings(args[0]) || isElement(args[0]) || isJQuery(args[0])) {
					if(isStrings(args[0])) {
						args[0] = $(args[0]);
					}
					if(isJQuery(args[0])) {
						args[0] = args[0][0];
					}
					if(isElement(args[0])) {
						pack._setContainer.call(args[0]);
					}
				}else if(isObjects(args[0])) {
					pack._setOptions.call(args[0]);
				}else if($.isFunction(args[0])) {
					pack._setCallback.call(args[0]);
				}
				if(isObjects(args[1])) {
					pack._setOptions.call(args[1]);
				}else if($.isFunction(args[1])) {
					pack._setCallback.call(args[1]);
				}
				if($.isFunction(args[2])) {
					pack._setCallback.call(args[2]);
				}
				return pack._start();
			}
		}
	};

	$.extend($, {
		obViewer: obViewer
	});
})(jQuery, window);