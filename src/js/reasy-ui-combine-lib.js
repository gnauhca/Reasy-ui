/*!
 * REasy UI combine-lib @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function () {"use strict";

function isSameNet(ip_lan, ip_wan, mask_lan, mask_wan) {
	var ip1Arr = ip_lan.split("."),
		ip2Arr = ip_wan.split("."),
		maskArr1 = mask_lan.split("."),
		maskArr2 = mask_wan.split("."),
		i;

	for (i = 0; i < 4; i++) {
		if ((ip1Arr[i] & maskArr1[i]) != (ip2Arr[i] & maskArr2[i])) {
			return false;
		}
	}
	return true;
}

$.combineValid = {
	//必须一样
	equal: function (str1, str2, msg) {
		if (str1+"" != str2+"") {
			return msg;
		}
	},

	//不能一样
	notEqual: function (str1, str2, msg) {
		if (str1 == str2) {
			return msg;
		}
	},

	//ip mask gateway 组合验证
	staticIp: function(ip, mask, gateway) {
		if (ip == gateway) {
			return _($.reasyui.MSG['Static IP cannot be the same as default gateway.']);
		}

		if (!isSameNet(ip, gateway, mask, mask)) {
			return _($.reasyui.MSG['Static IP and default gateway be in the same net segment']);
		}
	},

	ipSegment: function (ipElem, maskElem, msg) {
		var ip,
			mask,
			ipArry,
			maskArry,
			len,
			maskArry2 = [],
			netIndex = 0,
			i = 0;


		ip = ipElem;
		mask = maskElem;

		ipArry = ip.split(".");
		maskArry = mask.split(".");
		len = ipArry.length;

		for (i = 0; i < len; i++) {
			maskArry2[i] = 255 - Number(maskArry[i]);
		}

		for (var k = 0; k < 4; k++) { // ip & 255 - mask
			if ((ipArry[k] & maskArry2[k]) === 0) {
				netIndex += 0;
			} else {
				netIndex += 1;
			}
		}

		if (netIndex === 0) {
			return;
		} else {
			return msg || _($.reasyui.MSG['please enter a valid IP segment']);
		}
	}		
};

$.extend($.reasyui.MSG, {
	'Static IP cannot be the same as default gateway.': '静态IP不能和默认网关一样',
	'Static IP and default gateway be in the same net segment': '静态IP和默认网关必须在同一网段',
	'please enter a valid IP segment': '请输入正确的IP网段'
});
})();