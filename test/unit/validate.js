QUnit.module('Validate');


QUnit.test('checkAll', function() {
	$('#qunit-fixture').html('<div id="part1"></div>');

	var $inputNum = $('<input type="text" value="2"/>').appendTo('#qunit-fixture #part1'),
		$inputLen = $('<input type="text" value="abc"/>').appendTo('#qunit-fixture #part1'),
		$inputIp = $('<input type="text" value="192.168.0.1"/>').appendTo('#qunit-fixture #part1'),
		$inputAscii = $('<input type="text" value="abc"/>').appendTo('#qunit-fixture #part1');

	$inputNum.addCheck({"type": "num", "args": [1,3]});
	$inputLen.addCheck({"type": "len", "args": [1,3]});
	$inputIp.addCheck({"type": "ip"});
	$inputAscii.addCheck({"type": "ascii"});

	var success = false;
	var customReturn;
	var error;

	var validateObj = $.validate({
		wrapElem: "#qunit-fixture #part1",
		custom: function() {
			return customReturn;
		},
		success: function() {
			success = true;
		},
		error: function(msg) {
			error = msg;
		}
	});

	//全部值均合法，custom返回undefined，success应该被调用
	validateObj.checkAll();
	ok(success, 'Should call success if all check is pass and the return val of custom is undefined');

	//全部值合法，但是custom 返回 非假值
	customReturn = 'Something error';
	success = false;
	validateObj.checkAll();
	ok(!success && error == 'Something error', 'Should call error if custom return Something');

	//输入有错不通过, 不执行success
	$inputNum.val(5);
	customReturn = undefined;
	success = false;
	error = undefined;

	validateObj.checkAll();

	ok(!success, 'If basic check of elem is fail then nerver call success');
});


// 同步方法check
QUnit.test('check', function() {
	$('#qunit-fixture').html('<div id="part1"></div>');

	var $inputNum = $('<input type="text" value="2"/>').appendTo('#qunit-fixture #part1'),
		$inputLen = $('<input type="text" value="abc"/>').appendTo('#qunit-fixture #part1'),
		$inputIp = $('<input type="text" value="192.168.0.1"/>').appendTo('#qunit-fixture #part1'),
		$inputAscii = $('<input type="text" value="abc"/>').appendTo('#qunit-fixture #part1');

	$inputNum.addCheck({"type": "num", "args": [1,3]});
	$inputLen.addCheck({"type": "len", "args": [1,3]});
	$inputIp.addCheck({"type": "ip"});
	$inputAscii.addCheck({"type": "ascii"});

	var success = false;
	var customReturn;
	var error;

	var validateObj = $.validate({
		wrapElem: "#qunit-fixture #part1"
	});

	strictEqual(validateObj.check(), undefined, 'Return undefined if every check is passed');

	$inputNum.val(5);
	$inputIp.val('192.168');

	strictEqual(validateObj.check().length, 2);
});