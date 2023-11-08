const socketIO = require('socket.io');
const ChatData = require('./schema/ChatData');
const Room = require('./schema/Room');
const {
  ChatRoom,
  Proxy,
  WaitMate,
  User,
  Review,
  LikeWait,
} = require('./models');
const Common = require('./common');

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });
  console.log('소켓 시작');

  io.on('connection', async (socket) => {
    console.log('새로운 소켓 연결이 이루어졌습니다.');

    socket.on('createRoom', async (data) => {
      try {
        const existingRoom = await Room.findOne({
          sender: data.sender,
          receiver: data.receiver,
        });

        if (existingRoom) {
          socket.emit('roomExists', { roomNumber: existingRoom.roomNumber });
        } else {
          const roomNumber = Date.now();
          console.log(roomNumber + '룸넘버입니다');

          const newRoom = new Room({
            sender: data.sender,
            receiver: data.receiver,
            proxyId: data.proxyId,
            roomNumber: roomNumber,
          });

          await newRoom.save();

          socket.emit('roomCreated', { roomNumber });
          socket.join(`room_${roomNumber}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('getRoomInfo', async (roomNumber) => {
      try {
        const room = await Room.findOne({ roomNumber });

        if (!room) {
          socket.emit('roomInfo', { error: '채팅방을 찾을 수 없습니다.' });
          return;
        }
        const sender = await User.findOne({ where: { id: room.sender } });
        const receiver = await User.findOne({ where: { id: room.receiver } });
        const proxyData = await Proxy.findOne({
          where: { proxyId: room.proxyId },
        });
        if (!sender || !receiver) {
          socket.emit('roomInfo', { error: '사용자 정보를 찾을 수 없습니다.' });
          return;
        }

        socket.emit('roomInfo', { sender, receiver, proxyData });
      } catch (error) {
        console.error('getRoomInfo 에러:', error);
        socket.emit('roomInfo', { error: '서버에서 오류 발생' });
      }
    });

    socket.on('message', (data) => {
      console.log(data);

      socket.broadcast.emit('smessage', data);
      const chatMessage = new ChatData({
        roomNumber: data.roomNumber,
        sender: data.sender,
        receiver: data.receiver,
        messageType: data.messageType,
        messageContent: data.messageContent,
      });

      chatMessage
        .save()
        .then((savedMessage) => {
          console.log('메시지가 성공적으로 저장되었습니다:', savedMessage);
        })
        .catch((error) => {
          console.error('메시지 저장 중 오류 발생:', error);
        });
    });

    socket.on('reserve', async (data) => {
      const wmEndTime = await WaitMate.findOne({
        where: {
          wmId: data.wmId,
        },
        attributes: ['waitTime', 'endTime'],
      });
      console.log(wmEndTime.endTime);
      // setTimeout실행
    });
  });
}

module.exports = setupSocket;
