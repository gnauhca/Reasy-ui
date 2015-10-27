/*
 * REasy UI Core @VERSION
 */

(function (win, doc) {
"use strict";

var rnative = /^[^{]+\{\s*\[native code/,
	_ = window._;

// ReasyUI 全局变量对象
$.reasyui = {};

// 记录已加载的 REasy模块
$.reasyui.mod = 'core ';

// ReasyUI 多语言翻译对象
$.reasyui.b28n = {};

// ReasyUI MSG
$.reasyui.MSG = {};

// 全局翻译函数
if (!_) {
	window._ = _ = function (str, replacements) {
		var ret = $.reasyui.b28n[str] || str,
			len = replacements && replacements.length,
			count = 0,
			index;

		if (len > 0) {
			while((index = ret.indexOf('%s')) !== -1) { 
				ret = ret.substring(0,index) + replacements[count] +
						ret.substring(index + 2, ret.length);
				count = ((count + 1) === len) ? count : (count+1);
			}
		}
		
		return ret;
	}
}

// HANDLE: When $ is jQuery extend include function 
if (!$.include) {
	$.include = function(obj) {
		$.extend($.fn, obj);
	};
}

$.extend({
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	},
	
	//获取视口宽度，不包含滚动条
	viewportWidth: function() {
		var de = doc.documentElement;
		
		return (de && de.clientWidth) || doc.body.clientWidth ||
				win.innerWidth;
	},
	
	//获取视口高度，不包含滚动条
	viewportHeight: function() {
		var de = doc.documentElement;
		
		return (de && de.clientHeight) || doc.body.clientHeight ||
				win.innerHeight;
	},
	
	//获取输入框中光标位置，ctrl为你要获取的输入框
	getCursorPos: function (ctrl) {
		var Sel,
			CaretPos = 0;
		//IE Support
		try	{
			if (doc.selection) {
				ctrl.focus();
				Sel = doc.selection.createRange();
				Sel.moveStart ('character', -ctrl.value.length);
				CaretPos = Sel.text.length; 
			} else if (ctrl.selectionStart || parseInt(ctrl.selectionStart, 10) === 0){
				CaretPos = ctrl.selectionStart;
			}			
		} catch (e) {}

		return CaretPos; 
	},
	
	//设置文本框中光标位置，ctrl为你要设置的输入框，pos为位置
	setCursorPos: function (ctrl, pos){
		var range;
		
		try {
			if(ctrl.setSelectionRange){
				ctrl.focus();
				ctrl.setSelectionRange(pos,pos);
			} else if (ctrl.createTextRange) {
				range = ctrl.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}			
		} catch (e) {}

		
		return ctrl;
	},
	
	getUtf8Length: function (str) {
		var totalLength = 0,
			charCode,
			len = str.length,
			i;
			
		for (i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode < 0x007f) {
				totalLength++;
			} else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
				totalLength += 2;
			} else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
				totalLength += 3;
			} else {
				totalLength += 4;
			}
		}
		return totalLength;
	},
	
	/**
	 * For feature detection
	 * @param {Function} fn The function to test for native support
	 */
	isNative: function (fn) {
		return rnative.test(String(fn));
	},
	
	isHidden: function (elem) {
		if (!elem) {
			return;
		}
		
		return $.css(elem, "display") === "none" ||
			$.css(elem, "visibility") === "hidden" ||
			(elem.offsetHeight === 0 && elem.offsetWidth === 0);
	},
	
	getValue: function (elem) {
		if (typeof elem.value !== "undefined") {
			return elem.value;
		} else if ($.isFunction(elem.val)) {
			return elem.val();
		}
	}
});

/* Cookie */
$.cookie = {
	get: function (name) {
		var cookieName = encodeURIComponent(name) + "=",
			cookieStart = doc.cookie.indexOf(cookieName),
			cookieEnd = doc.cookie.indexOf(';', cookieStart),
			cookieValue =  null;
			 
		if (cookieStart > -1) {
			if (cookieEnd === -1) {
				cookieEnd = doc.cookie.length;
			}
			cookieValue = decodeURIComponent(doc.cookie.substring(cookieStart +
					cookieName.length, cookieEnd));
		}
		return cookieValue;
	},
	set: function (name, value, path, domain, expires, secure) {
		var cookieText = encodeURIComponent(name) + "=" +
				encodeURIComponent(value);
				
		if (expires instanceof Date) {
			cookieText += "; expires =" + expires.toGMTString();
		}
		if (path) {
			cookieText += "; path =" + path;
		}
		if (domain) {
			cookieText += "; domain =" + domain;
		}
		if (secure) {
			cookieText += "; secure =" + secure;
		}
		doc.cookie = cookieText;

	},
	unset:function (name, path, domain, secure) {
		this.set(name, '', path, domain, new Date(0), secure);
	}
};


/* 
* rewrite the method "val" of jquery  
* it works once the elem has own method "val"--this.val
* or data("valFuns")
*/
$.prototype.val = function (base) {
  return function () {
	var valArguments = arguments,
		returnVal;
　　
	//调用基类方法
	returnVal = base.apply(this, valArguments); 

	$(this).each(function() {
		var value = null,
			that = this;


		if (typeof(this.val) == "function") {
			value = this.val.apply(this, valArguments);
			if (typeof value !== "undefined") {
				returnVal = value;
			}
		}

		//可以通过$(elem).data("valFuns", [fun1, fun2...])添加自定义取值赋值
		if ($.isArray($(this).data("valFuns"))) { 
			$.each($(this).data("valFuns"), function(i, valFun) {

				value = valFun.apply(that, valArguments);
				if (typeof value !== "undefined") {
					returnVal = value;
				}
			});
		}
	});

	return returnVal;
  }
}($.prototype.val);

$.fn.addValFun = function(valFun) {
	return this.each(function() {
		if (typeof valFun !== "function") {
			return;
		}

		var valFuns;

		valFuns = $(this).data("valFuns") || [];
		valFuns.push(valFun);
		$(this).data("valFuns", valFuns);
	});
}

$.fn.disable = function(disabled) {
	return this.each(function() {
		if (typeof this.disable === "function") {
			this.disable(disabled);
		}
	});
}


}(window, document));