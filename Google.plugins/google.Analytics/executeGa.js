(function (global, factory) {"use strict";
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.executeGa = factory());
}(typeof window!='undefined' ? window : this, function() {"use strict";
	const win = window;
	const dom = document;
	const createScript = (src)=> {
		const name = 'script';
		const script = dom.createElement(name);
		const find = dom.getElementsByTagName(name)[0];
		script.async = 1;
		script.src = src;
		find.parentNode.insertBefore(script, find);
	};

	win.gtag = win.gtag || function() {
		(win.dataLayer = win.dataLayer || []).push(arguments);
	};

	win.GoogleAnalyticsObject = 'ga';
	win.ga = win.ga || function() {
		(win.ga.q = win.ga.q || []).push(arguments);
	}, win.ga.l = 1 * new Date();

	const executeGa = function(id) {
		return new executeGa.fn.init(id);
	}

	executeGa.fn = executeGa.prototype = {
		id: null,
		exec: function() {
			const self = executeGa.fn;
			const id = self.id || null;
			if(typeof id==='string' && id.trim()!=='') {
				[
					`https://www.googletagmanager.com/gtag/js?id=${id}`,
					'https://www.google-analytics.com/analytics.js'
				].forEach(src=> createScript(src));
			//
				const list = {
					gtag: [
						['js', new Date()],
						['config', id]
					],
					ga: [
						['create', id, 'auto'],
						['send', 'pageview']
					]
				};
				Object.keys(list).forEach(fn=> {
					if(typeof win[fn]!=='function') {
						return;
					}
					list[fn].forEach(data=> {
						if(typeof data!=='object') {
							return;
						}
						win[fn].apply(null, data);
					});
				});
			}
			return self;
		},
		init: function(id) {
			const self = executeGa.fn;
			self.id = id;
			return self.exec();
		}
	};

	return executeGa;
}));
