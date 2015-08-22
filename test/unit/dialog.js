QUnit.module('Dialog', {
	beforeEach: function() {

	},
	afterEach: function() {
		/*var childs = document.body.childNodes;
		for (var i = 0; i < childs.length; i++) {
			if (childs[i].nodeType !== 1) continue;
			if (childs[i].className.match('overlay') || childs[i].className.match('dialog')) {
				document.body.removeChild(childs[i]);
				i--
			}
		}*/
		document.body.removeChild($('.dialog')[0]);
		document.body.removeChild($('.overlay')[0]);
	}
});

QUnit.test('Dialog: Show btn area if param applyCallback provided', function() {
	var dialog = $.dialog(),
		apply = false,
		cancel = false;

	dialog.open('Dialog title', 'Dialog content', function() {
		apply = true;
	}, function() {
		cancel = true;
	});

	ok($('#dialog-apply').is(':visible'));

	dialog.apply();
	ok(apply);

	dialog.cancel();
	ok(cancel);

});

QUnit.test('Should not show btn area if  param applyCallback is not provided', function() {
	$.dialog().open('Dialog title', 'Dialog content');

	ok($('#dialog-apply').is(':hidden'));
});

//close
/*QUnit.test('Close', function() {
	expect(1);
	stop();
	$.dialog().open('Dialog title', 'Dialog content');
	$.dialog().close();

	setTimeout(function() {
		ok($('.dialog').is(':hidden'), 'Should hide dialog when colse method is called');
		start();
	}, 500);
});*/