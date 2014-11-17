;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.fastSpinner = factory();
	}
})(this, function() {
	'use strict'

	var COUNTER = 0;
	var MAXLAYERS = 4;
	var BASETEMPLATE =
	'	<div class="spinner-layer">' +
	'		<div class="circle-clipper left">' +
	'			<div class="circle fit"></div>' +
	'		</div><div class="gap-patch">' +
	'			<div class="circle fit"></div>' +
	'		</div><div class="circle-clipper right">' +
	'			<div class="circle fit"></div>' +
	'		</div>' +
	'	</div>';


/* COLOR RELATED STUFF*/

	// (internal) Set the color
	function changeColor(color) {
		addClass.call(this, color);
	}

	function createCustomColor(color) {
		css(this, {"border-color": color});
	}
	
	function color(color) {
		var spinnerLayers = document.querySelectorAll("#" + this.id + " .spinner-layer");

		for(var i = 0; i < spinnerLayers.length; i++) {
			addClass.call(spinnerLayers[i], "mono");
			createCustomColor.call(spinnerLayers[i], color);
		}
		return this;
	}

	function addLayers(numberOfLayers) {
		var spinnerLayers = document.querySelectorAll("#" + this.id + " .spinner-layer");
		var i;
		if (spinnerLayers.length <= numberOfLayers) {
			if (numberOfLayers > MAXLAYERS) numberOfLayers = MAXLAYERS;
			i = numberOfLayers - spinnerLayers.length; //Num of layers to be create

			while(i--) {
				this.template += BASETEMPLATE;
			}
			this.element.innerHTML = this.template;
		}
		// numberoflayers mayor que maxlayers pero
		// numero real de layers en el template es menor de maxlayers
		// ADD THE BASE TEMPLATES TILL MAXLAYERS

		// numberoflayers mayor que maxlayers y
		// numero real de layers en el template igual a maxlayers
		// NO ADD MORE BASE TEMPLATES

		// numberoflayers menor que maxlayers
		// ADD THE BASE TEMPLATES TILL numberoflayers
	}


	function colorPattern(colors) {
		var spinnerLayers;
		var classNames = {
			0: 'first-elem',
			1: 'second-elem',
			2: 'third-elem',
			3: 'fourth-elem'
		}
		switch (colors.length) {
			case 1:
				for(var i = 0; i < 4; i++) {
					colors.push(colors[0]);
				}
				break;
			case 2:
				colors.forEach(function (color){
					colors.push(color);
				});
				break;
			case 3:
				colors.push(colors[2]);
				break;
		}
		
		addLayers.call(this, colors.length);
		spinnerLayers = document.querySelectorAll("#" + this.id + " .spinner-layer");

		for(var i = 0; i < spinnerLayers.length; i++) {
			if (spinnerLayers.length <= MAXLAYERS) {
				createCustomColor.call(spinnerLayers[i], colors[i]);
				addClass.call(spinnerLayers[i], classNames[i]);
			}
		}
		return this;
	}


/* END OF COLOR STUFF */ 
/* LIBRARY STUFF */


	// (internal) Remove the element from the DOM
	function remove() {
		return this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
	}

	// (internal) Shows the spinner with an smooth transition
	function show(velocity) {
		removeClass.call(this.element, "hidden");
		return this;
	}

	// (internal) Hides the spinner with an smooth transition
	function hide() {
		addClass.call(this.element, "hidden");
		return this;
	}

	function extend(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	}

	function removeClass(remove) {
		var newClassName = "";
		var i;
		var classes = this.className.split(" ");
		
		for(i = 0; i < classes.length; i++) {
			if(classes[i] !== remove) {
				newClassName += classes[i] + " ";
			}
		}
		
		this.className = newClassName;
		return;
	}

	function addClass(name) {
		if (this.className) this.className += " ";
		this.className += name; 
		return;
	}

	var css = (function() {
		var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
		cssProps = {};

		function camelCase(string) {
			return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
				return letter.toUpperCase();
			});
		}

		function getStyleProp(name) {
			name = camelCase(name);
			return cssProps[name] || (cssProps[name] = getVendorProp(name));
		}

		function applyCss(element, prop, value) {
			prop = getStyleProp(prop);
			element.style[prop] = value;
		}

		function getVendorProp(name) {
			var style = document.body.style;
			if (name in style) return name;

			var i = cssPrefixes.length,
			capName = name.charAt(0).toUpperCase() + name.slice(1),
			vendorName;
			while (i--) {
				vendorName = cssPrefixes[i] + capName;
				if (vendorName in style) return vendorName;
			}

			return name;
		}
		return function(element, properties) {
			var args = arguments,
			prop, 
			value;

			if (args.length == 2) {
				for (prop in properties) {
					value = properties[prop];
					if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
				}
			} else {
				applyCss(element, args[1], args[2]);
			}
		}
	})();

/* END OF LIBRARY STUFF */
/* CONSTRUCTOR */

	return function (args) {
		args = args || {};

		// var settings = {
		// 	id: 'sdf' + (++COUNTER), 
		// };

		// args = extend(settings, args);
		// extend args with settings

		try {
			var placeholder = document.getElementById(args.id);
			placeholder.innerHTML = BASETEMPLATE;
		} catch(e) {
			console.error("no ID attribute");
		}

		return {
			version: "1.0",
			id: args.id,
			element: placeholder,
			color: color,
			colorPattern: colorPattern,
			remove: remove,
			template: BASETEMPLATE,
			hide: hide,
			show: show
		}
	};
});