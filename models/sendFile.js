// --------------- 文件请求 --------------- //
const sendFile = function (files) {
    const tempObj = new Object();
    const fileObj = new Object();
    tempObj.describe = [];

    let fileAllName = files.file0.name;
    let fileName = fileAllName.split('.')[0];
    let fileType = fileAllName.split('.')[1];
    let fileSize = files.file0.size;
    fileObj.fileName = fileName;
    fileObj.fileType = fileType;
    fileObj.fileSize = fileSize;

    tempObj.describe.push(fileObj);
    tempObj.isback = "false";
    tempObj.type = "20";

    let commondType = JSON.stringify(tempObj);
    return "|FILE@LIST@FLAG|_" + commondType + "_@@|END@FLAG|@@";
};

module.exports = sendFile;