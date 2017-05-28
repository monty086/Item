/**
 * Created by monty on 2017/5/27.
 */


function banner(banner,url,interval){
    var $banner = banner;
    var $url = url;
    var $interval = interval;
    var $inner  =$banner.children('.bannerInner');
    var $focus = $banner.children('.focusList');
    var $left =$banner.children('.left');
    var $right  =$banner.children('.right');
    var $imgs = null;
    var $lis = null;
    var $timer = null;
    var $step = 0;
    var $data = null;
    var $bok =true;

    $.ajax({
        type:'get',
        url:$url+'?_='+Math.random(),
        dataType:'json',
        data:null,
        async:false,
        success:function (data){
            console.log(data);
            $data=data;
        },
        error:function (){
            console.log('error~~');
        }
    });


    (function (){
        var $str1=``;
        var $str2 =``;
        $.each($data,function (index,item){
            $str1+=`<div><img src="" realImg="${item.src}" alt=""></div>`;
            $str2+=index===0?`<li class="selected"></li>`:`<li></li>`;
        });
        $inner.html($str1);
        $focus.html($str2);
        $imgs = $inner.find('img');
        console.log($imgs);
        $lis = $focus.find('li');
    })();

    function delayImg(){
        $.each($imgs,function (index,item){
            var temImg = new Image;
            temImg.src = $(item).attr('realImg');
            temImg.onload=function (){
                item.src = this.src;
                if(index===0){
                    public.css(item.parentNode,{zIndex:10});
                    $(item).parent().animate({opacity:1},1000);
                }
            }
        })
    };
    delayImg();
    $timer = window.setInterval(move,$interval);
    function move() {
        if($step==$data.length-1){
            $step=-1;
            // $imgs.eq($step).animate({opacity:1},1000);
        }
        $step++;
        setImg()
    };
    function setImg(){
        // $imgs.each(function (index,item){
            var $div = $imgs.eq($step).parent();
            $div.css({zIndex:10}).siblings().css({zIndex:0});
            $div.animate({opacity:1},1000,function (){
                $bok=true;
            }).siblings().css({opacity:0});

            // if(index==$step){
            //     $(item).parent().css({zIndex:10});
            //     $(item).parent().animate({opacity:1},1000,function (){
            //         $(this).siblings().each(function (index,item){
            //             $(item).css({opacity:0})
            //         })
            //     })
            // }else{
            //     $(item).css('zIndex','0')
            // }
        // })
        $lis.eq($step).addClass('selected').siblings().removeClass('selected')
    }

    $banner.mouseover(function (){
        window.clearInterval($timer);
        $left.css({display:'block'});
        $right.css({display:'block'});
    })
    $banner.mouseout(function (){
        $timer = window.setInterval(move,$interval);
        $left.css({display:'none'});
        $right.css({display:'none'})
    })

    $right.click(function () {
        if($bok){
            $bok=false;
            move()
        }
    })
    $left.click(function () {
        if($bok){
            $bok=false;
            if($step==0){
                $step=$data.length;
            }
            $step--;
            setImg()
        }
    })
    $lis.click(function () {
        if($bok){
            $bok=false;
            $step=$(this).index();
            setImg();
        }
    })
}

jQuery.extend({
    banner:banner
});
jQuery.fn.extend({
    banner:banner
})
