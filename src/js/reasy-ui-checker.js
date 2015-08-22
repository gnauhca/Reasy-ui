/*!
 * REasy UI Validate @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 *  reasy-ui-valid-lib.js
 *  reasy-ui-combine-lib.js
 */

(function (window, document) {"use strict";

function Checker(element) {
	this.hasBeenInit = false;
	this.$element = $(element);
	this.checkOptions = [];
	this.$tipElem = null;
	this.combineOptions = [];
	this.correctType = "";//自动纠正类型
	this.errorMsg = "";

	this.init();

}

//初始验证功能，事件绑定
Checker.prototype.init = function(options) {
	var that = this,
		dataOptions = this.$element[0].getAttribute("data-options"),
		htmlOptions = (dataOptions? $.parseJSON(dataOptions) : null);
		options = options || htmlOptions;

	if (options) {
		this.checkOptions = [];
		//支持多条验证规则
		options = $.isArray(options)? options : (options? [options]: []);


		for (var i = 0; i < options.length; i++) {
			if(!options[i] || typeof options[i] !== 'object') {
				continue
			}
			if (options[i].type) {

				//普通验证规则
				this.checkOptions.push(options[i]);
			} else if (options[i].combineType) {
				//联合验证规则
				this.addCombine(options[i].combineType, $(options[i].relativeElems), options[i].msg);
				//console.log(this.combineOptions)
			}
		}
	} else if (this.hasBeenInit) {
		return;
	}
	

	//取得自动纠正类型
	this.correctType = getCorrectType(this.checkOptions);

	//监听元素事件触发验证程序
	this.$element.off(".re.checker").on("focus.re.checker blur.re.checker keyup.re.checker check.re.re.checker", function (e) {
		var eventType = e.checktype || (e ? e.type : null);
		that.check(eventType);
	});

	/*!this.hasBeenInit && this.$element.addValFun(function(value) {
		if (typeof value !== "undefined") {
			setTimeout(function() {that.check()}, 0)
		}
	});*/
	this.hasBeenInit = true;
}

/* 
* 普通验证，非关联元素发起
* @ eventType == combineTrigger 的话代表是其关联元素值改变时触发的验证
* @ triggerType 关联元素值改变触发类型，为blur的时候，才提示关联错误系信息，其他时候移除关联错误系信息
*/
Checker.prototype.check = function(eventType, triggerType) {
	var that = this;

	//如果元素不可见，直接通过验证。
	if (this.$element.is(":hidden")) {
		return undefined;
	}

	this.errorMsg = this._selfCheck(eventType);
	
	if (!this.errorMsg && eventType !== "focus" && eventType !== "keyup" && 
		triggerType !== "focus" && triggerType !== "keyup") {

		this.errorMsg = this._combineCheck();
	}


	setTimeout(function() {
		if (that.errorMsg) {
			that.addValidateTip(that.errorMsg, true);
		} else {
			that.removeValidateTip();
		}
	}, 30);

	return (this.errorMsg || undefined);
}

//自身验证
Checker.prototype._selfCheck = function(eventType) {
	var datas = this.checkOptions, //支持多条验证规则
		thisVal = "",
		valid = $.valid,
		errorMsg, //错误信息
		isEmpty,
		args,
		validType;
	
	// 先纠正输入
	$.inputCorrect(this.$element, this.correctType);

	thisVal = this.$element.val();

	//如果元素拥有required属性且值为空，且验证不是聚焦和keyup触发的
	isEmpty = thisVal === "";
	if ((this.$element.attr('required') === 'required' || this.$element[0].required) && isEmpty) {
		if (eventType !== 'keyup'  && eventType !== 'focus') {
			errorMsg = _($.reasyui.MSG["this field is required"]);
		}
		
	} else if (!isEmpty) {

		//对data-options的每一条规则验证，出错就提示
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];

			args = [thisVal+""].concat(data.args || []);
			validType = valid[data.type];

			// 如果validType为函数，说明错误都很明确
			if (typeof validType === "function") {
				errorMsg = validType.apply(valid, args);
			
			// 错误类型需要分类处理
			} else {
			
				//如果是keyup或focus事件
				if (eventType === 'keyup' || eventType === 'focus') {
				
					// 只验证明确的错误，提示修改方案
					if (validType && typeof validType.specific === 'function') {
						errorMsg = validType.specific.apply(validType, args);
					}
				
				//其他类型事件
				} else {
				
					// 完整性验证，不明确的错误，无法给出修改方案
					if (validType && typeof validType.all === 'function') {
						errorMsg = validType.all.apply(validType, args);
					}
				}
			}	

			//出错，直接报此错误，跳出
			if (errorMsg) {
				errorMsg = (data.msg || errorMsg);
				break;
			}
		}
	}

	return (errorMsg || undefined);
}

