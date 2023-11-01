
const socketIO = require('socket.io');
const {ChatData, Room} = require('./schema');
const {ChatRoom, Proxy, WaitMate, User, Review, LikeWait} = require('./models');

function setupSocket(server ) {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ["GET","POST"],
    }
  });
  console.log('소켓 시작');
  io.on('connection', (socket) => {
    console.log('새로운 소켓 연결이 이루어졌습니다.');

    socket.on('requestChatRoom', (data) => {
        // 웨메 및 프록시 정보 추출
        const { wmId, proxyId } = data;
      
        // 방 정보를 데이터베이스에 저장 (Room 모델 사용)
        const newRoom = new Room({ wmId, proxyId });
        newRoom.save();
      
        // 웨메와 프록시를 해당 방에 연결
        socket.join(newRoom._id);
      
        // 클라이언트에 채팅 방 생성 완료 메시지 보내기
        socket.emit('chatRoomCreated', { roomId: newRoom._id });

        // 클라이언트에 채팅 생성 메세지 보내기
        socket.to(newRoom._id).emit('AllMessage', {
            message : '안녕하세요. 바른말 고운말만 사용해주세요~!'
        })
      });

      socket.on('chatting', (data) => {
        try {
          // 데이터베이스에 채팅 메시지 저장
          const chatData = new ChatData({
            room,
            sender,
            receiver,
            messageType,
            messageContent,
          });
          chatData.save();
          // 채팅 메시지를 다른 클라이언트에게 보내기 (broadcast 사용)
        socket.broadcast.emit('chatting', data);
        } catch (error) {
          console.error('채팅 메시지 저장 중 오류 발생: ', error);
        }
      });
  });
}

module.exports = setupSocket;