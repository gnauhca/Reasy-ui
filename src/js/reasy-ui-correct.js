/*!
 * REasy UI Correct @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {"use strict";
	var corrector = {
		ip: function(str) {
			var curVal = str,
				ipArr;
			curVal = curVal.replace(/([^\d\.]|\s)/g, "");

			ipArr = curVal.split(".");
			$.each(ipArr, function(i, ipPart) {
				ipArr[i] = (ipArr[i] == ""?"":parseInt(ipPart, 10));
			});
			return ipArr.join(".");
		},
		mac: function(str) {
			var curVal = str;
			curVal = curVal.replace(/([^\d\:a-fA-F]|\s)/g, "");
			return curVal;
		},
		num: function(str) {
			var curVal = str;
			curVal = curVal.replace(/([^\d]|\s)/g, "");
			return isNaN(parseInt(curVal, 10))?"":parseInt(curVal, 10) + "";
		},
		float: function(str) {
			var curVal = str;
			curVal = curVal.replace(/([^\d\.]|\s)/g, "");
			if (/\./.test(curVal)) {
				var split = curVal.split(".");
				curVal = split[0] + ".";
				split.shift();
				curVal += split.join("");
			}
			return curVal;
		}
	}

	function correctTheElement(type) {
		if (!$(this).val() || !type || !corrector[type]) return;
    	var curVal = $(this).val() + "";
    	var newVal = corrector[type](curVal);
    	if (newVal != curVal) {
    		$(this).val(newVal);
    	}		
	}

	$.fn.inputCorrect=function(type){
        this.each(function(){
			if (!type || !corrector[type]) {
				return;
			}
            $(this).off(".re.correct").on("keyup.re.correct blur.re.correct correct.re", function() {
            	correctTheElement.call(this, type);
            });
        });
        return this;
    }

    $.inputCorrect = function($elem, type) {
    	correctTheElement.call($elem, type);
    }

    $.corrector = corrector;

})(window, document);