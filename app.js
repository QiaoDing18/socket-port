const fs = require('fs');
const net = require('net');
const express = require('express');
const multipart= require('connect-multiparty');
let user;
const app = express();
const multipartMiddleware = multipart();

const port = process.env.PORT || 4567;
const HOST = '139.199.20.248';      // 老板的服务器
const PORT = 10086;                 // 老板的神奇端口

const client = [];

const json = require("./models/json.js");
const login = require("./models/login.js");
const encapLogin = require("./models/encapLogin.js");
const encapCommond = require("./models/encapCommond.js");
const getDir = require("./models/encapDir.js");
const stringToBuffer = require("./models/stringToBuffer.js");
const sendFile = require("./models/sendFile.js");
const returnDir = require("./models/returnDir.js");
const getFile = require("./models/getFile.js");
const fileReady = require("./models/fileReady.js");
const backToYou = require("./models/backToYou.js");

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.listen(port, function () {
    console.log('node socket Connect Start on ' + port);
});



const backTo = function (data, callback) {
    callback(false, data);
};

// ------------------  目录控制  ------------------ //
app.use("/getDir", function (req, res) {
    let dir;
    let username = req.query.username;
    let dirName = req.query.dirName;
    let commendString = getDir(dirName);
    let commendBuffer = stringToBuffer(commendString);
    console.log(commendString);
    setTimeout(function () {
        client[username].write(commendBuffer.bufferLength);
        client[username].write(commendBuffer.oriBuffer);
    }, 1000);

    client[username].on('data', function (data) {
        console.log('DATA:' + data);
        dir = data;
    });

    setTimeout(function () {
        returnDir(dir , function (err, result) {
            json(res, err, result);
        });
    }, 2000);
});


// ------------------  文件接收  ------------------ //
app.use("/reFile", function (req, res) {
    let username = req.query.username;
    let name = req.query.nameOfFile;
    let filePath = req.query.filePath;
    let flag = 0;
    let sendGetFileCommend = getFile(name, filePath);
    let commendBuffer = stringToBuffer(sendGetFileCommend);

    client[username].write(commendBuffer.bufferLength);
    client[username].write(commendBuffer.oriBuffer);


    client[username].on('data', function (data) {
        console.log('JAVA GIVE ME:' + data);
        console.log("-----------length:"+data.length);
        if(data.indexOf("FILE@LIST@FLAG")>=0){
            let tempCpmmend = fileReady(data);
            console.log(tempCpmmend);
            let ttBuffer = stringToBuffer(tempCpmmend);

            client[username].write(ttBuffer.bufferLength);
            client[username].write(ttBuffer.oriBuffer);
        }else if(data.indexOf("FILE@LIST@FLAG")<0 && data.length !== 4){
            fs.writeFile('./files1/'+ name, data, function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('give me');
                    let dataDir = name;
                    backTo(dataDir, function (err, result) {
                        json(res, err, result);
                    });
                    flag = 1;
                    return;
                }
            });
        }
    });

    setTimeout(function () {
        if(flag == 0){
            backToYou(function (err, result) {
                json(res, err, result);
            });
        }
    }, 20000);

    setTimeout(function () {
        fs.unlink("./files1/" + name, function (err) {
            console.log(err);
        });
    }, 100000);
});

// ------------------  文件发送  ------------------ //
app.use(multipart({uploadDir:'./files' }));
app.post("/upLoad", multipartMiddleware, function(req, res){
    let username = user;
    let commend = sendFile(req.files);
    let theBuffers = stringToBuffer(commend);
    console.log(req.files);

    let outPutFileName = req.files.file0.path.split('/')[1];
    // let outPutFileName = req.files.file0.path.split('\\')[1];
    let filePath = "./files/" + outPutFileName;
    let fileBuffer;

    setTimeout(function () {
        fs.readFile(filePath, function (err, data) {
            console.log(data);
            fileBuffer = data;
        });
    }, 1000);

    setTimeout(function () {
        client[username].write(theBuffers.bufferLength);
        client[username].write(theBuffers.oriBuffer);

        if(fileBuffer){
            client[username].write(fileBuffer);
        }else{
            return;
        }

    }, 1200);

    setTimeout(function () {
        fs.unlink(filePath, function (err) {
            console.log(err);
        });
    }, 5000);

    backToYou(function (err, result) {
        json(res, err, result);
    });
});
app.use("/upName", function (req, res) {
    user = req.query.username;
    backToYou(function (err, result) {
        json(res, err, result);
    });
});

// ------------------  断开链接  ------------------ //
app.use("/endConnect", function (req, res) {
    let username = req.query.username;
    let endCommend = "|OFFLINE|_@@|END@FLAG|@@";
    let commendBuffer = stringToBuffer(endCommend);

   // ------ 结束命令 ------ //
    client[username].write(commendBuffer.bufferLength);
    client[username].write(commendBuffer.oriBuffer);
    client[username].end();

    backToYou(function (err, result) {
       json(res, err, result);
    });
});

// ------------------  发送命令  ------------------ //
app.use("/solveCommond", function (req, res) {
    let username = req.query.username;
    let comValue = req.query.comValue;
    if(!comValue){
        return;
    }
    let commendString = encapCommond(comValue);
    let commendBuffer = stringToBuffer(commendString);

    // ----- 发送指令 ----- //
    client[username].write(commendBuffer.bufferLength);
    client[username].write(commendBuffer.oriBuffer);

    backToYou(function (err, result) {
        json(res, err, result);
    });
});

// ------------------   登 录   ------------------ //
app.use("/login", function (req, res) {
    let username = req.query.username;

    client[username] = new net.Socket();
    client[username].connect(PORT, HOST, function () {
        console.log("Connect Success");
    });

    let getData;
    let password = req.query.password;
    let commendString = encapLogin(username, password);
    let commendBuffer = stringToBuffer(commendString);

    // ------ 发送登录信息 ------- //
    client[username].write(commendBuffer.bufferLength);
    client[username].write(commendBuffer.oriBuffer);

    client[username].on('data', function (data) {
        getData = data;
    });

    setTimeout(function () {
        console.log('Login Data :' + getData);
        if(getData == null){
            backToYou(function (err, result) {
                json(res, err, result);
            });
            return;
        }
        if(getData.indexOf("CONNECTED") > 0){
            login(getData, function (err, result) {
                json(res, err, result);
            });
        }
    }, 1000);
});