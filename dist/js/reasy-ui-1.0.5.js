/*!
 * reasy-ui.js v1.0.5 2015-05-31
 * Copyright 2015 ET.W
 * Licensed under Apache License v2.0
 *
 * The REasy UI for router, and themes built on top of the HTML5 and CSS3..
 */

if ("undefined" === typeof jQuery && "undefined" === typeof REasy) {
	throw new Error("REasy-UI requires jQuery or REasy");
}

(function (win, doc) {
"use strict";

var rnative = /^[^{]+\{\s*\[native code/,
	_ = window._;

// ReasyUI 全局变量对象
$.reasyui = {};

// 记录已加载的 REasy模块
$.reasyui.mod = 'core ';

// ReasyUI 多语言翻译对象对象
$.reasyui.b28n = {};

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
		if (doc.selection) {
			ctrl.focus();
			Sel = doc.selection.createRange();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length; 
		} else if (ctrl.selectionStart || parseInt(ctrl.selectionStart, 10) === 0){
			CaretPos = ctrl.selectionStart;
		}
		return CaretPos; 
	},
	
	//设置文本框中光标位置，ctrl为你要设置的输入框，pos为位置
	setCursorPos: function (ctrl, pos){
		var range;
		
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
			(elem.offsetHeight == 0 && elem.offsetWidth == 0);
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
* add by zzc
*/
$.prototype.val = function (base) {
  return function () {
	var valArguments = arguments,
		returnVal;
　　
	//调用基类方法
	returnVal = base.apply(this, valArguments); 

	$(this).each(function() {
		if (typeof(this.val) == "function") {
			var value = this.val.apply(this, valArguments);
			if (typeof value !== "undefined") {
				returnVal = value;
			}
		}
	});

	return returnVal;
  }
}($.prototype.val);

$.fn.disable = function(disabled) {
	this.each(function() {
		if (typeof this.disable === "function") {
			this.disable(disabled);
		}
	});
	return this;
}


}(window, document));

/*!
 * REasy UI animate @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";

function getTransitionEndEventName() {
    var testElem = document.createElement('div'),
	    transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			MozTransition    : 'transitionend',
			OTransition      : 'oTransitionEnd otransitionend',
			transition       : 'transitionend'
	    };

    for (var name in transEndEventNames) {
      if (testElem.style[name] !== undefined) {
        return  transEndEventNames[name];
      }
    }

    return false;
}

var transitionend = getTransitionEndEventName();

$.fn.animateShow = function(durTime) {

	return this.each(function() {
		var $this = $(this);

		if ($this.data("ani-status") == "show") {
			return;
		}

		$this.data("ani-status", "show");
		var $this = $(this);
		if (transitionend) {
			$this.removeClass("none").addClass("ani-init");
			setTimeout(function() {$this.addClass("ani-final");}, 10);
		} else {
			$this.removeClass("none");
		}
	});
}

$.fn.animateHide = function(durTime) {

	var durTime = (durTime || 300);
	return this.each(function() {
		var $this = $(this);
		if ($this.hasClass("none")) {
			return;
		}

		$this.data("ani-status", "hide");
		if (transitionend) {
			$this.addClass("ani-init ani-final");
			$this.removeClass("ani-final");
			$this.one(transitionend, function() { 
				if ($this.data("ani-status") == "hide")
				$this.addClass("none");
			});
			setTimeout(function() {
				if ($this.data("ani-status") == "hide")
				$this.addClass("none");
			}, durTime);
		} else {
			$this.addClass("none");
		}
	});
}

})(window, document);

/*!
 * REasy UI alert @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";

/* masktip and alert plugin zzc*/
var wrongWrapEle = null,
	wrongTipEle = null,
	allowHide = false;

$.extend({			
    alert: function(tipTxt, showTime) {
    	var tipTxt = tipTxt + "",
    		showTime = showTime || (600 + tipTxt.length * 40);
    	if(wrongTipEle == null) {
			wrongWrapEle = document.createElement("div"),
			wrongTipEle = document.createElement("div"),
			wrongWrapEle.className = "wrong-wrap";
			wrongTipEle.className = "wrong-tip";
			$(wrongWrapEle).append(wrongTipEle).hide();
			document.body.appendChild(wrongWrapEle);	    		
    	}
    	if ($.trim(tipTxt) == "") {
    		return;
    	}
        wrongTipEle.innerHTML = tipTxt;
        $(wrongWrapEle).stop(true).hide().fadeTo(0, 0).show().
        	css({"top":"30%"}).
        	animate({"top":"25%", "opacity": "1"},200).
        	animate({"top":"25%", "opacity": "1"}, showTime, function() {
				$(wrongWrapEle).animate({"top":"20%","opacity": "0"}, 500, function() {
					$(wrongWrapEle).hide();
				});
        	});
    }

});
})(window, document);

/*!
 * REasy UI Dialog @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (document) { "use strict";

	var defaults = {
			show: true,//是否显示
			showNoprompt: false,//显示不再提示勾选框
			model: 'dialog',//or message
			title: '来自网页的消息',
			content: '',
			apply: null,//点击确定时的回调
			cancel: null//点击取消时的回调
		},
		options = defaults,
		$dialog = null,
		$btnWrap = null,
		$message = null,
		$title = null,
		$overlay = null;
		
	function createDialogFrame(title, content) {
		var dialogFrameHTML = '<div class="dialog"><h2 class="dialog-title">' +
		'<span id="dialog-title">' + title + '</span>' + 
		'<a href="javascript:void(0);" type="button" class="close" id="dialog-close">&times;</a>' +
		'</h2>' +
		'<div class="dialog-content dialog-content-massage" id="dialog-content-massage">' + content + '</div>' + 
		'</div>';
		return $(dialogFrameHTML);
	}

	/*//创建不再提示
	function createNopromt() {
		var nopromptHTML = '<div class="' + nopromptClass + '">' +
						'<label class="checkbox" for="nocheck">' +
							'<input type="checkbox" id="dialog-noprompt" />不再提示' +
						'</label>' +
					'</div>';
		return $(nopromptHTML);
	}*/

	//创建按钮区
	function createBtn() {
		var btnHTML = '<div class="dialog-btn-group">' +
						'<button type="button" class="btn" id="dialog-apply">确定</button>' +
						'<button type="button" class="btn" id="dialog-cancel">取消</button>' +
					'</div>';
		return $(btnHTML);
	} 

	function show(_options) {
		options = $.extend(defaults, _options);

		if (!$dialog) {
			$overlay = $('<div class="overlay" id="overlay"></div>').appendTo($("body"));
			$dialog = createDialogFrame(options.title, options.content).appendTo($("body"));;
			$(document).on("click.re.dialog", "#dialog-close", hide);
			/*$(document).on("keydown.re.dialog", "#dialog-apply", function(e) {
				if (e.keyCode === $.keyCode.ENTER) {
					(typeof(options.apply) === "function") && options.apply();
				}
			});*/
		}
		if (options.model === "dialog") {

			//对话框
			if (!$btnWrap) {
				$btnWrap = createBtn().appendTo($dialog);
				$(document).on("click.re.dialog", "#dialog-apply", function() {
					(typeof(options.apply) === "function") && options.apply();
					hide();
				}).on("click.re.dialog", "#dialog-cancel", function() {
					(typeof(options.cancel) === "function") && options.cancel();
					hide();
				});				
			}
			$btnWrap.removeClass("none");
		} else {

			//警告框
			$btnWrap && $btnWrap.addClass("none");
		}
		$overlay.removeClass("none");
		$dialog.animateShow().css({
			marginLeft: -$dialog.width()/2 + "px"
		});
		$("#dialog-title").html(options.title);
		$("#dialog-content-massage").html(options.content);
		$("#dialog-apply").focus();
	}

	function hide() {
		$dialog.animateHide(500);
		$overlay.addClass("none");
	}
	
	//dialog对象
	function Dialog(options) {
		this.options = options;
		options.show && this.open();
	}	
	
	Dialog.prototype = {
		
		close: function () {
			hide();
		},
		
		open: function () {
			show(this.options);
		},
		
		apply: function () {
			if ($.type(this.options.apply) === 'function') {
				this.options.apply.apply(this, arguments);
			}
			this.close();
		},
		
		cancel: function () {
			if ($.type(this.options.cancel) === 'function') {
				this.options.cancel.apply(this, arguments);
			}
			this.close();
		}
	};
	
	$.dialog = function (options) {
		return new Dialog(options);
	};
})(document);

