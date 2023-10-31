const socketIO = require('socket.io');

function setupSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('새로운 소켓 연결이 이루어졌습니다.');

    socket.on('requestChat', (data) => {
      // 대화 요청 처리 로직
      // 이벤트 핸들러 내용을 이곳에 이동
    });

    // 다른 소켓 이벤트 핸들러 등록
    socket.on('error', ()=>{
        console.error('소켓 연결에 에러가 났습니다');
    })
    socket.on('disconnect', () => {
      console.log('소켓 연결이 종료되었습니다.');
    });
  });
}

module.exports = setupSocket;