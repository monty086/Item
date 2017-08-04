/**
 * Created by mengqian on 2017/8/3.
 */
let UserList = (function () {
    let total=0,pageCode=1;
    function bindHTML(){
        function page(res) {
            if (!res)return;
            total=res["total"];
            let data=res["data"];
            let str=``;
            for(let i=0;i<data.length;i++){
                str+=`
                <li data-id="${data[i]["id"]}">
                <span>${data[i]["id"]}</span>
                <span>${data[i]["name"]}</span>
                <span>${data[i]["sex"]==1?"女":"男"}</span>
                <span>${data[i]["score"]}</span>
                <span>
                <button class="del">删除 </button>
                <button class="check">查看/修改</button>
                </span>
                </li>
                `
            }
            $("#list").html(str);
            str=``;
            for (let i=1;i<=total;i++){
                if(i==page){
                    str+=  `<li class="bg">${i}</li>`;
                    continue;
                }
                str+=`<li>${i}</li>`
            }
            $("#pageNum").html(str);
            //输入框中的内容变成当前页
            $("#pageInput").val(pageCode)
        };
        $.ajax({
            url:"/getUserList",
            type:"GET",
            dataType:"json",
            data:{
                pageCode:pageCode,
            },
            success:page,
            error:function (res) {

            }
        })
    };

    return {
        init: function () {
            bindHTML();
            //绑定点击分页事件
            $("#page").on("click","span",function () {
                let text=this.innerHTML;
                if(text=="首页"){
                    if(pageCode==1)return;
                    pageCode=1;
                }
                if(text=="上一页"){
                    if(pageCode==1)return;
                    pageCode--;
                }
                if(text=="下一页"){
                    if(pageCode==total) return;
                    pageCode++;
                }
                if(text=="尾页"){
                    if(pageCode==total) return;
                    pageCode=total;
                }
                //只要page改动了就要再一次请求 执行bindHTML
                bindHTML();
            });
            $("#page").on("click","li",function () {
                if(pageCode==parseInt(this.innerHTML)) return;
                pageCode=parseInt(this.innerHTML);
                bindHTML();
            });
            //输入框输入页数
            $("#pageInput").on("keyup",function (e) {
                e=e||window.event;
                if(e.keyCode===13){
                    var val=Math.round(this.value);
                    //输入的不是有效数字,就让他显示当前页
                    if(isNaN(val)){
                        this.value=pageCode;
                        return;
                    }
                    //输入的值小于最小值或者大于最大值了
                    val<1?val=1:null;
                    val>total?val=total:null;
                    pageCode=val;
                    bindHTML();
                }
            });
            //删除事件
            $("#list").on("click",".del",function () {
                let userId=$(this.parentNode.parentNode).attr("data-id"),
                    flag=confirm(`确定要删除ID为[ ${userId} ]的信息吗?`),
                    _this=this;
                if(flag){
                    $.ajax({
                        url:"/removeUser",
                        type:"get",
                        dataType:"json",
                        data:{
                            id:userId
                        },
                        async:true,
                        success:function (result) {
                            if(result&&result.code==0){
                                alert("亲,你把我删了,就再也回不来了");
                                $("#list")[0].removeChild(_this.parentNode.parentNode)
                            }else {
                                alert("哈哈,你删不了我的!")
                            }
                        },
                        error:function (e) {
                            console.log(e)
                        }
                    })
                }
            });
            //增加新用户
            $("#submit").click(function () {
                $.ajax({
                    url:"/addUser",
                    type:"post",
                    dataType:"json",
                    async:false,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:JSON.stringify({
                        "name":$("#name").val(),
                        "sex":$("#sex").val()=="1"||$("#sex").val()=="女"?1:0,
                        "score":$("#score").val(),
                    }),
                    cache:false,
                    success:function (result) {
                        if (result&&result.code===0){
                            alert("亲!你增加了一个用户信息哦!");
                            bindHTML();
                            $("form")[0].reset();
                        }else {
                            alert("哎!增加失败了哦!")
                        }
                    },
                    error:function (e) {
                        console.log(e)
                    }
                })
            });
            //查看和修改用户信息
            $("#list").on("click",".check",function () {
                console.log(1);
                let userId=$(this.parentNode.parentNode).attr("data-id");
                window.open('./userInfo.html?id='+userId)

            })
        }
    }
})();
UserList.init();