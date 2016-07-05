// 页面核心逻辑

function $ (id) {
    return document.getElementById(id);
}

// 检查cookie,隐藏通知栏，并设置cookie 
function popup() {  
    var oPopup = $('j-display');
    var oBtn = oPopup.getElementsByTagName('p')[1];
    if ( CookieUtil.getCookie('Off')) {
        oPopup.style.display = 'none';
    }
    else{
        oBtn.onclick = function () {
            oPopup.style.display = 'none';
            CookieUtil.setCookie('Off', "true", 36500 );
        }
    }
}
popup();

// 用户登录及导航关注
function login(){    
    var oLogin = $('j-login');
    var oAttention = $('j-input');
    var oPopuplog = getElementsByClassName(oLogin,'popup-login');
    var oClose = getElementsByClassName(oLogin,'close');
    var oInput = oLogin.getElementsByTagName('input');
    var oLabel = oLogin.getElementsByTagName('label');
    var oButton = getElementsByClassName(oLogin,'submit');
    var oCancel = getElementsByClassName(oLogin,'cancel');
	var ofansNum = document.getElementById("fansNum");
	
    function hide(i){ //输入文字，提示文字隐藏
		oInput[i+1].onfocus = function(){
			oLabel[i].style.display = 'none';
		};
		oInput[i+1].onblur = function(){
			if(this.value ===''){
				oLabel[i].style.display = 'block';
			}
		};
	}
	hide(0); //首次登陆显示
	hide(1); //输入信息隐藏提示文字
	
	oClose[0].onclick = function(){ //关闭登录窗口
	    oPopuplog[0].style.display = 'none'; 
	};  
	if( !CookieUtil.getCookie ('loginSuc') ){ //判断登录的 cookie 是否已设置
		oAttention.onclick = function(){ 
			oPopuplog[0].style.display = 'block';
	    };
	}else{
		oAttention.value = '以关注';
		oAttention.disabled = false;
		oAttention.className = 'active f-fl'; // 注意  注意  有待修改
		oCancel[0].style.display = 'block';
	}
		
	oButton[0].onclick = function(){ // 点击登录
		var userName1 = hex_md5(oInput[1].value); // 调用MD5加密userName
		var password1 = hex_md5(oInput[2].value); // 调用MD5加密password
		get('http://study.163.com/webDev/login.htm',{userName:userName1,password:password1},function(data){ 
			if( data === '1' ){
				oPopuplog[0].style.display = 'none';
				CookieUtil.setCookie ('loginSuc', '1', 36500);
				get('http://study.163.com/webDev/attention.htm','', function(data){
					if( data === '1' ){
						CookieUtil.setCookie ('followSuc', '1', 36500);
						oAttention.value = '以关注';
						oAttention.disabled = true;
						oAttention.className = 'active f-fl';
						oCancel[0].style.display = 'block';
						ofansNum.innerHTML = parseInt(ofansNum.innerHTML) + 1; // 设置粉丝数量数据变化
					}				
				})
				
			}else{
				alert( '帐号密码错误，请重新输入')
			}
		 });
	};
	
	oCancel[0].onclick = function(){ // 取消关注
		CookieUtil.setCookie('followSuc','',-1);
		CookieUtil.setCookie('loginSuc','',-1);
		oAttention.value = '关注';
		oAttention.disabled = false;
		oAttention.className = 'attention f-fl f-csp';
		this.style.display = 'none';
		ofansNum.innerHTML = parseInt(ofansNum.innerHTML) - 1;
	};
	
}
login();

