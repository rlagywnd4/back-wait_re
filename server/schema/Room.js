const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    wmId: {
        type: String, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    proxyId: {
        type: String, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;