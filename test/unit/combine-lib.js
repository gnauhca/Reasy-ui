QUnit.module('Combine-lib', {
	beforeEach: function() {
		this.clib = $.combineValid;
		this.msg = function(str, replacement) {
			return _($.reasyui.MSG[str], replacement);
		}
	}
});


QUnit.test('Equal', function() {
	strictEqual(this.clib.equal('a', 'b', 'A is not equal to B'), 'A is not equal to B');
	strictEqual(this.clib.equal(0, '', 'A is not equal to B'), 'A is not equal to B');
	strictEqual(this.clib.equal('a', 'a', 'A is not equal to B'), undefined);
});

QUnit.test('staticIp', function() {
	strictEqual(this.clib.staticIp('192.168.0.1', '255.255.255.0', '192.168.0.1'), this.msg('Static IP cannot be the same as default gateway.'));
	strictEqual(this.clib.staticIp('192.168.0.1', '255.255.255.0', '192.168.0.2'), undefined);
	strictEqual(this.clib.staticIp('192.168.0.1', '255.255.255.0', '192.168.1.1'), this.msg('Static IP and default gateway be in the same net segment'));
});


QUnit.test('ipSegment', function() {
	strictEqual(this.clib.ipSegment('192.168.1.1', '255.255.255.0'), this.msg('please enter a valid IP segment'));
	strictEqual(this.clib.ipSegment('192.168.1.0', '255.255.0.0'), this.msg('please enter a valid IP segment'));
	strictEqual(this.clib.ipSegment('192.168.1.0', '255.255.255.0'), undefined);
	strictEqual(this.clib.ipSegment('192.168.1.128', '255.255.255.128'), undefined);
});