/*!
 * REasy UI progressbar @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";

var progressBarSington = null,
	overlayMaskHTML = '<div class="overlay"></div>',
	progressBoxHTML = '<div class="loading-wrap">' +
							'<span class="loading-percent"></span>' + 
							'<div class="loading-bar-wrap">' + 
								'<div class="loading-bar"></div>' +
							'</div>' +
							'<p class="loading-des"></p>' +
						'</div>';

function ProgressBar() {
	this.handRunTime = 500;//手动设置用500毫秒跳到指定百分比
	this.runT = 0;//自动跑
	this.percent = 0;
	this.tasks = [];
	this.task = null;

	this.$mask = null;
	this.$msg = null;
	this.$percent = null;
	this.$bar = null;
}

ProgressBar.prototype.create = function() {
	var $progressBox = $(progressBoxHTML).appendTo($("body"));

	if (!$(".overlay").length > 0) {
		this.$mask = $(overlayMaskHTML).appendTo($("body"));;
	} else {
		this.$mask = $(".overlay");
	}

	this.$msg = $progressBox.find(".loading-des");
	this.$percent = $progressBox.find(".loading-percent");
	this.$bar = $progressBox.find(".loading-bar");
}

ProgressBar.prototype.run = function(task) {
	if (this.task) {
		this.tasks.push(task);
	} else {
		if (!this.$msg) {
			this.create();
		}
		this.percent = 0;
		this.task = task;
		this.autoRun();
	}
	return this;
}

//根据设置的任务时间自动跑进度条
ProgressBar.prototype.autoRun = function() {
	if (!this.task || !this.task.time) return;

	var basicSpeed = 100/(this.task.time/30),
		speed = 0,
		that = this;

	this.setMessage(this.task.msg);
	clearInterval(this.runT);
	this.percent = parseInt(this.percent);
	this.runT = setInterval(function() {
		if (that.percent < 30) {
			speed = basicSpeed * 0.6;
		} else if (that.percent < 70) {
			speed = basicSpeed;
		} else {
			speed = basicSpeed/0.6;
		}
		that.percent += basicSpeed;
		that.setPercent(that.percent);
	}, 30);
}

//设置提示信息
ProgressBar.prototype.setMessage = function(msg) {
	this.$msg.html(msg);
}


//通过外部API调用设置百分比，用于不确定的，需根据实时情况设置进度的时候。
ProgressBar.prototype.handSetPercent = function(percent, msg, callback) {
	if (!this.task) return;

	var speed = (percent - this.percent)/(this.handRunTime/30),
		great = (percent > this.percent),
		that = this;

	this.setMessage(msg);
	clearInterval(this.runT);
	this.percent = parseInt(this.percent);
	this.runT = setInterval(function() {
		that.percent += speed;
		if ((great && percent < that.percent) || (!great && percent > that.percent)) {
			if (typeof callback === "function") {
				callback();
			}
			clearInterval(that.runT);
			that.percent = percent;
			that.autoRun();
		}
		that.setPercent(that.percent);
	}, 30);
}


//设置百分比, 当百分比到达 100时会触发下一个进度条任务（如果还有）
ProgressBar.prototype.setPercent = function(percent) {
	var that = this;

	this.percent = percent;
	if (this.percent >= 100) {
		this.percent = 100;
		clearInterval(this.runT);

		if (typeof this.task.callback === "function") {
			this.task.callback();
		}

		this.task = null;

		if (this.tasks.length > 0) {
			this.run(this.tasks.shift());
		} else {
			setTimeout(function() {that.distroy();}, 2000);
		}
	}
	this.$percent.html(parseInt(this.percent) + "%");
	this.$bar.css({"width": this.percent + "%"});
}

ProgressBar.prototype.distroy = function() {
	$(".overlay").remove();
	$(".loading-wrap").remove();
	this.$msg = null;
	this.$mask = null;
	this.$percent = null;
	this.$bar = null;
	this.task = null;
	this.tasks = [];
	this.percent = 0;
	clearInterval(this.runT);
}

$.progressBar = function() {
	if (!progressBarSington) {
		var progressBar = new ProgressBar();

		progressBarSington = {};
		progressBarSington.run = function(time, msg, callback) {
			progressBar.run({"time": time, "msg": msg, "callback": callback});
			return progressBarSington;
		}
		progressBarSington.set = function(percent, msg, callback) {
			progressBar.handSetPercent(percent, msg, callback);
			return progressBarSington;
		}
		progressBarSington.distroy = function() {
			progressBar.distroy();
			return progressBarSington;
		}
		progressBarSington.getTaskNum = function() {
			return progressBar.tasks.length;
		}
	}
	return progressBarSington;
}

})(window, document);

/*!
 * REasy UI Textboxs @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (document, window) {"use strict";
var Textboxs = {
	// type类型现在支持的有：“ip”，“ip-mini”，“mac”
	create: function (elem, type, defVal) {
		
		if (elem.toTextboxsed) {
			return elem;
		}
	
		var $elem = $(elem),
			len = 4,
			maxlength = 3,
			divide = '.',
			replaceRE = /[^0-9]/g,
			textboxs = [],
			htmlArr = [],
			classStr,
			i;
		
		defVal = defVal || '';
		type = type || 'ip';
		classStr = type === 'ip-mini' ? 'text input-mic-mini' : 'text input-mini-medium';
		elem.textboxsType = type;
		elem.defVal = defVal;
		
		if (type === 'mac') {
			len = 6;
			maxlength = 2;
			divide = ':';
			replaceRE = /[^0-9a-fA-F]/g;
			classStr = 'text input-mic-mini';
		}
		
		if ($.trim(elem.innerHTML) === '') {
			for (i = 0; i < len; i++) {
				if (i !== 0) {
					htmlArr[i] = '<input type="text" class="' + classStr + '"' + 
						' maxlength="' + maxlength + '">';
				} else {
					htmlArr[i] = '<input type="text" class="' + classStr + ' first"' + 
						' maxlength="' + maxlength + '">';
				}
				
			}
			elem.innerHTML = htmlArr.join(divide);
		}
		
		textboxs =  elem.getElementsByTagName('input');
		len = textboxs.length;
		
		for (i = 0; i < len; i++) {
			textboxs[i].index = i;
		}
		
		var isFocus = false;
		$(textboxs).on('focus', function () {
			var val = Textboxs.getValue(this.parentNode);
		
			if (val === '') {
				Textboxs.setValue(elem, defVal, true);
				
			// 如果是按回退而聚集的，光标定位到最后
			} else if (this.back === "back") {
				$.setCursorPos(this, this.value.length);
				this.back = "";
			}
			$elem.trigger($.Event('check.re', {checktype: "focus"}));
			isFocus = true;
		}).on('blur', function () {
			if (this.value > 255) {
				this.value = '255';
			}
			isFocus = false;
			setTimeout(function() {
				if (!isFocus)
				$elem.trigger($.Event('check.re', {checktype: "blur"}));
			}, 10);
		});
		
		$elem.on('keydown', function (e) {
			var elem = e.target || e.srcElement;
				
			elem.pos1 = +$.getCursorPos(elem);
			this.curIndex = elem.index;
			if (elem.value.length <= 0) {
				elem.emptyInput = true;
			} else {
				elem.emptyInput = false;
			}
		
		}).on('keyup', function (e){
			var elem = e.target || e.srcElement,
				myKeyCode  =  e.keyCode || e.which,
				skipNext = false,
				skipPrev = false,
				pos = +$.getCursorPos(elem),
				val = elem.value,
				replacedVal = val.replace(replaceRE, ''),
				ipReplacedVal = parseInt(replacedVal, 10).toString(),
				isIp = type.indexOf('ip') !== -1;
				
			// HACK: 由于把事件添加在input元素的父元素上，IE下按“Tab”键而跳转，
			// “keydown” 与 “keyup” 事件会在不同 “input”元素中触发。
			if (this.curIndex !== elem.index) {
				return false;
			}

			//处理与向前向后相关的特殊按键
			switch (myKeyCode) {
				case $.keyCode.LEFT:		//如果是左键
					skipPrev = (pos - elem.pos1) === 0;
					if (skipPrev && pos === 0 && elem.index  > 0) {
						textboxs[elem.index - 1].focus();
					}
					return true;
				
				case $.keyCode.RIGHT:		//如果是右键
					if (pos === val.length && elem.index  < (len -1)) {
						textboxs[elem.index + 1].focus();
						$.setCursorPos(textboxs[elem.index + 1], 0);
					}
					return true;
				
				case $.keyCode.BACKSPACE:	//如果是回退键
					if (elem.emptyInput && elem.value === "" && elem.index  > 0) {
						textboxs[elem.index - 1].focus();
						textboxs[elem.index - 1].back = "back";
					}
					return true;
				
				//没有 default
			}
			
			//如果有禁止输入的字符，去掉禁用字符
			if (val !== replacedVal) {
				elem.value = replacedVal;
			}
			
			//修正ip地址中类似‘012’为‘12’
			if (isIp && !isNaN(ipReplacedVal) &&
					ipReplacedVal !== val) {
					
				elem.value = ipReplacedVal;
			}
			
			//如果value不为空或不是最后一个文本框
			if(elem.index !== (len - 1) && elem.value.length > 0) {
				
				//达到最大长度，且光标在最后
				if (elem.value.length === maxlength && pos === maxlength) {
					skipNext = true;
					
				//如果是IP地址，如果输入小键盘“.”或英文字符‘.’则跳转到下一个输入框
				} else if (isIp && (myKeyCode === $.keyCode.NUMPAD_DECIMAL ||
						myKeyCode === $.keyCode.PERIOD)) {
					
					skipNext = true;
				}
			}
			
			//跳转到下一个文本框,并全选
			if (skipNext) {
				textboxs[elem.index + 1].focus();
				textboxs[elem.index + 1].select();
			}
		});
		
		elem.toTextboxsed = true;
		return elem;
	},
	
	setValue: function (elem, val, setDefault) {
		var textboxs =  elem.getElementsByTagName('input'),
			len = textboxs.length,
			textboxsValues,
			i;
		
		if (val !== '' && $.type(val) !== 'undefined') {
			textboxsValues = val.split('.');
			
			if (elem.textboxsType === 'mac') {
				textboxsValues = val.split(':');
			}
		} else {
			textboxsValues = ['', '',  '', '', '', ''];
		}

		for (i = 0; i < len; i++) {
			textboxs[i].value = textboxsValues[i];
		}
		
		// TODO: IE下聚焦隐藏的元素会报错
		try {
			if (elem.defVal && setDefault) {
				textboxs[i - 1].focus();
				$.setCursorPos(textboxs[i - 1], textboxs[i - 1].value.length);
			}
		} catch(e) {}
		
		return elem;
	},
	
	getValues: function (elem) {
		var valArr = [],
			textboxs,
			len,
			i;
		
		textboxs = elem.getElementsByTagName('input');
		len = textboxs.length;
		for (i = 0; i < len; i++) {
			valArr[i] = textboxs[i].value;
		}
		
		return valArr;
	},
		
	getValue: function (elem) {
		var	valArr = Textboxs.getValues(elem),
			divide = '.',
			emptyReg = /^[.:]{0,}$/,
			ret;
			
		if (elem.textboxsType === 'mac') {
			divide = ':';
		}
		ret = valArr.join(divide).toUpperCase();
		
		return emptyReg.test(ret) ? '' : ret;
	},
	
	disable: function (elem, disabled) {
		var textboxs =  $('input.text', elem),
			len = textboxs.length,
			i;
			
		for (i = 0; i < len; i++) {
			textboxs[i].disabled = disabled;
		}
		
		return elem;
	}
};

$.fn.toTextboxs = function (type, delVal) {
	return this.each(function() {
		Textboxs.create(this, type, delVal);
		$(this).addClass('textboxs');
		
		this.val = function (val) {
			if ($.type(val) !== 'undefined' ) {
				if (typeof val !== 'string') {
					return false;
				}
				Textboxs.setValue(this, val);
			} else {
				return Textboxs.getValue(this);
			}
			
		};
		
		this.disable = function (disabled) {
			Textboxs.disable(this, disabled);
		};
		this.toFocus = function () {
			this.getElementsByTagName('input')[0].focus();
		};
	});
};

})(document, window);


/*!
 * REasy UI Inputs @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function(win, doc) {"use strict";
	var supChangeType = "no",
		supportPlaceholder = ('placeholder' in doc.createElement("input"));


	function Input(element) {
		var that = this;

		this.$element = $(element);
		this.$placeholderText = null;//可能等于true（支持placeholder），或者jq元素
		this.$textInput = null;
		this.capTipCallback = null;

		element.val = function(value) {
			return that.setValue(value);
		}
	}

	Input.prototype.initPassword = function(placeholderText) {
		this.addPlaceholder(placeholderText);

		if ((this.$textInput && this.$textInput.length == 1) || this.$element[0].type !== "password") {
			return;
		}

		if (supChangeType === "no") {
			supChangeType = isSupportTypeChange(this.$element[0]);
		}

		// HANDLE: 可直接修改 ‘type’属性
		if (supChangeType) {
			this.$element.on("focus", function () {
				this.type = 'text';
			})
			.on("blur", function () {
				if (!$(this).hasClass("validatebox-invalid")) 
				this.type = 'password';
			});
			
		// HANDLE: 不支持‘type’属性修改，创建一个隐藏的文本框来实现
		} else {
			var inputObj = this;

			this.$textInput = $(createTextInput(this.$element[0]));
		
			//绑定事件，控制两个输入框的显示隐藏，数据同步
			this.$element.on("focus.re.input.password", function () {
				var thisVal = this.value;
				
				inputObj.setValue(thisVal);
				$(this).hide();
				inputObj.$textInput.show();
				setTimeout(function() {
					inputObj.$textInput.focus();
					$.setCursorPos(inputObj.$textInput[0], thisVal.length);	
				}, 50);
			});
			
			this.$textInput.on("blur.re.input.password", function () {
				var $this = $(this);
				
				inputObj.setValue($this.val());
				if (!$this.hasClass("validatebox-invalid")) {
					$this.hide();
					inputObj.$element.show();
				}
			}).on("keyup.re.input.password", function () {
				inputObj.setValue($(this).val());
			});
		}
	}

	Input.prototype.addPlaceholder = function(placeholderText) {
		var inputObj = this,
			text = this.$element.attr("placeholder");


		if (typeof placeholderText !== "undefined" && text !== placeholderText) {
			this.$element.attr("placeholder", placeholderText);
		} else {
			placeholderText = text;
		}
		placeholderText = $.trim(placeholderText);

		if (typeof placeholderText === "undefined") {
			return;
		} else if (placeholderText === "" && this.$placeholderText.length === 1) {

			//之前创建了placeholder文本元素，现在设置成了空，既删除placeholder
			this.$placeholderText.remove();
			this.$placeholderText = null;
			this.$element.off("re.input.placeholder");//解绑事件
			return;
		} else if (!supportPlaceholder) {

			//不支持placeholder 为此元素创建一个隐藏的文本元素
			if (this.$placeholderText && this.$placeholderText.length === 1) {
				this.$placeholderText.remove();
			}
			this.$placeholderText = createPlaceholderElem(this.$element[0], placeholderText);
		} else {

			//支持placeholder
			this.$placeholderText = true;
		}
		
		this.$element.on("click.re.input.placeholder keyup.re.input.placeholder focus.re.input.placeholder blur.re.input.placeholder", function () {
			inputObj.setValue(this.value);
		});

		inputObj.setValue(this.$element.val());
	}

	Input.prototype.addCapTip = function(callback) {
		var inputObj = this;

		function hasCapital(value, pos) {
			var pattern = /[A-Z]/g,
				myPos = pos || value.length;
				
			return pattern.test(value.charAt(myPos - 1));
		}		

		if (!callback) {
			return;
		}

		if (!this.capTipCallback) {
			var $capTipElem = this.$element;
			if (this.$textInput && this.$textInput.length == 1) {
				$capTipElem = this.$textInput;
			}

			//add capital tip 
			$capTipElem.on("keyup", function (e) {
				var myKeyCode  =  e.keyCode || e.which,
					repeat,
					pos;
				
				// HANDLE: Not input letter
				if (myKeyCode < 65 || myKeyCode > 90) {
					return true;
				}
				
				pos = $.getCursorPos(this);
				
				if (hasCapital(this.value, pos)) {
					inputObj.capTipCallback(true);//输入的是大写字母
				} else {
					inputObj.capTipCallback(false);//输入的是小写字母
				}
			});	
		}
		this.capTipCallback = callback;
	}

	Input.prototype.setValue = function(value) {
		if (typeof value === "undefined") {
			return this.$element[0].value;
		}

		if (value !== this.$element[0].value)
		this.$element[0].value = value;
		
		//placeholder 赋值
		if (this.$placeholderText) {
			if (value === "") {
				$(this.$element).addClass("placeholder-text");
				if (this.$placeholderText.length == 1) {
					this.$placeholderText.removeClass("none");
				}
			} else {
				$(this.$element).removeClass("placeholder-text");
				if (this.$placeholderText.length == 1) {
					this.$placeholderText.addClass("none");
				}
			}
		}

		//password to text 赋值处理
		if (this.$textInput && this.$textInput.length == 1) {
			if (this.$textInput[0].value !== value)
			this.$textInput.val(value);
		}
	}

	//create placeholder text elem for those browsers doesn't support placeholder feature
	function createPlaceholderElem(elem, placeholderText) {
		var ret = doc.createElement('span');
		
		ret.className = "placeholder-content";
		ret.innerHTML = '<span class="placeholder-text" style="width:' + 
				(elem.offsetWidth || 200) + 'px;line-height:' + 
				(elem.offsetHeight || 28)+ 'px">' +
				(placeholderText || "") + '</span>';
		
		elem.parentNode.insertBefore(ret, elem);
		
		$(ret).on('click', function () {
			elem.focus();
		});
		
		return $(ret);
	}

	//create password text elem for those browsers doesn't support changing the type attribute
	function createTextInput(elem) {
		var $elem = $(elem),
			newField = doc.createElement('input'),
			$newField;
		
		newField.setAttribute("type", "text");
		newField.setAttribute("maxLength", elem.getAttribute("maxLength"));
		newField.setAttribute("id", elem.id + "_");
		newField.className = elem.className.replace("placeholder-text", "");
		newField.setAttribute("placeholder", elem.getAttribute("placeholder") || "");
		if (elem.getAttribute('data-options')) {
			newField.setAttribute("data-options", elem.getAttribute('data-options'));
		}
		
		if (elem.getAttribute('required')) {
			newField.setAttribute("required", elem.getAttribute('required'));
		}
		$(elem).after(newField, elem);
		$newField = $(newField).hide();
		
		return newField;
	}


	function isSupportTypeChange(passwordElem) {
		try {
			passwordElem.setAttribute("type", "text");
			if (passwordElem.type === 'text') {
				passwordElem.setAttribute("type", "password");
				return true;
			}
		} catch (d) {
			return false;
		}
	}

	function addPlugin(option) {
		$(this).each(function() {
			var $this = $(this),
				data = $this.data("re.input");

			if (!data) {
				data = $this.data("re.input", new Input(this));
			}
		});
	}

	/*
	* @插件 聚焦时可视的密码输入框
	* @param placeholderText placeholder文本，用以添加placeholder
	*/
	$.fn.initPassword = function(placeholderText) {
		addPlugin.call(this);
		return this.each(function() {
			$(this).data("re.input").initPassword(placeholderText);
		});
	}

	/*
	* @插件 placeholder兼容插件，保证所有浏览器正常显示placeholder
	* @param placeholderText placeholder文本，省略的话直接读取元素placeholder属性
	*/
	$.fn.addPlaceholder = function(placeholderText) {
		addPlugin.call(this);
		return this.each(function() {
			$(this).data("re.input").addPlaceholder(placeholderText);
		});
	}

	/*
	* @插件 initInput
	* 功能与initPassword一致，为了保留接口
	*/	
	$.fn.initInput = function(placeholderText) {
		addPlugin.call(this);
		return this.each(function() {
			$(this).data("re.input").initPassword(placeholderText);
		});		
	}

	/*
	* @插件 大写检查
	* @param {function} 回调，每次键盘点击时会调用，
	* 该回调接受一个参数，true代表大写，false：小写
	*/
	$.fn.addCapTip = function(callback) {
		addPlugin.call(this);
		return this.each(function() {
			$(this).data("re.input").addCapTip(callback);
		});
	}

	//页面加载后自动优化有placeholder的元素
	$(function() { 
		$("input:text[placeholder]").addPlaceholder(); 
		$("input:password[data-role=visiblepassword]").initPassword();
	});

})(window, document);

