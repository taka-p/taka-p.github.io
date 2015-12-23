define([], function(){

	var Tips = (function(){

		var $tipBox = $(".tips-box");

		return {
			show: function(){
				$tipBox.removeClass("hide");
			},
			hide: function(){
				$tipBox.addClass("hide");
			},
			init: function(){

			}
		}
	})();

	var resetTags = function(){
		var tags = $(".tagcloud a");
		tags.css({"font-size": "12px"});
		for(var i=0,len=tags.length; i<len; i++){
			var num = tags.eq(i).html().length % 5 +1;
			tags[i].className = "";
			tags.eq(i).addClass("color"+num);
		}
	}

	var slide = function(idx){
		var $wrap = $(".switch-wrap");
		$wrap.css({
			"transform": "translate(-"+idx*100+"%, 0 )"
		});
		$(".icon-wrap").addClass("hide");
		$(".icon-wrap").eq(idx).removeClass("hide");
	}

	var bind = function(){
		var switchBtn = $("#myonoffswitch");
		var tagcloud = $(".second-part");
		var navDiv = $(".first-part");
		switchBtn.click(function(){
			if(switchBtn.hasClass("clicked")){
				switchBtn.removeClass("clicked");
				tagcloud.removeClass("turn-left");
				navDiv.removeClass("turn-left");
			}else{
				switchBtn.addClass("clicked");
				tagcloud.addClass("turn-left");
				navDiv.addClass("turn-left");
				resetTags();
			}
		});

		var timeout;
		var isEnterBtn = false;
		var isEnterTips = false;

		$(".icon").bind("mouseenter", function(){
			isEnterBtn = true;
			Tips.show();
		}).bind("mouseleave", function(){
			isEnterBtn = false;
			setTimeout(function(){
				if(!isEnterTips){
					Tips.hide();
				}
			}, 100);
		});

		$(".tips-box").bind("mouseenter", function(){
			isEnterTips = true;
			Tips.show();
		}).bind("mouseleave", function(){
			isEnterTips = false;
			setTimeout(function(){
				if(!isEnterBtn){
					Tips.hide();
				}
			}, 100);
		});

		$(".tips-inner li").bind("click", function(){
			var idx = $(this).index();
			slide(idx);
			Tips.hide();
		});
	}

	var throttleFunc = function(elm) {
		var consts = {
			THROTTLE_TIME: 1000,
			THRESHOLD_SCROLL_BUFFER_RANGE: 100
		};

		var 	elm_position = elm.offset().top;
		var $elm_link_list = elm.find(".toc-link"),
			link_list_num = $elm_link_list.length;

		var href_to_id_maker = function(index) {
			return $elm_link_list[index].href.match("[\#;].*")[0];
		}

		var id_pos_arr = [];
		for (var i=0; i<link_list_num; i++) {
			id_pos_arr.push($(href_to_id_maker(i)).offset().top);
		}

		var checkThrottleScroll = function() {
			$(window).on('scroll', function() {
				var window_pos = $(this).scrollTop();

				if (window_pos > elm_position) {
					elm.addClass("is-fixed");
				} else {
					elm.removeClass("is-fixed");
				}

				for (var i=0; i<link_list_num; i++) {
					if (window_pos > id_pos_arr[i] - consts.THRESHOLD_SCROLL_BUFFER_RANGE) {
						$elm_link_list.removeClass("active");
						$elm_link_list.eq(i).addClass("active");
					}
				}
			});
		}
		setInterval(checkThrottleScroll, consts.THROTTLE_TIME);
	}

	var toc_left_fixed = function() {
		if (document.getElementById("js_toc_left") !== null) {
			var $elm = $("#js_toc_left");
			throttleFunc($elm);
		}
	}

	var elmDisplayChange = function(elm) {
		var consts = {
			THROTTLE_TIME: 800,
			THRESHOLD_SCROLL_RANGE: 1000
		};

		var changeDisplay = function() {
			$(window).on('scroll', function() {
				var window_pos = $(this).scrollTop();

				if (window_pos > consts.THRESHOLD_SCROLL_RANGE) {
					elm.addClass("is-show");
				} else {
					elm.removeClass("is-show");
				}
			});
		}

		setInterval(changeDisplay, consts.THROTTLE_TIME);
	}

	var back_to_top_func = function() {
		if (document.getElementById("js_back_to_top") !== null) {
			var consts = {
				ANIMATION_DELAY: 250
			};
			var $back_to_elm = $("#js_back_to_top"),
				$anime_elms = $("body, html");

			elmDisplayChange($back_to_elm);

			$back_to_elm.on('click', function() {
				$anime_elms.animate({ scrollTop: 0 }, consts.ANIMATION_DELAY, 'swing');
			});
		}
	}

	return {
		init: function(){
			resetTags();
			bind();
			Tips.init();
			toc_left_fixed();
			back_to_top_func();
		}
	}
});