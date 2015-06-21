# Reasy-UI.js 中文文档 
---

## 基本工具
基本工具是直接对jquery自身（既$）的扩展，并不是jquery对象插件

### 键盘码常量扩展 

    ALT: 18,
	BACKSPACE: 8,
    CAPS_LOCK: 20,
    COMMA: 188,
    COMMAND: 91,
    COMMAND_LEFT: 91, // COMMAND
    COMMAND_RIGHT: 93,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    INSERT: 45,
    LEFT: 37,
    MENU: 93, // COMMAND_RIGHT
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    WINDOWS: 91 // COMMAND
这些常量被直接添加到$（既jquery）上，如：`$.ALT`。


### 获取视口大小(不包含滚动条)
获取宽度

	$.viewportWidth();

获取高度

	$.viewportHeigh();

注：jquery已经有方法获取视口大小了，$(window).height()/$(window).width()。将来考虑废弃
### 输入框中光标位置

**获取**

	$.getCursorPos(ctrl);

参数：

- ctrl: 输入框元素

返回值：光标在输入框中的位置，范围：0 ~ 输入框.value.length

**设置**

	$.setCursorPos(ctrl, pos);

参数：

- ctrl: 输入框元素
- pos: 你要设置的光标位置

...

### 获取UTF-8字符串长度
	$.getUtf8Length(str);
### cookie操作
**获取**

	$.cookie.get(name);
参数：

- name： cookie字段名字

返回值：若cookie中有该字段的值，则返回该值，否则返回null

**设置：**

	$.cookie.set(name, value, path, domain, expires, secure);

参数：

- name: cookie字段名字
- value: cookie字段的值
- path: 指定Cookie适用的路径
- domain: 设置cookie中Cookie适用的域名
- expires: 过期时间（date对象）
- secure: 指出浏览器使用的安全协议，例如HTTPS或SSL

删除：
	$.cookie.unset(name, path, domain, secure)

参数：那啥...看上面或脑补


### jquery原生val方法重写

1.0.3的一些控件（如自定义下拉框，IP/MAC输入框）的取值赋值因为生成控件的包裹元素不是表单元素，所以你只能这样用：
	
	$("#控件ID")[0].val([value]);

实在蛋疼不已...

	
1.0.5 版本的reasy结束了这个苦逼的用法，现在，不论是普通表单元素，还是reasy控件，都支持jquery的val，下面这样使用，是正常冇问题的！

	$("#控件ID").val([value]);

所以，全都大胆的用jquery的val吧，骚年！

...

## UI相关
### 缩略提示

reasyUI自动收集带有title属性的元素，当鼠标悬浮在它们上面时，使用美化过的悬浮框显示title里的内容。

	<div id="tip" title="你好 我只是一个没原则的提示，一个欠揍的提示">你好 我只是一个...</div>

不过，reasyUI只会在页面加载完成之后对带有title属性的元素美化，而之后动态添加的元素则要使用插件方法addTip。

	$('<div title="我是页面加载完成之后动态添加的元素">我是动态</div>').appendTo("body").addTip();





### 网页弹窗（对话框or警告信息）插件

这是自定义的弹窗，虽然浏览器可以使用alert、confirm实现，但是我们有自己统一风格的弹窗插件

使用：

	$.dialog(options);

参数options字段说明：

- show: true, //初始化之后是否显示
- showNoprompt: false, //显示不再提示勾选框
- model: 'dialog', //对话框：dialog，警告框：dialog
- title: '来自网页的消息', //对话框标题
- content: '', //对话框内容
- apply: null, //点击确定时的回调
- cancel: null //点击取消时的回调

...

`$.dialog(options);` 返回一个Dialog对象，该对象支持的方法：

- close 关闭弹窗
- open 打开弹窗

...

### ajax提示信息

ajax提示信息只用应用于数据保存的提示

	$.ajaxMassage(msg);

参数：

- 这么简单就不解释了

`$.ajaxMassage(msg)` 返回一个AjaxMsg对象，该对象支持的方法：

- show 显示ajax提示信息
- hide 隐藏ajax提示信息
- text(msg) 替换提示语

...

### 进度条

当用户执行了一个比较耗时的操作时，为了让等待过程不那么呆板，嗯，我们要来一条进度条。

	var progressBarObj = $.progressBar()

该方法返回一个进度条对象，该对象拥有以下可供使用的方法

run

指定一个进度条任务，提供时间，提示语，以及跑到进度条跑到100%时的回调（可选）
该方法返回进度条对象本身，你可以继续使用run指定进度条任务，让进度条对象，跑完一个接着跑下一个进度条，没有个数限制，只要你喜欢。
最后一个进度条任务跑到100% 后，进度条对象会自动调用自己的destroy方法

	progressBarObj.run(time, msg, [callback]);//跑一条进度条

	progressBarObj.run("40000", "正在升级").run(30000, "正在重启")；//跑完一条接着跑下一条。
	


