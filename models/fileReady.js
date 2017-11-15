// ----------------- 处理返回文件信息 ---------------- //
const fileReady = function (str) {
    let list = str.toString().slice(18, -16);
    let tempObj = new Object();
    tempObj.describe = [JSON.parse(list)];
    tempObj.isBack = false;
    tempObj.type = "";

    let commondType = JSON.stringify(tempObj);

    return commend = "|FILE@READY|_" + commondType + "_@@|END@FLAG|@@";
};

module.exports = fileReady;