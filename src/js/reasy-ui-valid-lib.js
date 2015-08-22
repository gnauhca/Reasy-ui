/*!
 * REasy UI valid-lib @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function () {"use strict";

//$.validate.utils = utils;
$.valid = {
	'len': function (str, min, max) {
		var len = str.length;
		
		if (typeof min !== "undefined" && typeof max !== "undefined" && (len < min || len > max)) {	
			return _($.reasyui.MSG['String length range is: %s - %s bit'], [min, max]);	
		}
	},

	'byteLen': function (str, min, max) {
		var totalLength = $.getUtf8Length(str);

		if (typeof min !== "undefined" && typeof max !== "undefined" && (totalLength < min || totalLength > max)) {	
			return _($.reasyui.MSG['String length range is: %s - %s byte'], [min, max]);	
		}
	},	

	'num': function (str, min, max) {
		if(!(/^[0-9]{1,}$/).test(str)) {
			return _($.reasyui.MSG["Must be number"]);		
		}
		if (typeof min != "undefined" && typeof max != "undefined") {
			if(parseInt(str, 10) < min || parseInt(str, 10) > max) {
			
				return _($.reasyui.MSG["Input range is: %s - %s"], [min, max]);
			}
		}
	},

	'float': function (str, min, max) {
		var floatNum = parseFloat(str, 10);

		if(isNaN(floatNum)) {
			return _($.reasyui.MSG["Must be float"]);		
		}
		if (typeof min != "undefined" && typeof max != "undefined") {
			if(floatNum < min || floatNum > max) {
			
				return _($.reasyui.MSG["Input range is: %s - %s"], [min, max]);
			}
		}
	},
	'url': function(str) {
		if (/^[-_~\|\#\?&\\\/\.%0-9a-z\u4e00-\u9fa5]+$/ig.test(str)) {
            if (/.+\..+/ig.test(str) || str == "localhost") {

            } else {
                return _($.reasyui.MSG['Invalid Url']);
            }
        } else {
            return _($.reasyui.MSG['Invalid Url']);
        }
	},
	'mac': {
		all: function (str) {
			var ret = this.specific(str);
			
			if (ret) {
				return ret;
			}
			
			if(!(/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/).test(str)) {
				return _($.reasyui.MSG["Please input a validity MAC address"]);
			}
		},
		
		specific: function (str) {
			var subMac1 = str.split(':')[0];
			
			if (subMac1.charAt(1) && parseInt(subMac1.charAt(1), 16) % 2 !== 0) {
				return _($.reasyui.MSG['The second character must be even number.']);
			}
			if (str === "00:00:00:00:00:00") {
				return _($.reasyui.MSG['Mac can not be 00:00:00:00:00:00']);
			}
		}
	},
	
	'ip': {
		all: function (str, loose) {
			var ret = this.specific(str);
			
			if (ret) {
				return ret;
			}
			
			if(!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/).test(str)) {
				return _($.reasyui.MSG["Please input a validity IP address"]);
			}

			if (!loose) {
				if (str.split('.')[3] === '255') {
					return _($.reasyui.MSG["Can't input broadcast address"]);
				}
			}		
		},
		
		specific: function (str) {
			var ipArr = str.split('.'),
				ipHead = ipArr[0];
			
			if(ipArr[0] === '127') {
				return _($.reasyui.MSG["IP address first input cann't be 127, becuse it is loopback address."]);
			}
			if (ipArr[0] > 223) {
				return _($.reasyui.MSG["First input %s greater than 223."], [ipHead]);
			}
		}
	},

	//支持填写广播地址和回环
	'ipLoose': {
		all: function (str) {
			return $.valid.ip.all(str, true);
		},
		
		specific: function (str) {
			return $.valid.ip.specific(str);
		}
	},
	
	
	'mask': function (str) {
		var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/;
		if(!rel.test(str)) {
			return _($.reasyui.MSG["Please input a validity subnet mask"]);
		}
	},
	
	'email': function (str) {
		var rel = /^[a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ig ;
		if(!rel.test(str)) {
			return _($.reasyui.MSG["Please input a validity E-mail address"]);	
		}
		
	},
	
	'time': function(str) {
		if(!(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).test(str)) {
			return _($.reasyui.MSG["Please input a valid time."]);	
		}
	},
	
	'hex': function (str) {
		if(!(/^[0-9a-fA-F]{1,}$/).test(str)) {
			return _($.reasyui.MSG["Must be hex."]);		
		}
	},
	
	'ascii': function (str, min, max) {
		if(!(/^[ -~]+$/g).test(str)) {
			return _($.reasyui.MSG["Must be ASCII."]);		 
		}
		if(min || max) {
			return $.valid.len(str, min, max);
		}
	},
		
	/*'pwd': function (str, minLen, maxLen) {
		var ret;
		
		if(!(/^[0-9a-zA-Z_]+$/).test(str))	{
			return _($.reasyui.MSG['Must be numbers, letters or an underscore']);
		}

		if (minLen && maxLen) {
			ret = $.valid.len(str, minLen, maxLen);
			if (ret) {
				return ret;
			}
		}
	},
	
	'username': function(str) {
		if(!(/^\w{1,}$/).test(str))	{
			return _($.reasyui.MSG["Please input a validity username."]);
		}
	},
	
	'ssidPasword': function (str, minLen, maxLen) {
		var ret;
		ret = $.valid.ascii(str);
		if (!ret && minLen && maxLen) {
			ret = $.valid.len(str, minLen, maxLen);
			if (ret) {
				return ret;
			}
		}
		
		return ret;
	},*/
	
	'remarkTxt': function (str, banStr) {
		var len = banStr.length,
			curChar,
			i;
			
		for(i = 0; i < len; i++) {
			curChar = banStr.charAt(i);
			if(str.indexOf(curChar) !== -1) {
				return _($.reasyui.MSG["Can't input: '%s'"], [curChar]);
			}
		}
	}
};
// 中文翻译
$.extend($.reasyui.MSG, {
	"Must be number": "请输入数字",
	"Input range is: %s - %s": "输入范围：%s - %s",
	"this field is required": "本项不能为空",
	"String length range is: %s - %s bit": "长度范围：%s - %s 位",
	"String length range is: %s - %s byte": "长度范围：%s - %s 位字节",
	"Please input a validity IP address": "请输入正确的 IP 地址",
	"First input %s greater than 223.": "以%s开始的地址无效，请指定一个1到223之间的值。",
	"First input %s less than 223.": "以 %s 开始的地址无效，请指定一个223到255之间的值。",
	"Can't input broadcast address": "不能输入广播地址",

	"Please input a validity subnet mask": "请输入正确的子网掩码",
	"Please input a validity MAC address": "请输入正确的 MAC 地址",
	"Mac can not be 00:00:00:00:00:00": "Mac 地址不能全为0",
	"Must be ASCII.": "请输入非中文字符",
	"Can't input: '%s'": "不能输入: ‘%s’",
	"Must be numbers, letters or an underscore": "请输入数字，字母或下划线",
	"The second character must be even number.": "MAC 地址的第二个字符必须为偶数",
	"IP address can't be multicast, broadcast or loopback address.": "IP 地址不能为组播,广播或环回地址",
	"IP address first input cann't be 127, becuse it is loopback address.": "以127开始的地址为保留的环回地址，请指定一个1到223之间的值。",

	"Invalid Url": "无效的网址格式",
	"please enter a valid IP segment": "请输入正确的IP网段"
});

})();