set

有的时候，你可能想手动控制进度条进度，那样你在调用run指定进度条任务时要将time参数设置为0；然后在使用set方法指定你想要的进度。
如果run指定的任务时间不设置为0，在到达手动设置的百分比之后，进度条会按照原来设定的速度继续跑完。
	
	set(percent, msg, [callback]);//如提供了callback，到达你设置的进度百分比是会被调用

	progressBarObj.run(0, "不确定进度条").set(50, "正在向50%跑...", function() {alert("跑到50%了")});
	
distroy

run方法提到跑完所有进度条任务，会调用此方法。这个方法就是销毁进度条元素，只要你喜欢，跑在任何时候你都可以销毁，不一定要等跑完。

...

## 表单相关
该部分是对input(text/password)输入框的扩展和一些兼容工作

### placeholder兼容插件(保证所有浏览器正常显示placeholder)

低级浏览器 ie9以下不支持placeholder属性，reasy使它们可以正常显示

使用：给需要添加placeholder的元素直接添加placeholder属性即可

	<input type="text" id="placeholderIpt" placeholder="some placeholder here">

亦或者你可以使用js代码给输入框添加placeholder

	$("#placeholderIpt").addPlaceholder("some placeholder here");


### 聚焦时可见的密码输入框

针对 `type="password"` 密码框的扩展，鼠标聚焦时显示明文，失去焦点显示暗文

使用：给密码输入框添加 `data-role="visiblepassword"` 属性，输入框就自动拥有该技能

	<input type="password" id="passwordIpt" data-role="visiblepassword">

亦或者你可以使用js代码让它拥有该技能

	$("#passwordIpt").initPassword();
	 
### 同时拥有聚焦可见、placeholder两项技能的输入框

	<input type="password" id="passwordIpt" data-role="visiblepassword"  placeholder="some placeholder here">

同样可以使用js

	$("#passwordIpt").initPassword("some placeholder here");


### 大写检查
	
给输入框添加大写检查
	
	$("input").addCapTip(callback);

参数：


- callback：输入框keyup事件回调函数，该函数接受一个boolean类型参数，键盘刚刚输入的内容为大写的时候传入true，否则传入false。

...
 



### IP/MAC地址输入框

路由器软件界面必然会遇到输入IP，MAC地址的情况，reasyUI提供了专门输入这种分段式的输入框插件

	$(wrapElem).toTextbox(type);

说明：

- wrapEle：伟大的包裹元素，也就是你想要生成输入框的地方，一般用span

参数：

- type： 生成的类型 type类型现在支持的有：“ip”，“ip-mini”，“mac”

一些用法：
	
	$(wrapElem).toTtextbox(type).val([val]);//赋取值
	...
	$(wrapElem).toTtextbox(type).disable();//置灰



...

### 可自定义输入的下拉选框

这是一个既可以当作select框，又支持手动输入的控件

	$(wrapEle).toSelect(options);

说明：

- 要生成此空间，和生成IP/MAC输入框一样，需要提供一个包裹元素，一般用span即可

参数：

- options: 此参数是一个配置对象，提供一些生成下拉框的参数，各个字段以及其含如下

<pre>
<code>
    {
        "initVal": "",//初始值
        "size": "",//尺寸
        "units": "",//单位，手动输入之后显示会自动添加上单位
        "options" : [{这是下拉选项对象}]
    }
</code>
</pre>

**对于那个下拉选项对象这里还要说明以下：**

使用范例

	$("#toselect").toSelect({
		"initVal": 0,
		"units": "Mbps",
		"size": "small",
		"options": [{
			"0": "无限制",
			"1": "1.0Mbps",
			"2": "2.0Mbps",
			"4": "4.0Mbps",
			".divider": ".divider",
			".hand-set":"手动设置"
		}]
	})

你需要以对象字面量的形式提供你需要的下拉项，key是该选项的真实的值，既使用 ` $(wrapEle).val();` 获取到的值将是key，就相当于option标签里的value一样，而右边的值就相当与option标签里面要显示出来的东西。

嗯，就是这样！

如果你的下拉选框需要一条分界线，那你可以使用 `.devider: .devider` 生成一条分界线。

.hand-set这一项比较重要，这一个值对决定了你生成的下拉选框是否具有手动输入功能。当然，如果只是想把该控件当成美化的select来用的话，机智的你可以不用设置这一项，不设置这一项的下拉选框则不具有自定义输入的功能。

...