/*!
 * REasy UI Tip @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";

	var $tip = null;

	function Tip(element) {
		this.$element = $(element);
		this.tipStr = this.$element.attr("title");
		this.$element.attr("data-title", this.tipStr).attr("title", "");
		this.init();
	}

	Tip.prototype.init = function() {
		var that = this;

		this.$element.on("mouseenter.re.tip", function() {
			that.show();
		}).on("mouseleave.re.tip", function() {
			that.hide();
		});
	}

	Tip.prototype.show = function(str) {
		this.tipStr = str || this.tipStr;
		$tip = $tip || createTipElem();
		$tip.html(this.tipStr)
		if (this.$element.is(":visible")) {
			$tip.animateShow();
			setSize(this.$element);			
		}
	}

	Tip.prototype.hide = function() {
		$tip.animateHide();
	}

	function createTipElem(str) {
		var tipHTML = '<div class="title-tip"></div>';

		return $(tipHTML).appendTo($("body"));
	}

	function setSize($relativeElem) {
		var elemWidth = $relativeElem.width(),
			elemHeight = $relativeElem.outerHeight(),
			elemTop = $relativeElem.offset().top,
			elemLeft = $relativeElem.offset().left,
			scrollHeight = (document.body.scrollTop||document.documentElement.scrollTop),
			scrollWidth = (document.body.scrollLeft||document.documentElement.scrollLeft),
			viewWidth = $(window).width() + scrollWidth,
			viewHeight = $(window).height() + scrollHeight,
			tipHeight = $tip.outerHeight(),
			tipWidth = $tip.outerWidth(),
			tipTop = 0,
			tipLeft = 0;

		if (elemTop + elemHeight + tipHeight + 10 > viewHeight) {
			tipTop = elemTop - tipHeight - 5;
		} else {
			tipTop = elemTop + elemHeight + 5;
		}

		tipLeft = elemLeft;
		//tipLeft = elemLeft + (elemWidth - tipWidth)/2;

		if (tipLeft < 0) {
			tipLeft = 0;
		} else if (tipLeft > viewWidth - tipWidth) {
			tipLeft = viewWidth - tipWidth;
		}
		$tip.css({
			left: tipLeft + "px",
			top: tipTop + "px"
		});

	}

	function addPlugin() {
		$(this).each(function() {
			var $this = $(this),
				data = $this.data("re.tip");

			if (!data) {
				data = $this.data("re.tip", new Tip(this));
			}
		});
	}

	$.fn.addTip = function() {
		addPlugin.call(this);
	}

	$(function() {
		$("[title]").addTip();
	});

})(window, document);

/*!
 * REasy UI Message @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */
 
