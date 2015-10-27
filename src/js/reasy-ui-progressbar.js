/*!
 * REasy UI progressbar @VERSION
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function () {"use strict";

var progressBarSington = null,
	overlayMaskHTML = '<div class="overlay"></div>',
	progressBoxHTML = '<div class="loading-wrap">' +
							'<span class="loading-percent"></span>' + 
							'<div class="loading-bar-wrap">' + 
								'<div class="loading-bar"></div>' +
							'</div>' +
							'<p class="loading-des"></p>' +
						'</div>';

function ProgressBar() {
	this.handRunTime = 500;//手动设置用500毫秒跳到指定百分比
	this.runT = 0;//自动跑
	this.percent = 0;
	this.tasks = [];
	this.task = null;

	this.$mask = null;
	this.$msg = null;
	this.$percent = null;
	this.$bar = null;
}

ProgressBar.prototype.create = function() {
	var $progressBox = $(progressBoxHTML).appendTo($("body"));

	if ($(".overlay").length === 0) {
		this.$mask = $(overlayMaskHTML).appendTo($("body"));
	} else {
		this.$mask = $(".overlay");
	}

	this.$msg = $progressBox.find(".loading-des");
	this.$percent = $progressBox.find(".loading-percent");
	this.$bar = $progressBox.find(".loading-bar");
}

ProgressBar.prototype.run = function(task) {
	if (this.task) {
		this.tasks.push(task);
	} else {
		if (!this.$msg) {
			this.create();
		}
		this.percent = 0;
		this.task = task;
		this.autoRun();
	}
	return this;
}

//根据设置的任务时间自动跑进度条
ProgressBar.prototype.autoRun = function() {
	if (!this.task || !this.task.time) return;

	var basicSpeed = 100/(this.task.time/30),
		speed = 0,
		that = this;

	this.setMessage(this.task.msg);
	clearInterval(this.runT);
	this.percent = parseInt(this.percent, 10);
	this.runT = setInterval(function() {
		if (that.percent < 30) {
			speed = basicSpeed * 0.6;
		} else if (that.percent < 70) {
			speed = basicSpeed;
		} else {
			speed = basicSpeed/0.6;
		}
		that.percent += basicSpeed;
		that.setPercent(that.percent);
	}, 30);
}

//设置提示信息
ProgressBar.prototype.setMessage = function(msg) {
	this.$msg.html(msg);
}


//通过外部API调用设置百分比，用于不确定的，需根据实时情况设置进度的时候。
ProgressBar.prototype.handSetPercent = function(percent, msg, callback) {
	if (!this.task) return;

	var speed = (percent - this.percent)/(this.handRunTime/30),
		great = (percent > this.percent),
		that = this;

	this.setMessage(msg);
	clearInterval(this.runT);
	this.percent = parseInt(this.percent, 10);
	this.runT = setInterval(function() {
		that.percent += speed;
		if ((great && percent < that.percent) || (!great && percent > that.percent)) {
			if (typeof callback === "function") {
				callback();
			}
			clearInterval(that.runT);
			that.percent = percent;
			that.autoRun();
		}
		that.setPercent(that.percent);
	}, 30);
}


//设置百分比, 当百分比到达 100时会触发下一个进度条任务（如果还有）
ProgressBar.prototype.setPercent = function(percent) {
	var that = this;

	this.percent = percent;
	if (this.percent >= 100) {
		this.percent = 100;
		clearInterval(this.runT);

		if (typeof this.task.callback === "function") {
			this.task.callback();
		}

		this.task = null;

		if (this.tasks.length > 0) {
			this.run(this.tasks.shift());
		} else {
			setTimeout(function() {that.distroy();}, 2000);
		}
	}
	this.$percent.html(parseInt(this.percent, 10) + "%");
	this.$bar.css({"width": this.percent + "%"});
}

ProgressBar.prototype.distroy = function() {
	$(".overlay").remove();
	$(".loading-wrap").remove();
	this.$msg = null;
	this.$mask = null;
	this.$percent = null;
	this.$bar = null;
	this.task = null;
	this.tasks = [];
	this.percent = 0;
	clearInterval(this.runT);
}

$.progressBar = function() {
	if (!progressBarSington) {
		var progressBar = new ProgressBar();

		progressBarSington = {};
		progressBarSington.run = function(time, msg, callback) {
			progressBar.run({"time": time, "msg": msg, "callback": callback});
			return progressBarSington;
		}
		progressBarSington.set = function(percent, msg, callback) {
			progressBar.handSetPercent(percent, msg, callback);
			return progressBarSington;
		}
		progressBarSington.distroy = function() {
			progressBar.distroy();
			return progressBarSington;
		}
		progressBarSington.getTaskNum = function() {
			return progressBar.tasks.length;
		}
	}
	return progressBarSington;
}

})();