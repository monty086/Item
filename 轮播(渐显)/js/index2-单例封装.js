/**
 * Created by monty on 2017/5/26.
 */
(function (){
    function banner(id,url,interval){
        interval =interval ||2000;
        var banner = document.getElementById(id)
        var inner = banner.getElementsByClassName('bannerInner')[0];
        var focus = banner.getElementsByClassName('focusList')[0];
        var left = public.children(banner,'a')[0]
        var right = public.children(banner,'a')[1]
        var data=null,timer=null,step=0,bok=true;
        var imgs = inner.getElementsByTagName('img');
        var lis = focus.getElementsByTagName('li');



        bingData();
        function bingData(){
            var xhr = new XMLHttpRequest();
            xhr.open('get',url+'?_='+Math.random(),false);
            xhr.onreadystatechange =function (){
                if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
                    data = public.toJsonObj(xhr.responseText)
                }
            }
            xhr.send();
            console.log(data);
        }
        bind()
        function bind(){
            if(data&&data.length){
                var str1=``,str2=``;
                for (var i=0;i<data.length;i++) {
                    str1+=`<div><img src=""  realImg="${data[i].src}"  alt=""></div>`;
                    str2+=i==0?`<li class="selected"></li>`:`<li></li>`;
                }
                inner.innerHTML = str1;
                focus.innerHTML = str2;
            }
        };
        delayImg()
        function delayImg(){
            for (var i=0;i<imgs.length;i++) {
                var temImg = new Image;
                temImg.src = imgs[i].getAttribute('realImg');
                temImg.index = i
                temImg.onload= function (){
                    imgs[this.index].src = this.src;
                    temImg=null;
                    if(this.index===0){
                        public.css(imgs[0].parentNode,{zIndex:1})
                        animation(imgs[0].parentNode,{opacity:1},1000);
                    }
                }
            }
        }

        // 自动轮播
        timer = window.setInterval(show,interval)
        function show() {
            step++;
            if (step == data.length) {
                step = 0;
            }
            setImg();
        }
        function setImg(){
            for (var i=0;i<imgs.length;i++) {
                if(step==i){
                    public.css(imgs[i].parentNode,{zIndex:1});
                    animation(imgs[i].parentNode,{opacity:1},1000,function (){
                        var sibs = public.siblings(this);
                        for (var i=0;i<sibs.length;i++) {
                            public.css(sibs[i],{opacity:0});
                        }
                        bok=true
                    })
                }else{
                    public.css(imgs[i].parentNode,{zIndex:0})
                    }
                    lis[i].className=i==step?'selected':null
            }

        }

        //鼠标移入移出
        banner.onmouseover =function (){
            window.clearInterval(timer);
            left.style.display = 'block'
            right.style.display = 'block'
        }
        banner.onmouseout =function (){
            timer = window.setInterval(show,interval);
            public.css(left,{display:'none'});
            public.css(right,'display','none');
        }
        //左右按钮点击
        right.onclick =function (){
            if(bok){
                bok=false;
                show()
            }

        }
        left.onclick =function (){
            if(bok){
                bok=false;
                if(step==0){
                    step=data.length;

                }
                step--
                setImg()
            }

        }

        for (var i=0;i<lis.length;i++) {
            lis[i].index =i
            lis[i].onclick =function (){
                if(bok){
                    bok=false;
                    step=this.index;
                    setImg()
                }
            }
        }









    }
    window.banner = banner;
})()