var show = document.querySelector(".show");

/* 返回翻译内容 */
function getR(res){
	show.innerHTML = res.trans_result[0].dst;
}

(function(){
	
	/* 最新的原生js选择器 兼容IE8 */
	var text = document.querySelector('#text');
	var translate = document.querySelector('span.translate');
	var empty = document.querySelector('span.empty'); 
	
	var lan='zh';	/* 翻译语言 */
	var str;	/* 输入文本 */
	var timer = null; /* 定时器*/
	
	translate.onclick =  trans;		/* 点击翻译事件 */
	empty.onclick = emptyText;	/* 清空内容 */

	/* 按键事件 */
	text.onkeydown = function(){
		clearInterval( timer );
		timer = setTimeout ( function() {
			trans();
		},500);
	}

	choose();
	
	/* 选择语言 */
	function choose() {
		var $lan = $('.language');
		var $lans = $('.languages ul li');

		$lan.click(function(){
			$('.languages').slideToggle(600);
		});
		$lans.click(function(){
			lan = $(this).data('ln');
			$lan[0].children[0].innerHTML = $(this).text();
			trans(lan);
		});
	}

	/* 输入内容处理 */
	function trans(lanx){
		if ( text.value && text.value.length ){
			 /* 正则匹配非法字符 */
			var pat = /[^a-zA-Z0-9\_\s*\u4e00-\u9fa5]/g;
			var strText = text.value;
			if ( pat.test(strText) === true ){
				str = strText.replace(pat,''); 
			}else{
				str = text.value;
			}
			var to = lanx ? lanx : lan;
			var appid = '2015063000000001';
			var key	= '12345678';
			var query = str;
			var salt = Date.now();
			var str1 = appid + query + salt + key;
			var sign = MD5(str1);
			var from = 'auto';
			jsonP({
				url : 'http://api.fanyi.baidu.com/api/trans/vip/translate',
				method: 'GET',
				dataType : 'JSONP',
				data: {
					q: query,
					appid : appid,
					salt : salt,
					from : from,
					to : to,
					sign : sign
				}
			});
		}
	}

	/* 生成jsonp */
	function jsonP(opt) {
		opt = opt || {};
		opt.method = opt.method || 'post';
		opt.url = opt.url || '';
		opt.data = opt.data || null;
		opt.dataType = opt.dataType || 'JSONP';
		var params = [];
		for ( var key in opt.data ) {
			params.push(key + '=' + opt.data[key] );
		}
		var postData = params.join("&");
		if ( opt.dataType == 'JSONP'){
			creatScript(opt.url, postData);
		}
	}

	/* 调用百度翻译 */
	function creatScript(url,data){
		var oScript = document.createElement('script');
		oScript.src = url + '?' + data + '&callback=getR';
		document.body.appendChild(oScript);
	}

	/* 清空 */
	function emptyText(){
		if ( text.value && text.value.length ){
			text.value = '';
			show.innerHTML = '';
		}
	}

})();