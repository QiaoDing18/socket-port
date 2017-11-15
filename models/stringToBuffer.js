// --------------- 处理字符串 --------------- //
const stringToBuffer = function (str) {
    let oriBuffer = new Buffer(str);
    let setIntBuffer = new Buffer([0x00, 0x00, 0x00, 0x00]);
    setIntBuffer.writeUIntBE(oriBuffer.length, 0, 4);
    let bufferObj = {
        bufferLength: setIntBuffer,
        oriBuffer: oriBuffer
    };
    return bufferObj;
};


module.exports = stringToBuffer;