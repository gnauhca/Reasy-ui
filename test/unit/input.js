QUnit.module('input.placeholder', {
	beforeEach: function() {
		//是否支持placeholder
		this.supportPlaceholder = ('placeholder' in document.createElement('input'));
	}
});


//支持placeholder的浏览器不应该创建placeholder elem
QUnit.test('shouldn\'t create placeholder elem for those browser which is support placeholder', function() {
	if (!this.supportPlaceholder) {
		expect(0);
		return;
	}
	var $textEle = $('<input type="text" placeholder="I m placeholder"/>').appendTo('#qunit-fixture');

	$textEle.addPlaceholder();

	ok(!$textEle.prev().hasClass('placeholder-content'), 'placeholder elem created');
});

//测试低版本浏览器placeholder 元素创建情况
QUnit.test('Create placeholder element for lower version browser', function(assert) {

	if (this.supportPlaceholder) {
		expect(0);
		return;
	}

	var $textEle = $('<input type="text" placeholder="I m placeholder"/>').appendTo('#qunit-fixture');
	$textEle.addPlaceholder();

	ok($textEle.prev().hasClass('placeholder-content'), 'placeholder elem didn\'t created');

	$textEle.addPlaceholder('new placeholder txt');

	equal($textEle.prev().find('.placeholder-text').text(), 'new placeholder txt');

	$textEle.removePlaceholder();
	ok($('#qunit-fixture').find('.placeholder-content').length === 0, 'placeholder elem can not be removed');
});

//值不为空的时候隐藏placeholder elem
QUnit.test('Hide placeholder element when not empty', function() {

	if (this.supportPlaceholder) {
		expect(0);
		return;
	}

	expect(1);

	var $textEle = $('<input type="text" placeholder="I m placeholder" value="some txt"/>').appendTo('#qunit-fixture');
	$textEle.addPlaceholder();
	ok($textEle.prev().hasClass('none'), 'placeholder elem did not hide when not empty');
});



QUnit.test('Test the placeholder when handset the input val', function() {
	if (this.supportPlaceholder) {
		expect(0);
		return;
	}

	expect(1);

	var $textEle = $('<input type="text" placeholder="I m placeholder"/>').appendTo('#qunit-fixture');
	$textEle.addPlaceholder();

	$textEle.val('some text');
	ok($textEle.prev().hasClass('none'), 'placeholder elem did not hide when handset val');
});


QUnit.test('Show placeholder element when input element is empty', function() {
	if (this.supportPlaceholder) {
		expect(0);
		return;
	}

	expect(1);

	var $textEle = $('<input type="text" placeholder="I m placeholder"/>').appendTo('#qunit-fixture');
	$textEle.addPlaceholder();

	$textEle.val('some text');
	$textEle.val('');
	ok(!$textEle.prev().hasClass('none'), 'placeholder elem did not show when ipt val is empty');	
});



QUnit.module('input.password', {
	beforeEach: function() {
		this.$pwdIpt = $('<input type="password" name="pwd" />').appendTo('#qunit-fixture');

		this.supportTypeChange = false;
		try {
			this.$pwdIpt[0].setAttribute('type', 'text');
			if (this.$pwdIpt[0].type === 'text') {
				this.$pwdIpt[0].type = 'password';
				this.supportTypeChange = true;
			}
		} catch (d) {
			this.supportTypeChange = false;
		}
		this.$pwdIpt.initPassword();
		this.$iptCreated = this.$pwdIpt.next();
	}
});


//辅助input 创建情况，支持修改type不创建，反之创建；
QUnit.test('shouldn\'t create text ipt for support typechange browser', function() {
	if (!this.supportTypeChange) {
		expect(0);
		return;
	}
	
	equal(this.$iptCreated.length, 0, 'create elem for support typechange browser');
});

QUnit.test('Create the text ipt for unsupport typechange browser', function() {
	if (this.supportTypeChange) {
		expect(0);
		return;
	}

	equal(this.$iptCreated.length, 1, 'Didn\'t create elem for unsupport typechange browser');
});

