/*!
 * REasy UI Message @VERSION
 * http://reasyui.com
 *
 * Copyright 2015 reasy Foundation and other contributors
 *
 * Depends:
 *	reasy-ui-core.js
 */
 
(function () { "use strict";
    var ajaxMessageSington = null;

    function AjaxMsg(msg) {
        this.$mask = null;
        this.$elem = null;
        this.init(msg);
    }
    
    AjaxMsg.prototype = {
        constructor: AjaxMsg,
        
        init: function (msg) {
            msg = msg || '';
            this.$mask = $('<div class="overlay-white"></div>').hide().appendTo($("body"));
            this.$txtWrap = $('<div class="message-ajax"><div id="ajax-message" class="message-ajax-txt"></div></div>').hide().appendTo($("body"));
            this.$txtElem = this.$txtWrap.find("#ajax-message").html(msg);

            this.$mask.css({"display": "none"});
            this.$txtWrap.css({"display": "none", "opacity": "0"});
        },
        
        show: function () {
            this.$mask.stop().fadeIn(200);
            this.$txtWrap.stop(true).show().animate({"top":"23%", "opacity": "1"},300);
        },
        
        hide: function () {
            var that = this;

            this.$mask.stop().fadeOut(200);
            this.$txtWrap.stop().animate({"top":"20%", "opacity": "0"},300, function() {
                that.$txtWrap.hide();
            });
        },
        
        remove: function () {
            this.$txtWrap.remove();
            this.$mask.remove();
        },
        
        text: function (msg) {
            this.$txtElem.html(msg);
        }
    }
    
    $.ajaxMessage = function (msg) {
        if (!ajaxMessageSington) {
            ajaxMessageSington = new AjaxMsg(msg);      
        }
        ajaxMessageSington.text(msg);
        ajaxMessageSington.show();
        return ajaxMessageSington;
    }
})();