QUnit.module('select', {
	beforeEach: function() {
		this.$select = $('<span id="toselect" class="validatebox"></span>').appendTo('#qunit-fixture');
		this.$select2 = $('<span id="toselect2" class="validatebox"></span>').appendTo('#qunit-fixture');
		this.$select.toSelect({
			"initVal": 2,
			"units": "Mbps",
			"size": "small",
			".devider": "devider",
			"options": [{
				"0": "无限制",
				"1": "1.0Mbps",
				"2": "2.0Mbps",
				"4": "4.0Mbps",
				".divider": ".divider",
				".hand-set": "手动设置"
			}]
		});
		this.$select2.toSelect({
			"initVal": 2,
			"units": "Mbps",
			"size": "small",
			".devider": "devider",
			"options": [{
				"0": "无限制",
				"1": "1.0Mbps",
				"2": "2.0Mbps",
				"4": "4.0Mbps",
				".divider": ".divider",
				".hand-set": "手动设置"
			}]
		});
		this.selectObj = this.$select.data('re.toselect');
		this.selectObj2 = this.$select2.data('re.toselect');
	}
});

//测试toggle 显示隐藏
QUnit.test('Toggle test: show', function() {
	this.selectObj.toggle();
	ok(this.$select.find('ul').is(':visible'), 'Toggle did not work when trying to show menu');
});

QUnit.test('Toggle test: hide', function() {

	expect(1);
	stop();

	this.selectObj.toggle();
	var selectObj = this.selectObj,
		$select = this.$select;

	setTimeout(function() {
		selectObj.toggle();
		setTimeout(function() {
			ok($select.find('ul').is(':hidden'), 'Toggle did not work when trying to hide menu');
			start();
		}, 300);
	}, 100);
});

QUnit.test('Toggle test: only one menu show at the same time', function() {
	expect(1);
	stop();

	this.selectObj.toggle();
	this.selectObj2.toggle();
	setTimeout(function() {
		equal($('.dropdown-menu:visible').length, 1, 'Make sure only one menu show at the same time');
		start();
	}, 300);
});


//Select Item 

QUnit.test('Select item test: get the correct val', function() {
	var initVal = this.$select.val();

	this.selectObj.selectItem(this.$select.find('[data-val=2]'));
	equal(this.$select.val(), 2);
});

/*QUnit.test('Select item test: focus the input elem when hanset item is selected', function() {
	
	expect(1);
	stop();

	var $select = this.$select;

	this.selectObj.selectItem(this.$select.find('li').last());
	setTimeout(function() {
		ok($select.find('input:text').is(':focus'), 'ipt elem should be focused');
		start();
	}, 200);
});*/


//Set value 
QUnit.test('Set val: test the val just set', function() {
	this.selectObj.setValue(10);

	ok(this.$select.val(), 10, 'Function setValue didn\'t work');
});

QUnit.test('Set val: should add unit to the input elem', function() {
	this.selectObj.setValue(10);

	ok(this.$select.find('input').val(), '10Mpbs', 'Didn\'t add unit');
});

//Disable test 
QUnit.test('Disable: when disable the widget, should not show the menu when click the caret', function() {
	expect(1);
	stop();

	this.$select.disable(true);
	this.$select.find('.btn').click();

	var $select = this.$select;
	setTimeout(function() {
		ok($select.find('.dropdown-menu').is(':hidden'), 'Disable did not work');
		start();
	}, 100);
});

QUnit.test('Disable: user should be able to cancel the disable set', function() {
	expect(1);
	stop();

	this.$select.disable(true);
	this.$select.disable(false);

	this.$select.find('.btn').click();

	var $select = this.$select;
	setTimeout(function() {
		ok($select.find('.dropdown-menu').is(':visible'), 'Should be able to cancel the disable set');
		start();
	}, 100);	
});

