
const socketIO = require('socket.io');
const ChatData = require('./schema/ChatData');
const Room = require('./schema/Room');
const {ChatRoom, Proxy, WaitMate, User, Review, LikeWait} = require('./models');

function setupSocket(server ) {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ["GET","POST","PATCH","DELETE"],
    }
  });
  console.log('소켓 시작');
  io.on('connection', (socket) => {
    console.log('새로운 소켓 연결이 이루어졌습니다.');

    socket.on('message', (data)=>{
      console.log(data);

      const chatMessage = new ChatData({
        room: data.room,
        sender: data.sender,
        receiver: data.receiver,
        messageType: data.messageType,
        messageContent: data.messageContent,
      });
  
      chatMessage.save()
        .then((savedMessage) => {
          console.log('메시지가 성공적으로 저장되었습니다:', savedMessage);
          // 저장 성공 시, 다른 클라이언트로 메시지를 전송할 수 있습니다.
        })
        .catch((error) => {
          console.error('메시지 저장 중 오류 발생:', error);
          // 저장 오류 시, 적절한 에러 핸들링
        });
    });
  });
}

module.exports = setupSocket;