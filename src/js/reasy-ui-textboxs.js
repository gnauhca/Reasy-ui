/*!
 * REasy UI Textboxs @VERSION
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function () {"use strict";
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
			textboxs[i].value = (textboxsValues[i] || '');
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

})();
