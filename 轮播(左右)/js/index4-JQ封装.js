

(function () {
    function banner(url, interval) {
        var _this =this;
        console.log(_this);
        var $url = url;
        var $interval = interval || 2000;
        var $inner = this.children('.bannerInner');
        var $focus = this.children('.focusList');
        var $left = this.children('a').eq(0);
        var $right = this.children('a').eq(1);

        var $data = null;
        var $timer = null;
        var $step = 0;
        var $bok = true;

        $.ajax({
            type: 'get',
            url: $url,
            data: null,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data);
                $data = data;
            },
            error: function () {
                console.log('error~~');
            }
        });


        (function () {
            var str1 = ``, str2 = ``
            $.each($data, function (index, item) {
                str1 += `<div><img src="" realImg="${item.src}" alt=""></div>`
                str2 += index === 0 ? `<li class="selected">` : `<li></li>`;
            })
            str1 += `<div><img src="" realImg="${$data[0].src}" alt=""></div>`;
            $inner.html(str1);
            $focus.html(str2);
            $imgs = $inner.find('img');
            $lis = $focus.find('li');
            $inner.css({width: $imgs[0].width * ($data.length + 1)})
        })();

        function delayImg() {
            $imgs.each(function (index, item) {
                var $this = $(this)
                var temImg = new Image;
                temImg.src = $(item).attr('realImg');
                temImg.onload = function () {
                    $this.prop('src', this.src);
                    $this.animate({opacity: 1}, 1000);
                }
            })
        }

        delayImg()

        $timer = window.setInterval(move, $interval)
        function move() {
            $step++;
            $lis.eq($step).addClass('selected').siblings().removeClass('selected');
            $inner.animate({left: -$step * 800}, 1000, function () {
                if ($step == $data.length) {
                    $step = 0;
                    $lis.eq($step).addClass('selected').siblings().removeClass('selected');
                    $inner.css({left: -$step * 800});

                }
                $bok=true;
            });


        };
        mouseShow()
        function mouseShow() {
            _this.mouseover(function () {
                window.clearInterval($timer);
                $left.css({display:'block'});
                $right.css({display:'block'});
            })
            _this.mouseout(function (){
                $timer = window.setInterval(move,$interval);
                $left.css({display:'none'});
                $right.css({display:'none'});
            })
        }

        (function (){
            $right.click(function (){
                if($bok){
                    $bok=false;
                    move()
                }

            })
            $left.click(function (){
                if($bok){
                    $bok=false;
                    if($step==0){
                        $step=$data.length;
                        $inner.css({left:-$step*800});
                    }
                    $step--;
                    $inner.animate({left:-$step*800},1000,function (){
                        $bok=true;
                        $lis.eq($step).addClass('selected').siblings().removeClass('selected')
                    });

                }

            })
        })()



        $lis.click(function (){
            if($bok){
                $bok=false;
                $step= $(this).index();
                $inner.animate({left:-$step*800},1000,function (){
                    $bok=true;
                });
                $lis.eq($step).addClass('selected').siblings().removeClass('selected');
            }

        })

    }
    jQuery.extend({
        banner: banner
    })

    jQuery.fn.extend({
        banner: banner
    })
})()
