/*!
 * REasy UI Validate @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";
var defaults = {
	wrapElem: $('body'),
	custom: null,
	success: function () {},
	error: function () {}
};

function Validate(options) {
	
	this.options = $.extend({}, defaults, options);
	this.$elems = $(this.options.wrapElem).find(".validatebox");
	this.init();
}

Validate.prototype.init = function() {
	this.$elems.addCheck();
}

Validate.prototype.checkAll = function() {
	var checkPass = true;

	this.$elems.each(function() {
		if (!$(this).check()) {
			checkPass = false;
		}
	});

	if (checkPass) {
		var customResult;

		if (typeof this.options.custom === 'function') {
			customResult = this.options.custom();
		}
		
		if (!customResult) {
			if (typeof this.options.success === 'function') {
				this.options.success();
			}			
			return true;
		}
	}
	
	if (typeof this.options.error === 'function') {
		this.options.error(customResult);
	}
}

Validate.prototype.check = function($elem) {
	var checkPass = true,
		$checkElems = $($elem);

	if ($checkElems.length === 0) {
		$checkElems = this.$elems;
	}

	$checkElems.each(function() {
		//console.log($(this).check());
		if (!$(this).check()) {
			checkPass = false;
		}
	});

	if (checkPass) {
		var customResult;

		if (typeof this.options.custom === 'function') {
			customResult = this.options.custom();
			checkPass = customResult?true: false;
		}
	}

	return checkPass;
}

Validate.prototype.addElems = function(elems) {
	this.$elems = this.$elems.add($(elems));
}

Validate.prototype.removeElems = function(elems) {
	this.$elems = this.$elems.not($(elems));
}

Validate.prototype.fireValidate = function() {}




/******** 数据验证 *******/
$.validate = function(options) {
	return new Validate(options);
};

$.validate.valid = $.valid;
})(window, document);