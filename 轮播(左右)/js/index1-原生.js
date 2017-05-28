

var banner = document.getElementById('banner');
var inner = banner.getElementsByClassName('bannerInner')[0];
var list = banner.getElementsByClassName('focusList')[0];
var left = banner.getElementsByTagName('a')[0];
var right = banner.getElementsByTagName('a')[1];
var imgs = inner.getElementsByTagName('img');
var lis = list.getElementsByTagName('li');
var data =null;
var timer = null;
var step = 0;
var bok =true;

bind()
function bind(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+new Date().getTime(),false);
    xhr.onreadystatechange =function (){
        if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
            data = public.toJsonObj(xhr.responseText)
        }
    }
    xhr.send();
}

if(data&&data.length>=0){
    var str1=``;
    var str2=``;
    for (var i=0;i<data.length;i++) {
        str1+=`<div><img src="" realImg="${data[i].src}" alt=""></div>`;
        str2+=i===0?`<li class="selected"></li>`:`<li></li>`;
    }
    str1+=`<div><img src=""  realImg="${data[0].src}" alt=""></div>`;
    public.css(inner,{width:(data.length+1)*800})
    inner.innerHTML= str1;
    list.innerHTML = str2;
}
//延迟加载
function delayImg(){
    for (var i=0;i<imgs.length;i++) {
        var temImg = new Image;
        temImg.src = imgs[i].getAttribute('realImg');
        temImg.i=i;
        temImg.onload =function (){
            imgs[this.i].src = this.src;
            animation(imgs[this.i],{opacity:1},1000);
            temImg=null;
        }
    }
}
delayImg()


//自动轮播
timer = window.setInterval(move,3000);
function move(){
    if(step==data.length){
        step=0;
        public.css(inner,{left:-step*800})
    }
    step++
    animation(inner,{left:-step*800},1000,function (){
        bok=true;
    })
    focus();
    console.log(step);
}


//焦点轮播
function focus(){
    for (var i=0;i<lis.length;i++) {
        step==data.length?lis[0].className='selected':null;
        if(step==i){
            lis[i].className = 'selected'
        }else{
            lis[i].className = '';
        }
    }

}
//鼠标移入移出
banner.onmouseover = function (){
    window.clearInterval(timer);
    public.css(left,{display:'block'});
    public.css(right,{display:'block'});
};
banner.onmouseout =function () {
    timer = window.setInterval(move,3000);
    public.css(left,{display:'none'});
    public.css(right,{display:'none'});
}
//左右按钮点击
right.onclick =function (){
    if(bok){
       bok=false;
        move()
    }
};
left.onclick =function (){
    if(bok){
        bok=false;
        step--;
        animation(inner,{left:-step*800},1000,function (){
            if(step==0){
                step=data.length;
                public.css(inner,{left:-step*800});
            };
            bok=true;
        });
        focus()
    }

}
//焦点点击
function focusClick(){
    if(bok){
        bok=false;
        for (var i=0;i<lis.length;i++){
            lis[i].i=i;
            lis[i].onclick=function (){
                step = this.i;
                animation(inner,{left:-step*800},1000,function (){
                    bok=true;
                });
                focus()
            }
        }
    }

}
focusClick()