//联合验证
Checker.prototype._combineCheck = function() {
	var combineOptions = this.combineOptions,
		combineOption,
		combineCheckFun,
		errorMsg,
		notAllEmpty = false,
		focus = false;

	//遍历每一条联合验证规则
	for (var i = combineOptions.length - 1; i >= 0; i--) {
		combineOption = combineOptions[i];
		focus = false;
		combineCheckFun = null;
		if (typeof combineOption.type == "string") {
			combineCheckFun = $.combineValid[combineOption.type];
		} else if (typeof combineOption.type == "function"){
			combineCheckFun = combineOption.type;
		}
		if (combineCheckFun) {
			var args = [];

			for (var j = 0; j < combineOption.$elems.length; j++) {
				if (combineOption.$elems.eq(j).is(':focus')) {
					focus = true;
					break;
				}
				notAllEmpty = (notAllEmpty || combineOption.$elems.eq(j).val());
				args.push(combineOption.$elems.eq(j).val());				
			}

			args.push(combineOption.msg);
			errorMsg = (notAllEmpty && !focus) ? combineCheckFun.apply($.combineValid, args) : "";
			if (errorMsg) {
				return errorMsg;
			}
		}
	}
	
}

//解除其验证功能
Checker.prototype.fireCheck = function() {
	this.checkOptions = [];
	this.correctType="";
	this.check();
} 

//添加tip，如果invalid真，则给验证元素添加警示类validatebox-invalid
Checker.prototype.addValidateTip = function(str, invalid) {
	if (!this.$tipElem) {
		var tipElem = document.createElement('span');
		
		tipElem.innerHTML = '<span class="validatebox-tip">' +
	                '<span class="validatebox-tip-content">'+ str + '</span>'+
	                '<span class="validatebox-tip-pointer"></span>' +
	            '</span>';

	    this.$tipElem = $(tipElem).addClass("validatebox-tip-wrap").hide();
		this.$element.after(tipElem);
	}

	this.$tipElem.animateShow().find(".validatebox-tip-content").html(str);
	if (invalid) {
		this.$element.addClass("validatebox-invalid");
	}
}

Checker.prototype.removeValidateTip = function() {
	$(this.$tipElem).animateHide(200);
	this.$element.removeClass("validatebox-invalid");
}

//增加联合验证，第二个参数可是是已有的联合验证类型，或自定义的回调
Checker.prototype.addCombine = function(combineTypeOrCallback, combineElems, str) {
	var that = this,
		$combineElems = $(combineElems[0]);

	for (var i = 0; i < combineElems.length; i++) {
		if (combineElems[i] == "self") {
			$combineElems = $combineElems.add(this.$element);
		} else {
			$combineElems = $combineElems.add($(combineElems[i]));
		}
	}

	this.combineOptions.push({$elems: $combineElems, type: combineTypeOrCallback, msg: str});

	$combineElems.not(this.$element).on("blur keyup focus", function(e) {
		var eventType = (e ? e.type : null);

		setTimeout(function() {
			that.check("combineTrigger", eventType);
		}, 0);
	});
}

//取得自动纠错的类型，首取correctType，没有的话取type
function getCorrectType(options) {
	var type = "";

	$.each(options, function(i, data) {
		if (data.correctType) {
			type = data.correctType;
			return false;
		}
		if ($.corrector[data.type]) {
			type = data.type;
		}
	});
	return type;
}

function addPlugin($elems) {
	$elems.each(function() {
		var $this = $(this),
			data = $this.data("re.checker");

		if (!data) {
			data = $this.data("re.checker", new Checker(this));
		}
	});
}

//手动加入验证，否则只会在validate包含此元素的时候加入验证
//options 缺省的话使用自身属性data-options
$.fn.addCheck = function(options) {
	addPlugin(this);
	return this.each(function() {
		$(this).addClass('validatebox');
		$(this).data("re.checker").init(options);
	});
}

$.fn.addValidateTip = function(str) {
	addPlugin(this);
	return this.each(function() {
		if ($(this).data("re.checker")) {
			$(this).data("re.checker").addValidateTip(str);
		}		
	});
}

$.fn.removeValidateTip = function() {
	addPlugin(this);
	return this.each(function() {
		if ($(this).data("re.checker")) {
			$(this).data("re.checker").removeValidateTip();
		}		
	});
}

//验证jquery 对象， 全部通过返回undefined 
//出错返回第一个错误元素对应错误信息
$.fn.check = function() {
	addPlugin(this);

	var checkResult,
		errorMsg;

	this.each(function() {
		if ($(this).data("re.checker")) {

			checkResult = $(this).data("re.checker").check();
			if (!errorMsg && checkResult) {
				errorMsg = checkResult;
			}
		}		
	});
	return errorMsg;
}

$.fn.addCombine = function(options) {
	addPlugin(this);

	return this.each(function() {
		if ($(this).data("re.checker")) {
			$(this).data("re.checker").addCombine(options.combineType, options.relativeElems, options.msg);
		}		
	});
}


//解除验证
$.fn.fireCheck = function() {
	if ($(this).data("re.checker")) {
		$(this).data("re.checker").fireCheck();
	}
}

$(function() {
	$(".validatebox").addCheck();
});

})(window, document);