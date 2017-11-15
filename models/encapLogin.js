// --------------- 登录处理 --------------- //
const encapLogin = function (username, password) {
    return "|CONNECTED@TO@USER|_" + username + "_" + password + "_@@|END@FLAG|@@";
};

module.exports = encapLogin;