//支持的修改type的浏览器在聚焦输入框的时候换成text ，失去焦点换成password
QUnit.test('Support typechange: Change the type to "text" when focus', function() {
	if (!this.supportTypeChange) {
		expect(0);
		return;
	}
	expect(1);
	stop();

	this.$pwdIpt.focus();

	var $pwdIpt = this.$pwdIpt;
	setTimeout(function() {
		equal($pwdIpt[0].type.toLowerCase(), 'text');
		start();
	}, 100);
});
QUnit.test('Support typechange: Change the type to "text" when blur', function() {
	if (!this.supportTypeChange) {
		expect(0);
		return;
	}
	expect(1);
	stop();

	this.$pwdIpt.focus();
	var $pwdIpt = this.$pwdIpt;
	setTimeout(function() {
		$pwdIpt.blur();
		setTimeout(function() {
			equal($pwdIpt[0].type.toLowerCase(), 'password');
			start();			
		});

	}, 100);
});


//不支持的修改type的浏览器在聚焦输入框的时候隐藏password 输入框显示创建的text输入框， 
//失去焦点的时候显示password输入框， 隐藏创建的input
QUnit.test('Unsupport typechange: Exchange the input elem when focus', function() {
	if (this.supportTypeChange) {
		expect(0); return;
	}

	expect(2);


	var $pwdIpt = this.$pwdIpt;
	var $iptCreated = this.$iptCreated;

	$pwdIpt.focus();

	stop();
	setTimeout(function() {
		ok($pwdIpt.is(':hidden'), 'Pwd ipt did not hide when focus');
		ok($iptCreated.is(':visible'), 'Txt ipt did not show when focus');
		start();
	}, 10);

});

QUnit.test('Unsupport typechange: Exchange the input elem when blur', function() {
	if (this.supportTypeChange) {
		expect(0); return;
	}

	expect(2);

	this.$pwdIpt.focus();

	var $pwdIpt = this.$pwdIpt;
	var $iptCreated = this.$iptCreated;

	$pwdIpt.focus();

	stop();
	setTimeout(function() {
		$iptCreated.blur();
		setTimeout(function() {
			ok($pwdIpt.is(':visible'), 'Pwd ipt did not show when blur');
			ok($iptCreated.is(':hidden'), 'Text ipt did not hide when blur');
			start();
		}, 10);
	},100);
	
});


//如果输入不合法，既有validatebox-invalid class ,永远保持text
QUnit.test('Support typechange: When invalid and blur, then do not change the type to "password"', function() {
	if (!this.supportTypeChange) {
		expect(0); return;
	}
	expect(1);
	stop();

	this.$pwdIpt.focus();
	this.$pwdIpt.addClass('validatebox-invalid');
	this.$pwdIpt.blur();

	var $pwdIpt = this.$pwdIpt;
	setTimeout(function() {
		ok($pwdIpt[0].type === 'text', 'Type change to password when invalid');
		start();
	}, 100);
});

//如果输入不合法，既有validatebox-invalid class ,永远保持text
QUnit.test('Unsupport typechange: When invalid and blur, then do not show the password ipt', function() {
	if (this.supportTypeChange) {
		expect(0); return;
	}

	expect(1);
	this.$pwdIpt.focus();

	stop();

	var $iptCreated = this.$iptCreated,
		$pwdIpt = this.$pwdIpt;
	setTimeout(function() {
		$iptCreated.addClass('validatebox-invalid');
		$iptCreated.blur();

		//console.log($pwdIpt.is(':hidden'));
		ok($pwdIpt.is(':hidden') && $iptCreated.is(':visible'), 'Password ipt showed when invalid');		
		start();
	}, 100);

});

//低版本浏览器password （因为创建了辅助输入框text）取值验证
QUnit.test('Unsupport typechange: get correct value when exchange ipt element', function() {
	if (this.supportTypeChange) {
		expect(0); return;
	}

	stop();
	var $iptCreated = this.$iptCreated,
		$pwdIpt = this.$pwdIpt;

	this.$pwdIpt.val('a');
	this.$pwdIpt.focus();


	setTimeout(function() {
		$iptCreated.val('b');
		$iptCreated.blur();
		setTimeout(function() {
			equal($pwdIpt.val(), 'b', 'value is not correct');
			start();
		}, 100);
	}, 100);
});