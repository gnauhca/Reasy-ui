/*!
 * REasy UI animate @VERSION
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

$.fn.animateShow = function() {

	return this.each(function() {
		var $this = $(this);

		if ($this.data("ani-status") == "show") {
			return;
		}

		$this.data("ani-status", "show");
		if (transitionend) {
			$this.addClass("ani-init").show();
			setTimeout(function() {$this.addClass("ani-final");}, 10);
		} else {
			$this.show();
		}
	});
}

$.fn.animateHide = function(durTime) {

	durTime = (durTime || 300);
	return this.each(function() {
		var $this = $(this);
		if ($this.css("display") === "none") {
			return;
		}

		$this.data("ani-status", "hide");
		if (transitionend) {
			$this.addClass("ani-init ani-final");
			$this.removeClass("ani-final");
			$this.one(transitionend, function() { 
				if ($this.data("ani-status") == "hide")
				$this.hide();
			});
			setTimeout(function() {
				if ($this.data("ani-status") == "hide")
				$this.hide();
			}, durTime);
		} else {
			$this.hide();
		}
	});
}

})(window, document);