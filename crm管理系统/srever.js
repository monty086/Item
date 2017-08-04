/**
 * Created by mengqian on 2017/8/3.
 */
let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
let app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", (req, res) => {
    res.sendFile('./page/userList.html', {root: __dirname});
});
app.get("/userInfo.html", (req, res) => {
    res.sendFile('./page/userInfo.html', {root: __dirname});
});

let userAll = JSON.parse(fs.readFileSync("./jsonData/userList.json", "utf-8"));
let result = {
    code: 1,
    msg: "error",
    data: []
};
app.get("/getUserList", (req, res) => {
    let pageCode = req.query.pageCode;
    result = {
        code: 0,
        msg: "success",
        total: Math.ceil(userAll.length / 10),
        data: []
    };
    for (let i = (pageCode - 1) * 10; i < pageCode * 10; i++) {
        //注意最后一页的时候有可能不足10条数据
        if (i > userAll.length - 1)break;
        result.data.push(userAll[i]);
    }
    res.send(result);
});
app.get("/removeUser", (req, res) => {
    //获取客户端传给服务器的要删除的用户的ID
    let removeUserId = req.query["id"];
    //遍历数据库中的数据userData,找到对应的这个ID的用户,删掉这条数据
    userAll.find(function (item, index) {
        if (item["id"] == removeUserId) {
            userAll.splice(index, 1);
            //把改变的数据写入到数据库中,注意把userData变成JSON字符串
            fs.writeFileSync("./jsonData/userList.json", JSON.stringify(userAll), "utf-8");
            result = {
                code: 0,
                msg: "success"
            };
            return true;
        }
    });
    res.send(result);
});
app.post("/addUser", (req, res) => {
    let addUserData=req.body;
    console.log(addUserData);
    addUserData["id"]=(userAll[userAll.length-1]["id"])+1;
    userAll.push(addUserData);
    fs.writeFileSync("./jsonData/userList.json",JSON.stringify(userAll),"utf-8");
    result={
        code:0,
        msg:"success"
    };
    res.send(result);
});
app.get("/userInfo", (req, res) => {
    result = {
        code: 0,
        msg: "success",
        data: userAll.find(function (item, index) {
            return item.id == req.query.id;
        })
    };
    res.send(result);
});
app.post("/changeUserInfo", (req, res) => {
    let changeUserId = req.body.id;
    userAll.forEach(function (item, index) {
        if (item["id"] == changeUserId) {
            userAll.splice(index, 1, req.body);
            //把改变的数据写入到数据库中,注意把userData变成JSON字符串
            fs.writeFileSync("./jsonData/userList.json", JSON.stringify(userAll));
            result = {
                code: 0,
                msg: "success"
            };
            return false;
        }
    });
    res.send(result);
})
app.listen(8880, () => {
    console.log("8880 OK")
});