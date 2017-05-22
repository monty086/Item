//1.获取数据 用ajax
var data = null;
var xhr = new XMLHttpRequest();
xhr.open('get', 'json/data.json', false);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        data = public.toJsonObj(xhr.responseText)
    }
}
xhr.send(null)
console.log(data);


//2绑定数据，ＥＳ６模板字符串
var htmlStr = ``;
for (var i = 0; i < data.length; i++) {
    htmlStr += `
        <li data-time="${data[i].time}" data-price="${data[i].price}" data-sales ="${data[i].sales}">
            <a href="##">
                <img src="${data[i].img}" alt="">
                <p>${data[i].title}</p>
                <p class="sales">销量：${data[i].sales}</p>
                <del>10000</del>
                <span>￥：${data[i].price}</span>
                <p class="time">上架时间：${data[i].time}</p>
            </a>
        </li>
        `
}
var olist = document.getElementById('list');
olist.innerHTML = htmlStr;
//3给三个排序标签绑定事件
var header = document.getElementById("header");
var linkList = header.getElementsByTagName("a");
for (var i = 0; i < linkList.length; i++) {
    linkList[i].setAttribute('data-flag', -1)
    linkList[i].onclick = function () {
        productSort.call(this)
        changeArrow.call(this)
        clearOther.call(this)
    }
}
//排序的方法
function productSort() {
    var _this = this;
    var dataFlag = this.getAttribute('data-flag');
    dataFlag *= -1;
    this.setAttribute('data-flag', dataFlag);
    var lis = public.toArray(olist.getElementsByTagName('li'))
    lis.sort(function (a, b) {
        var attr = _this.getAttribute('sort-attr')
        var prev = a.getAttribute(attr);
        var next = b.getAttribute(attr);
        prev = prev.replace(/-/g, '');
        next = next.replace(/-/g, '');
        return (prev - next) * dataFlag
    })
    var flag = document.createDocumentFragment();
    for (var i = 0; i < lis.length; i++) {
        flag.appendChild(lis[i]);
    }
    olist.appendChild(flag)
}
//实现箭头的切换
function changeArrow() {
    var arrows = this.getElementsByTagName('i');
    var dataFlag = this.getAttribute('data-flag');
    if (dataFlag > 0) {
        arrows[0].className = 'bg up'
        arrows[1].className = 'down'
    } else {
        arrows[0].className = 'up';
        arrows[1].className = 'down bg';
    }
}

//清除其他A标签中的样式（排序的初始状态，被选中i的样式）

    function clearOther() {
        for (var i = 0; i < linkList.length; i++) {
            if (linkList[i] == this) {
                continue;
            }
            var arrows = linkList[i].getElementsByTagName('i');
            linkList[i].setAttribute('data-flag', -1)
            arrows[0].className = 'up'
            arrows[1].className = 'down'
        }
    }
