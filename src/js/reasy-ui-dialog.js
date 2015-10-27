/*!
 * REasy UI Dialog @VERSION
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (document) { "use strict";
	
	//dialog对象
	function Dialog() {
		this.applyCallback = null;
		this.cancelCallback = null;

		this.$dialog = null;
		this.$overlay = null;
		this.$btnWrap = null;
	}	
	
	Dialog.prototype = {

		_createDialog:　function (title, content) {
			var dialogFrameHTML = '<div class="dialog none" id="dialog"><h2 class="dialog-title">' +
									'<span id="dialog-title">' + title + '</span>' + 
									'<a href="javascript:void(0);" type="button" class="close" id="dialog-close">&times;</a>' +
									'</h2>' +
									'<div class="dialog-content dialog-content-massage" id="dialog-content-massage">' + content + '</div>' + 
								   '</div>';

			var btnHTML = '<div class="dialog-btn-group">' +
							'<button type="button" class="btn" id="dialog-apply">确定</button>' +
							'<button type="button" class="btn" id="dialog-cancel">取消</button>' +
						'</div>';

			this.$btnWrap = $(btnHTML);
			this.$dialog = $(dialogFrameHTML).append(this.$btnWrap).appendTo('body');
			this.$overlay = $('<div class="overlay none"></div>').appendTo($("body"));

			var that = this;
			$(document).on("click.re.dialog", "#dialog-close", function() {
				that.cancel();
			});
			$(document).on("click.re.dialog", "#dialog-apply", function() {
				that.apply();
			}).on("click.re.dialog", "#dialog-cancel", function() {
				that.cancel();
			});		
		},
		
		close: function () {
			this.$dialog.animateHide(200);
			this.$overlay.hide();
		},
		
		open: function (title, content, applyCallback, cancelCallback) {
			if (!document.getElementById('dialog')) {
				this._createDialog(title, content);
			} else {
				this.$dialog.find('#dialog-title').text(title);
				this.$dialog.find('#dialog-content-massage').text(content);
			}

			this.applyCallback = applyCallback;
			this.cancelCallback = cancelCallback;

			if (!this.applyCallback) {
				this.$btnWrap.hide();
			} else {
				this.$btnWrap.show();
			}
			this.$dialog.animateShow(200); 
			this.$overlay.show();
		},
		
		apply: function () {
			if (typeof(this.applyCallback) === 'function') {
				this.applyCallback.apply(this, arguments);
			}
			this.close();
		},
		
		cancel: function () {
			if (typeof(this.cancelCallback) === 'function') {
				this.cancelCallback.apply(this, arguments);
			}
			this.close();
		}
	};
	
	var dialog;
	$.dialog = function () {
		return (dialog? dialog: (dialog = new Dialog()));
	};
})(document);