// 轮播图
(function(){
	var headerBanner = getElementsByClassName(document,'header-banner')[0];
	var li = headerBanner.getElementsByTagName('li');
	var a = headerBanner.getElementsByTagName('a');
	li[0].style.backgroundColor = "#000";
	for(var i=0,len=li.length;i<len;i++){
		li[i].index = i;
		EventUtil.addHandler(li[i],'click',function(event){
			event = event || window.event;
			clearInterval(changeId);
			for(var j=0;j<a.length;j++){  
				a[j].style.display = "none";
				li[j].style.backgroundColor = "#fff";
			}
			if(event.target!=null){
				a[event.target.index].style.display = "block";
				li[event.target.index].style.backgroundColor = "#000";
				fadeIn(a[event.target.index]);
			}else{
				a[event.srcElement.index].style.display = "block";
				li[event.srcElement.index].style.backgroundColor = "#000";
				fadeIn(a[event.srcElement.index]);
			}
			
		});
	}
	var changeId = setInterval(change,5000);
		function fadeIn(element){
            if(element.style.opacity!==undefined){
                element.style.opacity = 0;
                var intervalID = setInterval(opacityChange,1,element);
            }else{
                element.style.filter = "alpha(opacity=50)";
                var intervalID = setInterval(opacityChange,1);
            }
            function opacityChange(){
                if(element.style.opacity!==undefined){
                    if(element.style.opacity!=1){
                        element.style.opacity = parseFloat(element.style.opacity) + 0.008;
                    }else{
                        clearInterval(intervalID);
                    }
                }else{
                    var text = element.style.filter;
                    var op = text.indexOf('=');
                    var opacity = text.substring(op+1,text.length-1);
                    if(parseFloat(opacity)<100){
                        opacity = parseFloat(opacity) + 0.8;
                        element.style.filter = "alpha(opacity="+opacity+")";
                    }else{
                        clearInterval(intervalID);
                    }
                }
            }
        }
	function change(){
		var now = -1;
		for(var i=0,len=a.length;i<len;i++){
			if(a[i].style.display=="block"){
				if(i==0){
					now = 1;
				}else if(i==1){
					now = 2;
				}else{
					now = 0;
				}
			}
			a[i].style.display = "none";
			li[i].style.backgroundColor = "#fff";
		}
		if(now==-1){
			now=1;
		}
		a[now].style.display = "block";
		fadeIn(a[now]);
		li[now].style.backgroundColor = "#000";
		
	}
	EventUtil.addHandler(headerBanner,'mouseover',function(){
		clearInterval(changeId);
	});
	EventUtil.addHandler(headerBanner,'mouseout',function(){
		changeId = setInterval(change,5000);
	})
})();

// 课程列表
function tab(){   
	var oTab = $('j-tab');
	var aTabhd = getElementsByClassName(oTab,'course-table');
	var aTabbtn = getElementsByClassName(oTab,'btn');
	var aContent = getElementsByClassName(oTab,'course-content');
	var aDesign = getElementsByClassName(oTab,'design');
	var aLanguage = getElementsByClassName(oTab,'language');
	
	
	// 获取服务器数据
	function setData(num,element){
		
	get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:1,psize:20,type:num},function(data){   //设置课程
		var data = JSON.parse(data)
		for( var i=0; i<data.list.length; i++){
			var oTeam = document.createElement('div');
			oTeam.className = 'course-details';
			element.appendChild(oTeam);
			var oImg = document.createElement('img');
			var oP = document.createElement('p');
			var oDiv = document.createElement('div');
			var oSpan = document.createElement('span');
			var oStrong = document.createElement('strong');
			var oA = document.createElement('a');
			oImg.src = data.list[i].middlePhotoUrl;
			oP.className = 'coursename f-toe';
			oP.innerHTML = data.list[i].name;
			oDiv.className = 'provider';
			oDiv.innerHTML = data.list[i].provider;
			oSpan.innerHTML = data.list[i].learnerCount;
			if(!data.list[i].categoryName){
				  data.list[i].categoryName = '无';
			}
			oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h3>' + data.list[i].name + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p><p class="description">' +  data.list[i].description + '</p>';
			if( data.list[i].price == 0){
				oStrong.innerHTML = '免费';
				oStrong.className = 'free';
			}else{
			oStrong.innerHTML = '￥' + data.list[i].price+'.00';
			}
			oTeam.appendChild(oImg);
			oTeam.appendChild(oP);
			oTeam.appendChild(oDiv);
			oTeam.appendChild(oSpan);
			oTeam.appendChild(oStrong);
			oTeam.appendChild(oA);
			
		}
	});
	}
	setData(10,aDesign[0]);
	setData(20,aLanguage[0]);
	
	aTabbtn[0].onclick = function(){
		aDesign[0].style.display = 'block';
		this.className = 'btn active';
		aLanguage[0].style.display = 'none';
		aTabbtn[1].className = 'btn';
		
	};
	aTabbtn[1].onclick = function(){
		aDesign[0].style.display = 'none';
		aTabbtn[0].className = 'btn';
		aLanguage[0].style.display = 'block';
		this.className = 'btn active';
	};
	
	/*
	// 课程列表动态布局  页面动态适应，当窗口宽度小于1205px时，显单页示课程总数为15，实现有瑕疵，需要手动刷新
	// 试过resize事件，发现会不停的加载课程信息，以致浏览器卡顿。
	// 还在学习研究中。
    if( getWindowWidth() <= 1205 ){
	    this.psize = 15 ;
		setData(10,aDesign[0]);
	    setData(20,aLanguage[0]);
	
	    aTabbtn[0].onclick = function(){
			aDesign[0].style.display = 'block';
			this.className = 'btn active';
			aLanguage[0].style.display = 'none';
			aTabbtn[1].className = 'btn';
		
		};
		aTabbtn[1].onclick = function(){
			aDesign[0].style.display = 'none';
			aTabbtn[0].className = 'btn';
			aLanguage[0].style.display = 'block';
			this.className = 'btn active';
		};
	}else{
		setData(10,aDesign[0]);
	    setData(20,aLanguage[0]);
	
	    aTabbtn[0].onclick = function(){
			aDesign[0].style.display = 'block';
			this.className = 'btn active';
			aLanguage[0].style.display = 'none';
			aTabbtn[1].className = 'btn';
		
		};
		aTabbtn[1].onclick = function(){
			aDesign[0].style.display = 'none';
			aTabbtn[0].className = 'btn';
			aLanguage[0].style.display = 'block';
			this.className = 'btn active';
		};
	}
	*/
}
tab();




