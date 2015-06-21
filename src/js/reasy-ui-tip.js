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