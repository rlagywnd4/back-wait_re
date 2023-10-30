const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        default: 0
    },
    wmId: {
        type: Number, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    proxyId: {
        type: Number, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 방 생성 시 roomNumber 증가 메서드
roomSchema.statics.createRoom = async function (otherFields) {
    const Room = this;
    const maxRoomNumber = await Room.find().sort({ roomNumber: -1 }).limit(1);
    const newRoomNumber = maxRoomNumber.length > 0 ? maxRoomNumber[0].roomNumber + 1 : 1;

    const room = new Room({ roomNumber: newRoomNumber, ...otherFields });
    return room.save();
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;