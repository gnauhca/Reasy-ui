/*!
 * REasy UI alert @VERSION
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function (window, document) {
'use strict';

var wrongWrapEle = null,
	wrongTipEle = null;

$.extend({			
    alert: function(tipTxt, showTime) {
	    tipTxt = tipTxt + '',
		showTime = showTime || (600 + tipTxt.length * 40);

    	if(wrongTipEle === null) {
			wrongWrapEle = document.createElement('div'),
			wrongTipEle = document.createElement('div'),
			wrongWrapEle.className = 'wrong-wrap';
			wrongTipEle.className = 'wrong-tip';
			$(wrongWrapEle).append(wrongTipEle).hide();
			document.body.appendChild(wrongWrapEle);	    		
    	}
    	if ($.trim(tipTxt) === '') {
    		return;
    	}
        wrongTipEle.innerHTML = tipTxt;
        $(wrongWrapEle).stop(true).hide().fadeTo(0, 0).show().
        	css({'top':'30%'}).
        	animate({'top':'25%', 'opacity': '1'},200).
        	animate({'top':'25%', 'opacity': '1'}, showTime, function() {
				$(wrongWrapEle).animate({'top':'20%','opacity': '0'}, 500, function() {
					$(wrongWrapEle).hide();
				});
        	});
    }

});
})(window, document);