**置灰disable**
自定义下拉选框可以置灰，但是不是直接给元素添加disabled属性，reasy定义的disable方法：
	
	$("#toselect").disable(disabled);

参数disabled为true时表示置灰控件，false是取消置灰。

...

## 验证相关

### 使一个输入元素或控件具备验证功能

使一个输入元素具备验证功能很简单，只需要给它添加一个类validatebox，和一些验证规则，

	<input type="text" name="ipAddr" id="ipAddr" class="validatebox" required data-options='{"type": "ip"}'>

这样上面这个输入框就可以验证ip地址的输入了。 required规定该输入框不能为空，data-options规定了具体的输入要求

data-options还可以是一个数组

	<input type="text" class="validatebox" data-options='[{"type": "len", "args": [3, 8]},{"type": "num"}]'>

上面这个输入框要求输入必须是数字并且字串长度必须是3到8之间，比如你要用户输入一个3到8位的数字组成的密码时，你就可以这么做

我们不仅仅可以给正常的输入框添加验证，对于上面出现的一些reasyUI输入控件也同样有效：

	<span id="toselect" class="validatebox" required data-options='{"type": "num"}'></span>
	<span id="mac" class="validatebox" data-options='{"type": "mac"}'></span>
	...
	$("#toselect").toSelect({
		"initVal": 7,
		"units": "Mbps",
		"size": "small",
		".devider": "devider",
		"options": [{
			"0": "无限制",
			"1": "1.0Mbps",
			"2": "2.0Mbps",
			"4": "4.0Mbps",
			".divider": ".divider"
		}]
	})；

	$("#mac").toTextboxs("mac");

上面的可自定义输入的下拉选框，和分栏mac地址输入框也同样会验证用户输入。

...

em~ 没错，你也许会觉得把验证规则对象写进data-options属性里很容易写错，特别是字符转义之类的....

所以reasyUI允许你在代码里为元素添加验证：

	<input type="text" name="ipAddr" id="ipAddr" class="validatebox">
	...
	$("#ipAddr").addCheck({
		"type": "ip"
	});
	
给输入元素指定规则之后，一般验证会在元素获得焦点，键入，失去焦点的时候发生，并且会在验证出错的时候用悬浮框的形式给予提示。

如果你想通过代码触发元素的验证也可以：
	
	$("#ipAddr").check();

该方法在验证通过的时候返回true，失败时返回false。

...

验证规则对象分为两种

一种是验证自身的规则

	{"type": "num", "args": [1,2000], "msg": "balabala.."}

验证自身的规则可以设置四个字段

- type 说明此输入框需要应用的验证类型，reasy提供了一系列验证类型（数字，ip，mac，密码...），类型可以自己扩展，嗯，先这样，后面有详尽介绍。

- args 是验证需要的附加参数，类型是数组（有的验证需要提供参数）

- msg（可选） 自定义出错时的提示语

- correctType（可选） 自动矫正类型（具体类型参照自动矫正章节），一般无需指定，reasy会根据验证类型自动应用纠正


第二种是用于关联验证，既元素的输入合法性和其他输入元素相关


	{"combineType": "equal", "relativeElems": ["self","#newPwd"], "msg": "两次密码输入不一致"}
	...
	例：
	<input type="text" id="newPwd" class="validatebox">新密码 #newPwd</div>
	<input type="text" id="confirmPwd" class="validatebox" data-options='{"combineType": "equal", "relativeElems": ["self","#newPwd"], "msg": "两次密码输入不一致"}'>

关联验证的规则可以设置三个字段

- combineType 说明此输入框需要应用的关联验证类型，reasy目前提供了（必须相等，不能相等，静态IP设置），类型可以自己扩展，后面有详尽介绍。

- relativeElems 关联验证需要的元素，“self” 代表本元素，这些元素的值将会按顺序传入关联验证函数中，自定义关联函数需注意

- msg（可选） 关联验证不通过时的错误提示，如 “新密码和确认密码不一致”


### 验证页面或某个区域

嗯，验证一个元素是没有什么意义的，我们在提交数据的时候，需要验证涉及到的所有输入元素，在通过验证之后再组织数据提交。通常是验证一个form或者整个页面的元素。
这时候我们需要用到reasyUI的validate。

	validateObj1 = $.validate({
		wrapElem: "#form",//指定一个范围

		custom: function() {
			//在各个输入元素通过验证之后，规定一些自定义的验证，如出错需提供错误信息返回值
			alert("每个元素都验证通过了");

			if (自定义验证不通过) {
				return 错误信息；
			}			
		},
		success: function() {
			//各个输入元素的验证通过，并且自定义custom函数也通过，即通过验证
			alert("验证通过啦")；
		},
		error: function(msg) {
			//自定义custom函数验证不通过会调用error函数并将错误信息作为参数传入
			alert("自定义custom的验证不通过，custom的错误信息是：" + msg);
		}
	});

	validateObj.checkAll();

