/**
 * Created by monty on 2017/5/19.
 */

var uls = document.getElementsByTagName('ul');
var ulsAry = public.toArray(uls)
var imgs = document.getElementsByTagName('img');
var btn = document.getElementById('btn')
var time = null;
var bok = false;

function createEle() {
    var li = document.createElement('li');
    var div = document.createElement('div')
    var img = document.createElement('img')
    var p = document.createElement('p')
    var random = public.getRandom(1, 23)
    img.setAttribute('realImg', "img3/" + random + ".jpg");
    p.innerHTML = "xxff" + random;
    div.style.height = public.getRandom(100, 200) + 'px';
    div.appendChild(img);
    li.appendChild(div);
    li.appendChild(p);
    return li;
}
// uls[0].appendChild(createEle())

//创建50个
function li50() {
    for (var i = 0; i < 50; i++) {
        ulsAry.sort(function (a, b) {
            return a.offsetHeight - b.offsetHeight
        })
        ulsAry[0].appendChild(createEle())
    }
}
li50()
showImg()
window.onscroll = function () {
    if (bok) {
        clearInterval(time)
    }
    bok = true;
    var H = public.win('scrollTop');
    var h = public.win('clientHeight');
    if (H >= h) {
        btn.style.display = 'block'
    } else {
        btn.style.display = 'none'
    }
    showImg()
    var H = public.win('scrollTop') + public.win('clientHeight');
    var h = public.win('scrollHeight') - 500;
    if (H >= h) {
        li50()
    }
}
function showImg() {
    for (var i = 0; i < imgs.length; i++) {
        var cur = imgs[i]
        var H = public.win('scrollTop') + public.win('clientHeight');
        var h = public.offset(cur.parentNode).top + cur.parentNode.offsetHeight
        if (H >= h) {
            loadImg(cur)
        }
    }
}
function loadImg(ele) {
    if (ele.loaded) {
        return
    }
    var temImg = document.createElement('img');
    temImg.src = ele.getAttribute('realImg');
    temImg.onload = function () {
        ele.src = this.src
        temImg = null;
        ele.parentNode.style.height = ele.style.height
        fadeIn(ele)
        ele.loaded = true
    }
}

function fadeIn(ele) {
    window.clearInterval(ele.timer);
    ele.timer = window.setInterval(function () {
        var opacity = public.css(ele, 'opacity');
        if (opacity >= 1) {
            window.clearInterval(ele.timer);
            public.css(ele, 'opacity', 1)
            return
        }
        opacity += 0.1;
        public.css(ele, 'opacity', opacity)
    }, 18)
}


btn.onclick = function () {
    // window.clearInterval(time);
    var H = public.win('scrollTop');
    var duration = 2000;
    var interval =  50
    var step = H / duration * interval
    time = window.setInterval(function () {
        var H = public.win('scrollTop');
        if (H <= 0) {
            window.clearInterval(time);
            return
        }
        H -= step;
        public.win('scrollTop', H)
        bok = false
    }, interval)

}

