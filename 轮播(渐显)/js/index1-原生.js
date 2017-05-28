/**
 * Created by monty on 2017/5/22.
 */

var banner = document.getElementById('banner');
// var inner = public.getByClass('bannerInner');
var inner = banner.getElementsByClassName('bannerInner')[0];
var list = banner.getElementsByClassName('focusList')[0];
// var list = public.getByClass('focusList');
var left = banner.getElementsByTagName('a')[0];
var right = banner.getElementsByTagName('a')[1];
var imgs = banner.getElementsByTagName('img');
var lis = list.getElementsByTagName('li');
var timer=null,step=0,bok=true,data=null;

//获取数据
bind();
function bind(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+Math.random(),false);
    xhr.onreadystatechange=function (){
        if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
            data = public.toJsonObj(xhr.responseText)
        }
    }
    xhr.send(null);
}
//绑定数据
bindData()
function bindData(){
    if(data&&data.length>=0){
        for (var i=0;i<data.length;i++) {
            var div = document.createElement('div');
            var img = document.createElement('img');
            var li = document.createElement('li');
            img.setAttribute('realImg',data[i].src);
            div.appendChild(img);
            i===0?li.className='selected':'';
            inner.appendChild(div);
            list.appendChild(li);
        }
    }
}

//图片延迟加载
delayImg();
function delayImg(){
    for (var i=0;i<imgs.length;i++) {
        (function (index){
            var temImg = document.createElement('img');
            temImg.src = imgs[i].getAttribute('realImg');
            temImg.onload =function (){
                imgs[index].src = this.src;
                temImg=null;
                if(index==0){
                    public.css(imgs[0].parentNode,{zIndex:1})
                    animation(imgs[0].parentNode,{opacity:1},1000)
                }
            }
        })(i)
    }
}

//自动轮播
timer = window.setInterval(show,2000);
function show(){
    step++;
    if(step==data.length){
        step=0;
    }
    setImg()
}
function setImg(){
    for (var i=0;i<imgs.length;i++){
        if(i==step){
            public.css(imgs[i].parentNode,{zIndex:1});
            animation(imgs[i].parentNode,{opacity:1},500,function (){
                var sib = public.siblings(this);
                for (var i=0;i<sib.length;i++) {
                    public.css(sib[i],{opacity:0})
                }
                ;bok=true
            })
        }else{
            public.css(imgs[i].parentNode,{zIndex:0});
        }
        if(i==step){
            lis[i].className='selected'
        }else{
            lis[i].className=''
        }
    }

}

//鼠标移入移出
banner.onmouseover =function (){
    window.clearInterval(timer);
    public.css(left,{display:'block'})
    public.css(right,{display:'block'})
};
banner.onmouseout =function (){
    timer = window.setInterval(show,2000);
    public.css(left,{display:'none'});
    public.css(right,{display:'none'});
}

//左右按钮切换
right.onclick = function (){
    if(bok){
        bok=false;
        show()
    }
};
left.onclick  = function (){
    if(bok){
        bok=false;
        if(step==0){
            step=data.length
        }
        step--;
        setImg()
    }

}

//焦点点击切换
focusClick()
function focusClick() {
    for (var i=0;i<lis.length;i++) {
        lis[i].i=i
        lis[i].onclick=function (){
            if(bok){
                bok=false;
                step=this.i
                setImg()
            }

        }
    }

}