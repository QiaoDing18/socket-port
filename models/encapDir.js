// --------------- 目录请求 --------------- //
const getDir = function (dirName) {
    let tempObj = new Object();
    tempObj.isback = "true";
    tempObj.type = "4";
    if(dirName == null){
        tempObj.describe = "";
    }else{
        tempObj.describe = dirName;
    }

    let commondType = JSON.stringify(tempObj);
    return "|COMMAND|_" + commondType + "_@@|END@FLAG|@@";
};

module.exports = getDir;