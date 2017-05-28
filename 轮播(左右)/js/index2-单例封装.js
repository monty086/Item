/**
 * Created by monty on 2017/5/22.
 */

(function () {
    function banner(id,url,interval){
        var banner = document.getElementById(id);
        var inner = banner.getElementsByClassName('bannerInner')[0];
        var focus = banner.getElementsByClassName('focusList')[0];
        var left = public.children(banner,'a')[0];
        var right = public.children(banner,'a')[1];
        var imgs = inner.getElementsByTagName('img');
        var lis = focus.getElementsByTagName('li');
        var data=null,timer=null,step=0,bok=true;

        bind()
        function bind(){
            var xhr = new XMLHttpRequest();
            xhr.open('get',(url+'?_=')+Math.random(),false);
            xhr.onreadystatechange =function () {
                if(xhr.readyState==4&&xhr.status==200){
                 data=public.toJsonObj(xhr.responseText)
                }
            }
            xhr.send(null);
            console.log(data);
        }

        //绑定数据
        bindData()
        function bindData() {
            if(data&&data.length){
                var str1=``,str2=``;
                for (var i=0;i<data.length;i++) {
                    str1+=`<div><img src="" realImg="${data[i].src}" alt=""></div>`;
                    str2+=i===0?`<li class="selected"></li>`:`<li></li>`;
                }
                str1+=`<div><img src="" realImg="${data[0].src}" alt=""></div>`;
                public.css(inner,{width:(data.length+1)*800})
                inner.innerHTML = str1;
                focus.innerHTML = str2;
            }
        }

        //图片延迟加载
        delayImg();
        function delayImg(){
            for (var i=0;i<imgs.length;i++) {
                var temImg = new Image;
                temImg.src = imgs[i].getAttribute('realImg');
                temImg.i= i;
                temImg.onload = function (){
                    imgs[this.i].src = this.src;
                    animation(imgs[this.i],{opacity:1});
                    temImg=null;
                }
            }
        }

        //自动轮播
        timer = window.setInterval(move,interval);
        function move(){
            if(step==data.length){
                step=0;
                public.css(inner,{left:-step*800});
            }
            step++;
            animation(inner,{left:-step*800},1000,function (){
                bok=true;
            });
            focus1()
        }
        function focus1(){
            // lis[0].className=step==data.length?'selected':'';
            for (var i=0;i<lis.length;i++) {
                if(step==data.length){
                    lis[0].className = 'selected';
                }
                else{
                    lis[i].className = '';
                };
                // step==data.length?lis[0].className='selected':null;
                lis[i].className=i==step?'selected':'';
                }
            }

        //鼠标移出移出
        banner.onmouseover =function (){
            window.clearInterval(timer);
            left.style.display ='block';
            right.style.display = 'block';
        }
        banner.onmouseout = function (){
            timer = setInterval(move,interval);
            left.style.display = 'none';
            right.style.display = 'none';
        }

        //左右按钮点击
        right.onclick = function (){
            if(bok){
                bok=false;
                move()
            }

        }
        left.onclick =function (){
            if(bok){
                bok=false;
                if(step==0){
                    step=data.length;
                    public.css(inner,{left:-step*800})
                };
                step--;
                animation(inner,{left:-step*800},1000,function (){
                    if(step==0){
                        step=data.length;
                        public.css(inner,{left:-step*800})
                    }
                    bok=true;
                })
                focus1()
            }
        }

        //焦点点击
        focusList()
        function focusList() {
                for (var i=0;i<lis.length;i++) {
                    lis[i].i=i;
                    lis[i].onclick=function (){
                        if(bok){
                            bok=false;
                        step=this.i;
                        animation(inner,{left:-step*800},1000,function (){
                            bok=true
                        });
                        focus1()
                    }
                }
            }
        }
        }
    window.banner=banner;
})()