QUnit.module('Check-lib', {
	beforeEach: function() {
		this.lib = $.valid;
		this.msg = function(str, replacement) {
			return _($.reasyui.MSG[str], replacement);
		};
	}
});

//不提供max 或 min 则返回undeined
QUnit.test('Len: return undefined if param max and min is empty', function() {
	strictEqual(this.lib.len('123'), undefined, ''); 
});

QUnit.test('Len: return undefined if str length is legal', function() {
	strictEqual(this.lib.len('123', 3, 8), undefined, ''); 
	strictEqual(this.lib.len('12345678', 3, 8), undefined, ''); 
	strictEqual(this.lib.len('12345', 3, 8), undefined, ''); 
});

QUnit.test('Len: return error msg if  str length is illegal', function() {
	strictEqual(typeof(this.lib.len('12', 3, 8)), 'string', ''); 
	strictEqual(typeof(this.lib.len('123456789', 3, 8)), 'string', ''); 
});


//bytelen 测试 在core 中的getUtf8Length

QUnit.test('Num: return undefined if param max and min is empty', function() {
	strictEqual(this.lib.num(5), undefined);
});

QUnit.test('Num: return undefined if num is legal', function() {
	strictEqual(this.lib.num(5, 3, 8), undefined);
	strictEqual(this.lib.num(3, 3, 8), undefined);
	strictEqual(this.lib.num(8, 3, 8), undefined);
});


QUnit.test('Num: return error msg if num is illegal', function() {
	strictEqual(typeof(this.lib.num(2, 3, 8)), 'string');
	strictEqual(typeof(this.lib.num(9, 3, 8)), 'string');
});


//float
QUnit.test('Float: return error msg if num is illegal', function() {
	strictEqual(this.lib.float('88..5'), this.msg["Must be float"]);
});

//mac
QUnit.test('MAC: return error msg if format is illegal', function() {
	strictEqual(this.lib.mac.all('q0:25:77:99:99:00'), this.msg('Please input a validity MAC address'));
	strictEqual(this.lib.mac.all('a0:25:77:99:99:0'), this.msg('Please input a validity MAC address'));
	strictEqual(this.lib.mac.all('a0-25-77-99-99-00'), this.msg('Please input a validity MAC address'));
});

QUnit.test('MAC: return error msg if str is illegal', function() {
	strictEqual(this.lib.mac.all('a1:25:77:99:99:00'), this.msg('The second character must be even number.'));
	strictEqual(this.lib.mac.all('ab:25:77:99:99:00'), this.msg('The second character must be even number.'));
	strictEqual(this.lib.mac.all('00:00:00:00:00:00'), this.msg('Mac can not be 00:00:00:00:00:00'));
});

QUnit.test('MAC: return undefined if str is legal', function() {
	strictEqual(this.lib.mac.all('a2:25:77:99:99:00'), undefined);
	strictEqual(this.lib.mac.all('0a:00:00:00:00:00'), undefined);
});

//ip 无广播地址版 normal
QUnit.test('IP: return error msg if format is illegal', function() {
	strictEqual(this.lib.ip.all('172.16.100.a'), this.msg('Please input a validity IP address'));
	strictEqual(this.lib.ip.all('172.16.100.88.9'), this.msg('Please input a validity IP address'));
	strictEqual(this.lib.ip.all('172.16.100-9'), this.msg('Please input a validity IP address'));
});

QUnit.test('IP: return error msg if str val is illegal', function() {
	strictEqual(this.lib.ip.all('172.16.100.256'), this.msg('Please input a validity IP address'));
	strictEqual(this.lib.ip.all('127.0.0.1'), this.msg('IP address first input cann\'t be 127, becuse it is loopback address.'));
	strictEqual(this.lib.ip.all('224.16.100.19'), this.msg('First input %s greater than 223.', ['224']));
	strictEqual(this.lib.ip.all('192.168.1.255'), this.msg('Can\'t input broadcast address'));
});

QUnit.test('IP: return undefined if str is a valid ip', function() {
	strictEqual(this.lib.ip.all('192.168.98.1'), undefined);
	strictEqual(this.lib.ip.all('192.168.98.254'), undefined);
});

//ip 可以输入广播地址 ipLoose
QUnit.test('IP loose: IP that allow broadcast address', function() {
	strictEqual(this.lib.ipLoose.all('192.168.1.255'), undefined);
});

//MASK 子网掩码
QUnit.test('MASK: return error msg if str is an invalid MASK', function() {
	strictEqual(this.lib.mask('255-255.255.0'), this.msg('Please input a validity subnet mask'));
	strictEqual(this.lib.mask('253.0.0.0'), this.msg('Please input a validity subnet mask'));
	strictEqual(this.lib.mask('253.0.255.0'), this.msg('Please input a validity subnet mask'));
	strictEqual(this.lib.mask('128.255.0.0'), this.msg('Please input a validity subnet mask'));
});

QUnit.test('MASK: return undefined if str is a valid MASK', function() {
	strictEqual(this.lib.mask('255.255.255.254'), undefined);
	strictEqual(this.lib.mask('255.255.255.252'), undefined);
	strictEqual(this.lib.mask('255.255.255.248'), undefined);
	strictEqual(this.lib.mask('255.255.255.224'), undefined);
	strictEqual(this.lib.mask('255.255.255.192'), undefined);
	strictEqual(this.lib.mask('255.255.255.128'), undefined);
	strictEqual(this.lib.mask('255.255.255.0'), undefined);
});


//hex test 
QUnit.test('HEX: a-fA-F0-9', function() {
	strictEqual(this.lib.hex('123-'), this.msg('Must be hex.'));
	strictEqual(this.lib.hex('123g'), this.msg('Must be hex.'));
	strictEqual(this.lib.hex('123&'), this.msg('Must be hex.'));
	strictEqual(this.lib.hex('1230'), undefined);
	strictEqual(this.lib.hex('123a'), undefined);
	strictEqual(this.lib.hex('123A'), undefined);
	strictEqual(this.lib.hex('123B'), undefined);
});


//ascii
QUnit.test('ASCII:', function() {
	strictEqual(this.lib.ascii('。、asdf'), this.msg('Must be ASCII.'));
	strictEqual(this.lib.ascii('中文'), this.msg('Must be ASCII.'));
	strictEqual(this.lib.ascii('5526asdf'), undefined);
});


//remarkTxt
QUnit.test('RemarkTxt', function() {
	strictEqual(this.lib.remarkTxt('abcdef', 'ef'), this.msg("Can't input: '%s'", ['e']));
	strictEqual(this.lib.remarkTxt('abcd', 'ef'), undefined);
});