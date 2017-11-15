// ----------------- 返回目录 ---------------- //
const returnDir = function (data, callback) {
    if(data == null){
        callback(false, "try again");
        return;
    }
    let dir = data.toString().slice(1, -16).split("},{");
    dir[0] = dir[0].slice(1);
    if(dir.length > 1){
        dir[dir.length-1] = dir[dir.length-1].slice(0, -1);
    }

    console.log(dir);
    for(let i=0; i<dir.length; i++){
        dir[i] = "{" + dir[i] + "}";
        console.log(dir[i]);
        dir[i] = JSON.parse(dir[i]);
    }
    callback(false, dir);
};

module.exports = returnDir;