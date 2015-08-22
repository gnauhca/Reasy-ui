/*!
 * REasy UI Validate @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 *  reasy-ui-checker.js
 */

(function () {"use strict";
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
	var checkPass = true,
		customResult;
		
	this.$elems.each(function() {

		//有错误信息返回，既不返回undefined->验证不通过
		if ($(this).check()) {
			checkPass = false;
		}
	});

	if (checkPass) {

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
	
	if (typeof this.options.error === 'function' && customResult) {
		this.options.error(customResult);
	}
}

//同步验证，验证通过返回undefined;不通过返回-
//-错误数组-->格式: [{"errorElem": 错误元素, "errorMsg": 对应错误信息}]
//注： 使用此同步方法不会验证custom
Validate.prototype.check = function($elem) {
	var $checkElems = ($elem?$($elem):[]),
		errResults = [],
		checkResult;

	if ($checkElems.length === 0) {
		$checkElems = this.$elems;
	}

	$checkElems.each(function() {
		//console.log($(this).check());
		checkResult = $(this).check();
		if (checkResult) {
			errResults.push({"errorElem": this, "errorMsg": checkResult});
		}
	});

	return (errResults.length > 0 ? errResults: undefined);
}

Validate.prototype.addElems = function(elems) {
	this.$elems = this.$elems.add($(elems));
}

Validate.prototype.removeElems = function(elems) {
	this.$elems = this.$elems.not($(elems));
}


/******** 数据验证 *******/
$.validate = function(options) {
	return new Validate(options);
};

$.validate.valid = $.valid;
})();