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
const Reservation = require('./models/Reservation');

let timer; //웨메가 끝나기 전에 소켓 연결이 끊겼을 때를 대비한 변수

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: [`http://localhost:3000`],
      methods: ["GET","POST","PATCH","DELETE"],
    }
  });
  console.log('소켓 시작');

  io.on('connection', async (socket) => {
    console.log('새로운 소켓 연결이 이루어졌습니다.');

  
    
      socket.on('createRoom', async (data) => {
        try {
          const existingRoom = await Room.findOne({ wmId: data.wmId, proxyId: data.proxyId });
    
          if (existingRoom) {
            
            socket.emit('roomExists', { roomNumber: existingRoom.roomNumber });
          } else {
           
            const roomNumber = Date.now();
            console.log(roomNumber + '룸넘버입니다');
    
            const newRoom = new Room({
              sender: data.sender,
              receiver: data.receiver,
              proxyId: data.proxyId,
              wmId : data.wmId,
              roomNumber: roomNumber,
            });
    
            await newRoom.save();
            
            socket.emit('roomCreated', { roomNumber });
            socket.join(`room_${roomNumber}`);
          }
        } catch (err) {
          console.error(err);
    });

    socket.on('getRoomInfo', async (roomNumber) => {
      try {
        const room = await Room.findOne({ roomNumber });

        console.log('룸의 정보값',room);
        if (!room) {
          socket.emit('roomInfo', { error: '채팅방을 찾을 수 없습니다.' });
          return;
        }
        const sender = await User.findOne({ where: { id: room.sender } });
        const receiver = await User.findOne({ where: { id: room.receiver } });


        const proxyData = await Proxy.findOne({ where: {proxyId: room.proxyId}});

        const wmData = await WaitMate.findOne({where : {wmId : room.wmId}})
        console.log('웨메 정보값!', wmData);
        console.log(proxyData);
        if (!sender || !receiver) {
          socket.emit('roomInfo', { error: '사용자 정보를 찾을 수 없습니다.' });
          return;
        }
        socket.emit('roomInfo', { sender, receiver, proxyData, wmData});

      } catch (error) {
        console.error('getRoomInfo 에러:', error);
        socket.emit('roomInfo', { error: '서버에서 오류 발생' });
      }
    });

    socket.on('message', (data) => {
      console.log('아하' + data);

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

    ///////////////////////////////////////////////////////////////////////////////////////
    // 예약중 으로 상태가 변경되었을때
    socket.on('reserve', async (data) => {
      console.log('reserve'); // 나중에 지울 것
      // data는 wmId,proxyId, id(proxy의 id)를 갖고 있음
      const wmEndTime = await WaitMate.findOne({
        where: {
          wmId: data.wmId,
        },
        attributes: ['waitTime', 'endTime'],
      });
      // 예약 생성
      const reservation = await Reservation.create({
        wmId: data.wmId,
        proxyId: data.proxyId,
        state: true,
      });
      // 웨메 예약중으로 상태 변경
      const updateWM = await WaitMate.update(
        {
          state: 'reserved',
        },
        {
          where: {
            wmId: data.wmId,
          },
        }
      );
      console.log(wmEndTime.endTime);
      // setTimeout실행
      const alarmTime = new Date();
      alarmTime.setDate(wmEndTime.waitTime);
      alarmTime.setTime(wmEndTime.endTime);
      timer = setTimeout(async () => {
        socket.emit('review', id); // proxy의 id
        const changeState = await Reservation.update(
          {
            state: false,
          },
          {
            where: {
              wmId,
            },
          }
        );
        const updateWM = await WaitMate.update(
          {
            state: 'completed',
          },
          {
            where: {
              wmId: data.wmId,
            },
          }
        );
      }, alarmTime - Date.now());
    });
    // 예약중에서 다시 취소했을때
    socket.on('deleteReservation', async (data) => {
      console.log('deleteReservation'); // 나중에 지울 것
      if (timer) {
        clearTimeout(timer);
      }
      const deleteReservation = await Reservation.delete({
        where: {
          wmId: data.wmId,
        },
      });
      // 웨메 상태 변경
      const updateWM = await WaitMate.update(
        {
          state: 'active',
        },
        {
          where: {
            wmId: data.wmId,
          },
        }
      );
    });

    // 다시 연결 되었을 때를 대비한 코드
    // 가지고 있는 데이터 id
    socket.on('login', async (data) => {
      console.log('reviewLogin'); // 나중에 지울 것
      const wmEndTime = await WaitMate.findAll({
        where: {
          wmId: data.id,
          waitTime: {
            [Op.gte]: Date.now(), // 현재 날짜이후만 가져오기
          },
        },
        attributes: ['waitTime', 'endTime'],
      });
      wmEndTime.array.forEach(async (element) => {
        const reservation = await Reservation.findOne({
          where: {
            wmId: wmEndTime.wmId,
            state: true,
          },
        });
        const findProxy = await Proxy.findOne({
          where: {
            proxyId: reservation.proxyId,
          },
        });
        if (reservation) {
          const alarmTime = new Date();
          alarmTime.setDate(wmEndTime.waitTime);
          alarmTime.setTime(wmEndTime.endTime);
          if (alarmTime > Date.now()) {
            // 다시 로그인시 alarmTime이 안지난 시점이면
            timer = setTimeout(async () => {
              socket.emit('review', findProxy.id); // proxy의 id
              const changeState = await Reservation.update(
                {
                  state: false,
                },
                {
                  where: {
                    wmId,
                  },
                }
              );
              const updateWM = await WaitMate.update(
                {
                  state: 'completed',
                },
                {
                  where: {
                    wmId: data.wmId,
                  },
                }
              );
            }, alarmTime - Date.now());
          } else {
            // alarmTime이 지난 시점이면
            const closeReservation = await Reservation.update(
              {
                state: false,
              },
              {
                where: {
                  wmId,
                },
              }
            );
            const updateWM = await WaitMate.update(
              {
                state: 'completed',
              },
              {
                where: {
                  wmId: data.wmId,
                },
              }
            );
          }
        }
      });
    });

    // 연결 해제시
    socket.on('disconnect', () => {
      if (timer) {
        clearTimeout(timer);
      }
    });
  });
}

module.exports = setupSocket;