// 弹出视频播放窗口
function playvideo(){  
	 var oList = $('j-list');
	 var oTrigger = getElementsByClassName(oList, 'trigger');
	 var oPopupvideo = getElementsByClassName(oList, 'popup-video');
	 var oClose = getElementsByClassName(oList, 'close');
	 var myVideo = oList.getElementsByTagName('video')[0];
	 oTrigger[0].onclick = function(){
		 oPopupvideo[0].style.display = 'block';
	 };
	 oClose[0].onclick = function(){
		 oPopupvideo[0].style.display = 'none';
		 myVideo.pause();
	 };
	 
 }
playvideo();

// 设置热门列表数据
function setList(){  
	var oList = $('j-list');	
	var oListwrap = getElementsByClassName(oList, 'wrap2');
	get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
		var arr = JSON.parse(data);
		for( var i=0; i<20; i++){
			var oA = document.createElement('a');
			oA.innerHTML = '<div><img src="' + arr[i].smallPhotoUrl + '" /></div><p>' + arr[i].name + '</p><span>' + arr[i].learnerCount + '</span>';
			oListwrap[0].appendChild(oA);	
		}
	});
}
setList();

// 热门列表滚动
function change(){  
	var oList = $('j-list');	
	var oListwrap = getElementsByClassName(oList, 'wrap2');
	var oListbox = getElementsByClassName(oList, 'course-list');
	var timer;
		function autoplay(){
		timer = setInterval(function(){
			if( oListwrap[0].style.top == '-700px'){
				oListwrap[0].style.top = 0;
			}
			else{
				oListwrap[0].style.top = parseFloat(getStyle(oListwrap[0],'top')) - 70 + 'px';
				}
		},5000);
		}
		autoplay();
	oListbox[0].onmouseover = function(){
		clearInterval( timer );
		};
	oListbox[0].onmouseout = function(){
		autoplay();
		};
}
change();