(function (doc) { "use strict";
    var ajaxMessageSington = null;

    function AjaxMsg(msg) {
        this.$mask = null;
        this.$elem = null;
        this.init(msg);
    }
    
    AjaxMsg.prototype = {
        constructor: AjaxMsg,
        
        init: function (msg) {

            this.$mask = $('<div class="overlay-white"></div>').hide().appendTo($("body"));
            this.$txtWrap = $('<div class="message-ajax"><div id="ajax-message" class="message-ajax-txt"></div></div>').hide().appendTo($("body"));
            this.$txtElem = this.$txtWrap.find("#ajax-message");

            this.$mask.css({"display": "none"});
            this.$txtWrap.css({"display": "none", "opacity": "0"});
        },
        
        show: function () {
            this.$mask.stop().fadeIn(200);
            this.$txtWrap.stop(true).show().animate({"top":"23%", "opacity": "1"},300);
        },
        
        hide: function () {
            var that = this;

            this.$mask.stop().fadeOut(200);
            this.$txtWrap.stop().animate({"top":"20%", "opacity": "0"},300, function() {
                that.$txtWrap.hide();
            });
        },
        
        remove: function () {
            this.$txtWrap.remove();
            this.$mask.remove();
        },
        
        text: function (msg) {
            this.$txtElem.html(msg);
        }
    }
    
    $.ajaxMessage = function (msg) {
        if (!ajaxMessageSington) {
            ajaxMessageSington = new AjaxMsg(msg);      
        }
        ajaxMessageSington.text(msg);
        ajaxMessageSington.show();
        return ajaxMessageSington;
    }
})(document);

