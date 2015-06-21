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