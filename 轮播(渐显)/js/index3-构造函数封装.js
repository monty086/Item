/**
 * Created by monty on 2017/5/27.
 */


function Banner(id, url, interval) {
    this.id = id;
    if (!this.id) {
        return
    }
    ;
    this.url = url;
    this.interval = interval || 2000;
    this.banner = document.getElementById(this.id);

    this.inner = this.banner.getElementsByTagName('div')[0];
    this.focus = this.banner.getElementsByTagName('ul')[0];

    this.left = this.banner.getElementsByTagName('a')[0];
    this.right = this.banner.getElementsByTagName('a')[1];

    this.imgs = this.inner.getElementsByTagName('img');
    this.lis = this.focus.getElementsByTagName('li');
    this.timer = null;
    this.step = 0;
    this.data = null;
    this.bok = true;
}
Banner.prototype.getData = function () {
    var _this = this
    //1. 创建元素
    var xhr = new XMLHttpRequest();
    //2. 打开地址
    xhr.open('get', this.url, false);
    //3. 响应请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            _this.data = public.toJsonObj(xhr.responseText)
        }
    }
    xhr.send()
}

Banner.prototype.bindData = function () {
    var str1 = ``, str2 = ``;
    for (var i = 0; i < this.data.length; i++) {
        str1 += `<div><img src="" realImg="${this.data[i].src}" alt=""></div>`;
        str2 += i === 0 ? `<li class="selected"></li>` : `<li></li>`;
    }
    this.inner.innerHTML = str1;
    this.focus.innerHTML = str2;
}

Banner.prototype.delayImg = function () {
    var _this =this
    for (var i = 0; i < this.imgs.length; i++) {
        var temImg = new Image;
        temImg.src =this.imgs[i].getAttribute('realImg');
        temImg.i =i
        temImg.onload =function (){
            _this.imgs[this.i].src = this.src;
            if(this.i==0) {
            animation(_this.imgs[0].parentNode, {opacity: 1}, 1000);
                public.css(_this.imgs[0].parentNode, {zIndex: 10});
            }
        }
    }
}

Banner.prototype.show =function(){
    this.step++;
    if(this.step==this.data.length){
        this.step=0;
    }
    this.setImg()
}
Banner.prototype.setImg =function (){
    for (var i=0;i<this.imgs.length;i++) {
        var _this =this
        if(this.step==i){
            public.css(this.imgs[i].parentNode,{zIndex:10});
            animation(this.imgs[i].parentNode,{opacity:1},1000,function (){
                var sibs = public.siblings(this);
                for (var i=0;i<sibs.length;i++) {
                    public.css(sibs[i],{opacity:0});
                }
                _this.bok=true
            })
        }else{
            public.css(this.imgs[i].parentNode,{zIndex:0})
        }
        this.lis[i].className =this.step==i?'selected':'';
    }
}

Banner.prototype.mousemove =function (){
    var _this = this;
    this.banner.onmouseover = function (){
        window.clearInterval(_this.timer);
        _this.left.style.display = 'block';
        _this.right.style.display = 'block'
    };
    this.banner.onmouseout =function (){
        _this.timer = window.setInterval(function (){
            _this.show()
        },_this.interval);
        _this.left.style.display = 'none';
        _this.right.style.display= 'none';
    }
}

Banner.prototype.mouseClick =function (){
    var _this =this
    this.right.onclick =function (){
        if(_this.bok){
            _this.bok=false;
            _this.show()
        }
    }
    this.left.onclick =function (){
        if(_this.bok){
            _this.bok=false;
            if(_this.step==0){
                _this.step=_this.data.length;
            };
            _this.step--;
            _this.setImg();
        }
    }
}

Banner.prototype.focusClick =function (){
    var _this =this
    for (var i=0;i<this.lis.length;i++) {
        this.lis[i].i =i
        this.lis[i].onclick=function (){
            if(_this.bok){
                _this.bok=false;
                _this.step = this.i;
                _this.setImg();
            }

        }
    }

}



Banner.prototype.init = function () {
    var _this = this
    this.getData();
    console.log(this.data);
    this.bindData();
    this.delayImg()
    this.timer = window.setInterval(function (){
        _this.show()
    },this.interval);
    this.mousemove();
    this.mouseClick();
    this.focusClick();
}