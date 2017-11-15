// ----------------- 登录 ---------------- //
const login = function (data, callback) {
    if( (data.indexOf("FAILED") >= 0) && (data.indexOf("CONNECTED") > 0) ){
        callback(true, "login fail!");
        return;
    }
    if( (data.indexOf("SUCCESS") >= 0) && (data.indexOf("CONNECTED") > 0) ){
        callback(false, "login success~");
        return;
    }
    return;
};

module.exports = login;