QUnit.module('core.getUtf8Length');
QUnit.test('$.getUtf8Length', function() {

	//all eng
	deepEqual($.getUtf8Length('12345abcde'), 10);

	//all chinese 
	deepEqual($.getUtf8Length('一二三四五；，。、？'), 30);

	//eng & chinese
	deepEqual($.getUtf8Length('一二三四五abcde'), 20);
});


/*
QUnit.module('cookie', {
	beforeEach: function() {
		function clearCookie(){ 
			var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
			if (keys) { 
			for (var i = keys.length; i--;) 
			document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() 
			} 
		}
		clearCookie();		
	}
});

QUnit.test('set cookie', function() {

	$.cookie.set('testCookie', 'testCookieValue');
	deepEqual($.cookie.get('testCookie'), 'testCookieValue');
});
*/


QUnit.module('core.Jquert "val" method override', {
	beforeEach: function() {
		var testHTML = '<input type="text" id="inputEle" value="a"/>' + 
					   '<div id="divEle">a</div>';

		$('#qunit-fixture').html(testHTML);			
	},
	afterEach: function() {
		$('#qunit-fixture').html('');
	}
});

//原始方法使用测试
QUnit.test('Init function test', function() {

	equal($('#inputEle').val(), 'a');

	$('#inputEle').val('b');

	equal($('#inputEle').val(), 'b');
});

QUnit.test('Get val', function() {
				
	var divEle = document.getElementById('divEle');
	divEle.val = function(str) {
		if (typeof str === 'undefined') {
			return divEle.innerHTML;//get value
		} else {
			return $(this);
		}
	}

	equal($('#divEle').html(), 'a');
});

QUnit.test('test addValFun function', function() {

	$('#divEle').addValFun(function(str) {
		//console.log(this);
		if (typeof str === 'undefined') {
			return this.innerHTML;
		} else {
			this.innerHTML = str;
			return $(this);
		}
	});

	equal($('#divEle').val(), 'a');
	deepEqual($('#divEle').val('b')[0], $('#divEle')[0]);
	equal($('#divEle').val(), 'b');
});