/*
// 换页功能:给页码添加点击事件,实现有问题，后期继续！！
(function(){
	var oTab = $('j-tab');
	var aContent = getElementsByClassName(oTab,'course-content');
	var aDesign = getElementsByClassName(oTab,'design');
	var aLanguage = getElementsByClassName(oTab,'language');
	var oPageBox = document.getElementById('coursePage');
	var oPageLeft = getElementsByClassName(oPageBox , 'prve');
	var oPageRight = getElementsByClassName(oPageBox , 'next');
	var aPage = oPageBox.getElementsByTagName('a');	
	
	// 获取服务器数据
	function setData(num,element){
		
	get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:1,psize:20,type:num},function(data){   //设置课程
		var data = JSON.parse(data)
		for( var i=0; i<data.list.length; i++){
			var oTeam = document.createElement('div');
			oTeam.className = 'course-details';
			element.appendChild(oTeam);
			var oImg = document.createElement('img');
			var oP = document.createElement('p');
			var oDiv = document.createElement('div');
			var oSpan = document.createElement('span');
			var oStrong = document.createElement('strong');
			var oA = document.createElement('a');
			oImg.src = data.list[i].middlePhotoUrl;
			oP.className = 'coursename f-toe';
			oP.innerHTML = data.list[i].name;
			oDiv.className = 'provider';
			oDiv.innerHTML = data.list[i].provider;
			oSpan.innerHTML = data.list[i].learnerCount;
			if(!data.list[i].categoryName){
				  data.list[i].categoryName = '无';
			}
			oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h3>' + data.list[i].name + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p><p class="description">' +  data.list[i].description + '</p>';
			if( data.list[i].price == 0){
				oStrong.innerHTML = '免费';
				oStrong.className = 'free';
			}else{
			oStrong.innerHTML = '￥' + data.list[i].price+'.00';
			}
			oTeam.appendChild(oImg);
			oTeam.appendChild(oP);
			oTeam.appendChild(oDiv);
			oTeam.appendChild(oSpan);
			oTeam.appendChild(oStrong);
			oTeam.appendChild(oA);
			
		}
	});
	}
	setData(10,aDesign[0]);
	setData(20,aLanguage[0]);
	
	// 点击上一张
	oPageLeft.onclick = function(){
		if(data.pagination.pageIndex>1){
			aPage[data.pagination.pageIndex-1].className = 'page-num';
			data.pagination.pageIndex--;
			aPage[data.pagination.pageIndex-1].className = 'page-num active';
			// 运行ajax函数
			get({
			    url : 'http://study.163.com/webDev/couresByCategory.htm',
			    data : {
			        'pageNo':data.pagination.pageIndex,
			        'psize':20,
			        'type':num
			    },
			    success : function (data) {
			        setData(10,aDesign[0]);
	                setData(20,aLanguage[0]);
			    }
			});
		}
	}
	// 点击下一张
	oPageRight.onclick = function(){
		if(data.pagination.pageIndex<8){
			aPage[data.pagination.pageIndex-1].className = 'page-num';
			data.pagination.pageIndex++;
			aPage[data.pagination.pageIndex-1].className = 'page-num active';
			// 运行ajax函数
			GLOBAL.AJAX({
			    url : 'http://study.163.com/webDev/couresByCategory.htm',
			    data : {
			        'pageNo':data.pagination.pageIndex,
			        'psize':20,
			        'type':num
			    },
			    success : function (data) {
			        setData(10,aDesign[0]);
	                setData(20,aLanguage[0]);
			    }
			});
		}
	}
	// 点击页码
	for(var i = 0; i < aPage.length; i++){
		aPage[i].index = i;
		aPage[i].onclick = function(){
			if((data.pagination.pageIndex-1) != this.index){
				for(var i = 0; i < aPage.length; i++){
					aPage[i].className = 'page-numLk';
				}
				data.pagination.pageIndex = this.index+1;
				this.className = 'page-numLk_active';
				// 运行ajax函数
				GLOBAL.AJAX({
				    url : 'http://study.163.com/webDev/couresByCategory.htm',
				    data : {
				        'pageNo':data.pagination.pageIndex,
			        'psize':20,
			        'type':num
				    },
				    success : function (data) {
				        setData(10,aDesign[0]);
	                    setData(20,aLanguage[0]);
				    }
				});		
			}	
		}
	}
})();
*/