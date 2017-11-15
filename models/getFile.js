// ----------------- 获取文件命令 ---------------- //
const getFile = function (name, path) {
    let tempObj = new Object();

    tempObj.name = name;
    tempObj.path = path;
    tempObj.type = false;

    console.log(path);
    // let arr = [];
    // arr.push(tempObj);
    // console.log(arr);

    let commondType = JSON.stringify(tempObj);
    let stringData = "|GET@FILE|_[" + commondType + "]_@@|END@FLAG|@@"

    console.log(stringData);
    return stringData;
        // .replace(/\\/g, "\\\\");
};

module.exports = getFile;