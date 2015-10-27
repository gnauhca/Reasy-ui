/*!
 * REasy UI Select @VERSION
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
	this.$element.addValFun(function() {
		if (arguments.length > 0) {
			that.setValue(arguments[0]);
		}
		return that.value;
	});

	this.$element[0].disable = function(disabled) {
		that.disable(disabled);
	}
}


//创建所需html
ToSelect.prototype.create = function(options) {
	options = $.extend((this.created ? this.options : defaults), options);
	
	var listData = options.options,
		firstOpt = "",
		sizeClass = (sizeClasses[options.size] || sizeClasses.meduim),
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
		this.$element.addClass("input-append").attr("data-val", "true");
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
	var hidden = this.$menuUl.is(":hidden"),
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
	/*jshint validthis:true */
	var $itemElem = $(this),
		$parent = getParent($itemElem),
		selectObj = $parent.data("re.toselect");

	selectObj.selectItem($itemElem);
	e.stopPropagation();
	return false;
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
	e.preventDefault();
}

function addPlugin($elems) {
	$elems.each(function() {
		var $this = $(this),
			data = $this.data("re.toselect");

		if (!data) {
			data = $this.data("re.toselect", new ToSelect(this));
		}
	});
}

$.fn.toSelect = function (options) {
	addPlugin(this);
	return this.each(function() {
		$(this).data("re.toselect").create(options);
	});
};

$(document).on("click.re.toselect", ".input-append li:not(.divider)", clickItem)
	  .on("click.re.toselect", ".input-append .btn:not(.disabled)", clickCaret)
	  .on("click.re.toselect", clearMenu)
	  .on("keydown.re.toSelect", ".input-append", keydown);
	  
})(window, document);