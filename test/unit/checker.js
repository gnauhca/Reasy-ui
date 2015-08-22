QUnit.module('Checker', {
	beforeEach: function() {
		this.$input = $('<input type="text">').appendTo('#qunit-fixture');
		this.$input.addCheck();
		this.$inputCheckObj = this.$input.data('re.checker');

		this.msg = function(str, replacement) {
			return _($.reasyui.MSG[str], replacement);
		};
	}
});

//最后一次调用 addCheck 添加的规则应该要覆盖之前的规则
QUnit.test('Alway active the last rule', function() {
	this.$input.addCheck({"type": "ip"});
	this.$input.addCheck({"type": "num"});
	deepEqual(this.$inputCheckObj.checkOptions, [{"type": "num"}]);
});


//self check
QUnit.test('Self check: empty value check', function() {
	this.$input.addCheck({"type": "ip"});

	this.$input.val('');
	strictEqual(this.$inputCheckObj.check(), undefined, 'Pass the check if elem does not has attr "required".');
	this.$input.attr('required', 'required');
	strictEqual(typeof(this.$inputCheckObj.check()), 'string', 'fail the check if elem has attr "required".');
});

QUnit.test('Self check: valid value test', function() {
	this.$input.addCheck({"type": "ip"});

	this.$input.val('192.168.98.1');
	strictEqual(this.$inputCheckObj.check(), undefined, 'Pass the check while providing valid value');

	this.$input.val('172.16.100.1');
	strictEqual(this.$inputCheckObj.check(), undefined, 'Pass the check while providing valid value');

	this.$input.val('128.0.1.1');
	strictEqual(this.$inputCheckObj.check(), undefined, 'Pass the check while providing valid value');
});

QUnit.test('Self check: invalid value check', function() {
	this.$input.addCheck({"type": "ip"});
	this.$input.val('122.55.0');
	strictEqual(typeof(this.$inputCheckObj.check()), 'string', 'Should return errmsg if fail');

	this.$input.addCheck([{"type": "len", args: [2, 5]}, {"type": "ascii"}]);
	this.$input.val('中文abcdef');
	strictEqual(this.$inputCheckObj.check(), this.msg('String length range is: %s - %s bit', [2,5]), 'Alway return the first err msg');
});

QUnit.test('Self check: invisible elem alway pass the check', function() {
	this.$input.val('122.55.0');
	this.$input.hide();
	strictEqual(this.$inputCheckObj.check(), undefined);
});

//Specify check
QUnit.test('Self check: check the specify fun only when event type is keyup', function() {

	this.$input.addCheck({"type": "ip"});

	this.$input.val('192.1');
	strictEqual(this.$inputCheckObj.check('keyup'), undefined, 'Check specify only');

	this.$input.val('127.1');
	strictEqual(this.$inputCheckObj.check('keyup'), this.msg("IP address first input cann't be 127, becuse it is loopback address."));
});

//fireCheck
QUnit.test('fireCheck', function() {
	this.$input.addCheck({"type": "ip"});

	this.$input.val('192.168.');
	strictEqual(typeof(this.$inputCheckObj.check()), 'string');

	this.$input.fireCheck();

	strictEqual(this.$inputCheckObj.check(), undefined, 'Should fire all check task after calling fireCheck()');
});


/* combine check*/
QUnit.module('Checker: combine check', {
	beforeEach: function() {
		this.$input = $('<input type="text" id="ipt"/>').appendTo('#qunit-fixture');
		this.$equalToInput = $('<input type="text" />').appendTo('#qunit-fixture');

		this.$equalToInput.addCheck({
			"combineType": "equal",
			"relativeElems": ["#ipt", "self"],
			"msg": "Be sure equal to #ipt"
		});
	}

});


QUnit.test('Combine: equal', function() {
	this.$input.val('abc');
	this.$equalToInput.val('abcd');

	strictEqual(this.$equalToInput.data('re.checker').check(), 'Be sure equal to #ipt');

	this.$equalToInput.val('abc');
	strictEqual(this.$equalToInput.data('re.checker').check(), undefined);
});


/*QUnit.test('Combine: do not check if any of elem in combinelist is focused', function() {
	expect(1);
	stop();

	this.$input.val('abc');
	this.$equalToInput.val('abcd');
	this.$input.focus();

	var $equalToInput = this.$equalToInput;
	setTimeout(function() {
		strictEqual($equalToInput.data('re.checker').check(), undefined);
		start();
	}, 100);
});

QUnit.test('Combine: do not check if any of elem in combinelist is focused 2', function() {
	expect(1);
	stop();

	this.$input.val('abc');
	this.$equalToInput.val('abcd');
	this.$equalToInput.focus();

	var $equalToInput = this.$equalToInput;
	setTimeout(function() {
		strictEqual($equalToInput.data('re.checker').check(), undefined);
		start();
	}, 100);
});*/












