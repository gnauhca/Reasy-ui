QUnit.module('Textboxs', {
	beforeEach: function() {
		this.$ip = $('<span id="textboxsIP"></span>').toTextboxs('ip').appendTo('#qunit-fixture');
		this.$mac = $('<span id="textboxsMAC"></span>').toTextboxs('mac').appendTo('#qunit-fixture');
	}
});

//生成输入框验证
QUnit.test('Create test: create ipt elems while calling the method toTextboxs', function() {

	equal(this.$ip.find('input').length, 4, 'Should create 4 input element for IP');
	equal(this.$mac.find('input').length, 6, 'Should create 6 input element for MAC');
});

//取赋值 
QUnit.test('Value test: ', function() {
	this.$ip.val('192.168.98.20');
	equal(this.$ip.val(), '192.168.98.20', 'IP Value error');

	this.$ip.val('192.168.98.');
	equal(this.$ip.val(), '192.168.98.', 'IP Value error');

	this.$mac.val('00:00:00:00:00:00');
	equal(this.$mac.val(), '00:00:00:00:00:00', 'MAC Value error');


	this.$mac.val('00:00:00:00:00');
	equal(this.$mac.val(), '00:00:00:00:00', 'MAC Value error');
});

//Disable
QUnit.test('Disable: disable all input elements while calling the disable method', function() {
	this.$ip.disable(true);
	equal(this.$ip.find('input:disabled').length, 4);

	this.$ip.disable(false);
	equal(this.$ip.find('input:disabled').length, 0);


	this.$mac.disable(true);
	equal(this.$mac.find('input:disabled').length, 6);

	this.$mac.disable(false);
	equal(this.$mac.find('input:disabled').length, 0);


});