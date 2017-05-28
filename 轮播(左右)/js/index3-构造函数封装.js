

function Banner(id,url,interval) {
    // this.default = {
    //     id:'banner',
    //     interval:2000,
    // }
    this.id =id;
    this.url = url;
    this.interval = interval||2000;
    this.banner = document.getElementById(this.id);

    this.inner = this.banner.getElementsByTagName('div')[0];
    this.focus = this.banner.getElementsByTagName('ul')[0];

    this.aDiv = this.inner.getElementsByTagName('div');
    this.imgs = this.inner.getElementsByTagName('img');
    this.lis = this.focus.getElementsByTagName('li');

    this.left = this.banner.getElementsByTagName('a')[0];
    this.right = this.banner.getElementsByTagName('a')[1];

    this.data=null;
    this.timer = null;
    this.step = 0;
    this.bok = true;
    // this.init()
};

/*Banner.prototype ={
    constructor:Banner,
    init:function (opt){
        //用户传了按用户传的来，用户没有传按默认的值来
        // for (var key in opt) {
        //     this.default[key] = opt[key];
        // }
        //init是一个初始化函数，将里面所有的思想和方法顺序调用
        //1. 获取数据
        this.getData();
        console.log(this.data);
        //2. 绑定数据
        this.bindData()
        //3. 延迟加载
        this.delayImg()
        // this.delayImg()
        //4. 图片自动轮播
        //5. 焦点自动轮播
        //6. 鼠标移入隐藏，移出继续
        //7，左右按钮点击轮播
        //8. 点击焦点左右切换
    },
    getData:function (){
        var _this = this
        //1. 创建元素
        var xhr = new XMLHttpRequest();
        //2. 打开地址
        xhr.open('get',this.url+'?_='+Math.random(),false);
        //3. 响应请求
        xhr.onreadystatechange =function (){
            if(xhr.readyState==4&&xhr.status==200){
                _this.data = public.toJsonObj(xhr.responseText)
            }
        };
        //4. 发送请求
        xhr.send(null);
    },
    bindData:function (){
            var str1=``,str2=``;
            for (var i=0;i<this.data.length;i++) {
                str1+=`<div><img src=""  realImg="${this.data[i].src}" alt=""></div>`;
                str2+=i===0?`<li class="selected"></li>`:`<li></li>`
            };
            str1+=`<div><img src=""  realImg="${this.data[0].src}" alt=""></div>`;
            // public.css(this.inner,{width:this.divs[0].clientWidth*thia.data.length})
            this.inner.style.width = this.divs[0].style.width*this.data.length;
            this.inner.innerHTML = str1;
            this.focus.innerHTML = str2;
    },
    delayImg:function (){
        for (var i=0;i<this.imgs.length;i++) {
            var _this = this
            var cur =imgs[i];
            var temImg = new Image;
            temImg.src = imgs[i].getAttribute('realImg');
            temImg.index = i;
            temImg.onload =function (){
                _this.imgs[this.index]= this.src
            }

        }

    }
}*/

Banner.prototype.getData =function (){
    var _this = this
    //1. 创建元素
    var xhr = new XMLHttpRequest();
    //2. 打开地址
    xhr.open('get',this.url,false);
    //3. 响应请求
    xhr.onreadystatechange =function (){
        if(xhr.readyState==4&&xhr.status==200){
            _this.data = public.toJsonObj(xhr.responseText)
        }
    };
    //4. 发送请求
    xhr.send(null);
}

Banner.prototype.bindData =function (){
    var str1=``,str2=``;
    for (var i=0;i<this.data.length;i++) {
        str1+=`<div><img src=""  realImg="${this.data[i].src}" alt=""></div>`;
        str2+=i===0?`<li class="selected"></li>`:`<li></li>`
    };
    str1+=`<div><img src=""  realImg="${this.data[0].src}" alt=""></div>`;
    this.inner.innerHTML = str1;
    this.focus.innerHTML = str2;
    this.inner.style.width = this.aDiv[0].offsetWidth*(this.data.length+1)+'px';
}

Banner.prototype.delayImg =function (){
        var _this = this
    for (var i=0;i<this.imgs.length;i++) {
        var cur = this.imgs[i];
        var temImg = new Image;
        temImg.src = cur.getAttribute('realImg');
        temImg.index = i;
        temImg.onload = function () {
            _this.imgs[this.index].src = this.src
            animation( _this.imgs[this.index],{opacity:1},1000)
        }
    }
}

Banner.prototype.move=function (){
    var _this = this
    if(this.step==this.data.length){
        this.step=0;
        public.css(this.inner,{left:-this.step*this.aDiv[0].offsetWidth})
    }
    this.step++;
    animation(this.inner,{left:-this.step*this.aDiv[0].offsetWidth},1000,function (){
        _this.bok=true
    });
    this.focusList();
}

Banner.prototype.focusList=function (){
    for (var i=0;i<this.lis.length;i++) {
        // this.lis[0].className= this.step==this.data.length?'selected':null;
        this.step==this.data.length?this.lis[0].className= 'selected':null;
        this.lis[i].className=this.step==i?'selected':'';
    }

}

Banner.prototype.mouseEvent =function (){
    var _this = this
    this.banner.onmouseover=function () {
        window.clearInterval(_this.timer);
        _this.left.style.display = 'block';
        _this.right.style.display  = 'block';
    }
    this.banner.onmouseout= function (){
        _this.timer = window.setInterval(function (){
            _this.move()
        },_this.interval);
        _this.left.style.display = 'none';
        _this.right.style.display  = 'none';
    }
}

Banner.prototype.click =function (){
    var _this = this
    this.right.onclick =function (){
        if(_this.bok){
            console.log(1);
            _this.bok=false;
            _this.move()
        }

    };

    this.left.onclick =function (){
        if(_this.bok){
            _this.bok=false
            if(_this.step==0){
                _this.step=_this.data.length;
                public.css(_this.inner,{left:-_this.step*_this.aDiv[0].offsetWidth})
            }
            _this.step--;
            animation(_this.inner,{left:-_this.step*_this.aDiv[0].offsetWidth},1000,function (){
                _this.bok=true;
            });
            _this.focusList()
        }
    }
}
Banner.prototype.focusClick =function (){
    var _this =this;
    for (var i=0;i<this.lis.length;i++) {
            this.lis[i].index = i;
            this.lis[i].onclick =function (){
                if(_this.bok){
                    _this.bok=false;
                    _this.step = this.index;
                    console.log(_this.step);
                    _this.focusList();
                    animation(_this.inner,{left:-_this.step*_this.aDiv[0].offsetWidth},1000);
                }
            }
    }
}

Banner.prototype.init=function() {
    var _this = this;
    this.getData();
    console.log(this.data);
    this.bindData();
    console.log(this.inner.offsetWidth);
    this.delayImg();
    this.timer = window.setInterval(function (){
        _this.move()
    },this.interval);
    console.log(this.data.length);
    this.mouseEvent();
    this.click();
    this.focusClick();
}