$.validate() 返回一个validate对象，用于验证指定范围里面元素的验证。它只会验证指定范围里面的输入元素，如果没有指定范围，则它会验证整个页面的输入元素，你可以实例出多个不同的validate对象来负责验证不用区域。custom和error是可选的参数，当你需要额外的一些自定义验证时才要用到它们。
checkAll就是执行验证。

validate对象的其他方法：
- addElems(elems); 用于添加范围没有指定到的元素
- check(); 同步的验证，验证通过返回true，失败返回false

...


### 目前reasyUI支持的验类型证有（既data-options的type）：

**len**

字符串长度限定

	data-options='{"type": "len", "args": [3, 8]}'
	
参数：

- 第一个参数规定长度下限
- 第二个参数规定长度上限

**num**

数字验证（整数）

	data-options='{"type": "num", "args": [1,2000]}'

参数：

- 第一个参数规定数字下限
- 第二个参数规定数字上限
	
**mac**

MAC地址验证

	data-options='{"type": "mac"}'

**ip**

IP地址验证
	
	data-options='{"type": "ip"}'

**mask**

子网掩码验证
	
	data-options='{"type": "mask"}'

**email**

邮箱验证

	data-options='{"type": "email"}'

**hex**

HEX字符验证
	
	data-options='{"type": "hex"}'

**ascii**

ascii码验证
	
	data-options='{"type": "ascii", "args": [1,32]}'

参数：

- 第一个参数规定长度下限
- 第二个参数规定长度上限

**remarkTxt**

指定敏感字符验证

	data-options='{"type": "ascii", "args": ["%^&*()_"]}'//不能输入%^&*()_

参数：

- 第一个参数为指定的不能输入的字符合集 
	
**byteLen**

字节长度验证

	data-options='[{"type": "byteLen", "args": [0, 8]}]'

参数：

- 第一个参数规定字节长度下限
- 第二个参数规定字节长度上限



### 关联验证类型 combineType

**equal**

规定两个元素必须相等

	<input type="text" id="newPwd" class="validatebox">
	<input type="text" id="confirmPwd" class="validatebox" 
	data-options='{"combineType": "equal", "relativeElems": ["self","#newPwd"], "msg": "两次密码输入不一致"}'>

关联验证函数equal的定义

	equal: function (str1, str2, msg) {
		if (str1 != str2) {
			return msg;
		}
	}

**notequal**

规定两个元素不能相等

**static**

静态ip关联验证，以这个为例子说明关联验证函数的写法

	<input type="text" id="ip" class="validatebox" data-options='[{"type": "ip"}, {"combineType": "static", "relativeElems": ["self", "#gateway", "#mask"], "msg": ""}]'>
	<input type="text" id="mask" class="validatebox"  data-options='{"type": "mask"}'>
	<input type="text" id="gateway" class="validatebox" data-options='[{"type": "ip"}, {"combineType": "static", "relativeElems": ["#ip", "self", "#mask"], "msg": ""}]'>

其关联验证函数定义如下

	//ip mask gateway 组合验证
	$.combineValid.static = function(ip, mask, gateway, msg) {
		if (ip == gateway) {
			return "ip 不能和gateway 一样";
		}

		if (!isSameNet(ip, gateway, mask, mask)) {
			return "ip 和 gatew 必须在同一网段";
		}
	}

其实只要注意每个元素验证信息对象（data-options） 的relativeElems数组的元素顺序和关联函数参数顺序就很清楚了。字符串self代表当前元素，然后按照关联验证函数参数规定的顺序排列提供relativeElems，reasyUI执行该关联验证的时候就会将relativeElems中的元素的值传入关联验证函数做验证。

关联验证的错误信息直接由关联验证函数的返回值决定，好比static关联验证函数的错误都是明确的，返回什么都已经在函数里面规定了。equal是不确定的，需要提供msg，在出错的时候之间返回该msg

...


### 自动纠错插件

自动纠错可以自动删除用户输入的非法字符。

	$(elem).inputCorrect(type); 

	//或直接在data-options添加correctType字段
	<input type="text" data-options='{"correctType": "float"}'>
	
页面加载后reasyUI自动对拥有data-options属性的元素尝试赋予自动纠错技能，优先查找其correctType，如果没有该字段，则应用type字段。

目前支持的纠错类型有：

- ip： ip地址
- mac： mac地址
- num： 正数
- float： 小数



...

  




----
##文档更新日志
2015年5月31日  完成初版 --周志创
