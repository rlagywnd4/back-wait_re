
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

   
    socket.on('createRoom', async (data) => {
        try {
          const existingRoom = await Room.findOne({ sender: data.sender, receiver: data.receiver });
    
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
      
    

    socket.on('message', (data)=>{
      console.log(data);
      
      socket.broadcast.emit('smessage', data);
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
      
        })
        .catch((error) => {
          console.error('메시지 저장 중 오류 발생:', error);
          
        });

      
    });
  });
}

module.exports = setupSocket;