/*!
 * REasy UI Select @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */
(function(window, document) {"use strict";

var defaults = {
		"initVal": "",//初始值
		// "toggleEable":true,
		"editable": false,
		"size": "",//尺寸
		"units": "",//单位
		// "seeAsTrans":false,
		"options" : [{"nothingthere":"nothingthere"}]
	},
	sizeClasses = {
		"small": "input-mini",
		"medium": "input-small",
		"large": "input-medium"
	};

function ToSelect(element) {
	this.value = "";
	this.$element = $(element);
	this.$menuUl = null;
	this.$input = null;
	this.created = false; //是否创建过，输入框和下拉尖角按钮不用二次初始化
	this.options = null;
	this.handsetAble = false;
	this.hasFocus = false;

	var that = this;
	element.val = function() {
		if (arguments.length > 0) {
			that.setValue(arguments[0]);
		}
		return that.value;
	}

	element.disable = function(disabled) {
		that.disable(disabled);
	}
}


//创建所需html
ToSelect.prototype.create = function(options) {
	var options = $.extend((this.created ? this.options : defaults), options),
		listData = options.options,
		firstOpt = "",
		sizeClass = (sizeClasses[options.size] || sizeClasses["meduim"]),
		that = this;

	function createCommonHTML($toSelectWrap) {
		var commonHTML = '<input class="input-box" type="text" autocomplete="off">' +
						 '<div class="btn-group">' + 
						 	'<a href="javascript:void(0);" class="toggle btn btn-small"><span class="caret"></span></a>' + 
						 '</div>' +
						 '<div class="input-select"><ul class="dropdown-menu none"></ul></div>';

		$toSelectWrap.html(commonHTML);
	}

	this.options = options;
	if (!this.created) {
		createCommonHTML(this.$element);
		this.$input = this.$element.find(".input-box");
		this.$menuUl = this.$element.find(".dropdown-menu");
		this.$element.addClass("input-append");
		this.created = true;

		this.$input.on("keyup.re.toselect", function() {
			that.value = this.value;
		})
		.on("focus.re.toselect", function() {
			that.hasFocus = true;
			if ($(this).attr("readonly")) {
				this.blur(); return;
			}
			this.value = "";
			//$.setCursorPos(this, this.value.length)
			clearMenu();
			that.$element.trigger($.Event('check.re', {checktype: "focus"}));
		})
		.on("blur.re.toselect", function() {
			that.hasFocus = false;
			if ($(this).attr("readonly")) {
				return;
			}			
			that.$element.trigger("check.re");
			that.setValue(that.value);
		});
	}

	//设置宽度
	this.$input.attr("class", "input-box " + sizeClass);

	//生成下拉菜单html
	var ulContent = "";
	if (listData.length === 1) {
		listData = listData[0];
		//老式写法，对象顺序不能保证
		for(var id in listData) {
			if (listData.hasOwnProperty(id)) {
				if(listData[id] ==='.divider' && id === '.divider') {
					ulContent += '<li class="divider"></li>';
				} else {
					if(!firstOpt) {
						firstOpt = id;
					}
					ulContent += '<li data-val="'+ id +'"><a href="javascript:void(0);">' + (listData[id]|| id) + '</a></li>';
				}
			}
		}
	}

	this.$menuUl.html(ulContent);

	//设置是否可以编辑
	this.options.editable = (this.$menuUl.html().indexOf(".hand-set") === -1 ? this.options.editable : true);

	if (this.options.editable) {
		this.$input.removeAttr("readonly");
	} else {
		this.$input.attr("readonly", "readonly");
	}
	

	this.setValue((options.initVal || firstOpt));
};


//下拉框的显示隐藏
ToSelect.prototype.toggle = function() {
	var hidden = this.$menuUl.hasClass("none"),
		that = this;
	
	clearMenu();

	this.$menuUl.find("li").removeClass("focus");
	if (!hidden) {
		this.$menuUl.animateHide(200);
		//this.$element.find("btn").trigger("focus");
	} else {
		this.$menuUl.animateShow().find("a").eq(0).trigger("focus");
		this.$menuUl.find("li").each(function() {
			if (that.value == $(this).attr("data-val")) {
				that.chooseItem($(this));
			}
		});
	}
};

//选取下拉某项
ToSelect.prototype.selectItem = function($item) {
	var value = $item.attr("data-val");

	if (value === ".hand-set") {//如果选择手动设置
		this.$input.trigger("focus.re.toselect");
	} else if (value !== ".divider"){
		this.setValue(value);
		this.$element.trigger("check.re");
	}
	clearMenu();
};

//选择下拉某项
ToSelect.prototype.chooseItem = function($item) {
	this.$menuUl.find("li").removeClass("focus");
	if (!$item.hasClass("divider")) {
		$item.addClass("focus").find("a").trigger("focus");
	}
};


//处理键盘上下选择, upOrDown 正数向下负数向上
ToSelect.prototype.choose = function(upOrDown) {
	if (this.$menuUl.is(":hidden")) return;

	var $list = this.$menuUl.find("li").not(".divider"),
		$chosenLi = $list.filter(".focus");

	if ($chosenLi.length === 0) {
		$chosenLi = upOrDown > 0 ? $list.first() : $list.last();
	} else if ($list.length > 0) {
		var index = $list.index($chosenLi);
		index = upOrDown > 0 ? index + 1 : index - 1; 
		if (index === $list.length) {
			index = 0;
		} else if (index < 0){
			index = $list.length - 1;
		}
		$chosenLi = $list.eq(index)
	}
	this.chooseItem($chosenLi);
};

//处理键盘Enter
ToSelect.prototype.keyEnter = function() {
	var $list = this.$menuUl.find("li").not(".divider"),
		$chosenLi = $list.filter(".focus");

	if (this.$menuUl.is(":visible") && $chosenLi.length > 0) {
		this.selectItem($chosenLi.eq(0));
	} else {
		this.toggle();
	}
};


ToSelect.prototype.setValue = function(value) {
	var that = this;

	this.value = value;
	//that.$element.trigger("check.re");
	if (value !== ".divider" && value !== ".hand-set" && this.options.options[0].hasOwnProperty(value)) {
		this.$input[0].value = this.options.options[0][value];
	} else {
		that.$input[0].value = value
		if (!$(that.$element).hasClass("validatebox-invalid") && value !== "" && !this.hasFocus) {
			that.$input[0].value += that.options.units;
		}
	}
};


//disable the dropdown
ToSelect.prototype.disable = function(disabled) {
	this.$input.prop("disabled", disabled);
	if (disabled) {
		this.$element.find(".btn").addClass("disabled");
	} else {
		this.$element.find(".btn").removeClass("disabled");
	}
	
};

function getParent($elem) {
	if (!$elem.hasClass(".input-append")) {
		$elem = $elem.parents(".input-append");
	}
	return $elem;
}

function clearMenu() {
	$(".input-select ul").each(function() {
		$(this).animateHide(200);
	});
	//console.log("clear")
}

function clickCaret(e) {//this.blur();
	if (e.keyCode === 13) return
	var $parent = getParent($(e.target)),
		selectObj = $parent.data("re.toselect");

	selectObj.toggle();
	e.stopPropagation();
	return false
}

function clickItem(e) {
	var $itemElem = $(this),
		$parent = getParent($itemElem),
		selectObj = $parent.data("re.toselect");

	selectObj.selectItem($itemElem);
	e.stopPropagation();
	return false
}

function keydown(e) {
	var $target = $(e.target),
		selectObj = getParent($target).data("re.toselect");

	if ($target.is("input") || !/(38|40|13)/.test(e.keyCode)) return;

	switch (e.keyCode) {
		case 13:
			selectObj.keyEnter();
			break;
		case 38:
			selectObj.choose(-1); 
			break;
		case 40:
			selectObj.choose(1); 
			break;
	}	
	e.stopPropagation();
}

function addPlugin() {
	$(this).each(function() {
		var $this = $(this),
			data = $this.data("re.toselect");

		if (!data) {
			data = $this.data("re.toselect", new ToSelect(this));
		}
	});
}

$.fn.toSelect = function (options) {
	addPlugin.call(this);
	return this.each(function() {
		$(this).data("re.toselect").create(options);
	});
};

$(document).on("click.re.toselect", ".input-append li:not(.divider)", clickItem)
	  .on("click.re.toselect", ".input-append .btn:not(.disabled)", clickCaret)
	  .on("click.re.toselect", clearMenu)
	  .on("keydown.re.toSelect", ".input-append", keydown);
	  
})(window, document);