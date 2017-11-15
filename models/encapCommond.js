// --------------- 包装命令 --------------- //
const encapCommond = function (val) {
    let tempObj = new Object();
    tempObj.isback = "false";
    tempObj.type = val.toString();
    let commondType = JSON.stringify(tempObj);
    return "|COMMAND|_" + commondType + "_@@|END@FLAG|@@";
};

module.exports = encapCommond;