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