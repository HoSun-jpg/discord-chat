const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // 경로 처리를 위해 추가

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// js 폴더보다 한 단계 상위 폴더(Discord 루트)의 index.html, css 등을 제공하도록 설정
app.use(express.static(path.join(__dirname, '..')));

// 유저가 웹에 접속했을 때
io.on('connection', (socket) => {
    console.log('새로운 유저가 접속했습니다!');

    // 클라이언트가 메시지를 보냈을 때
    socket.on('sendMessage', (data) => {
        const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        io.emit('receiveMessage', {
            user: data.user,
            message: data.message,
            time: time
        });
    });

    socket.on('disconnect', () => {
        console.log('유저가 나갔습니다.');
    });
});

// 기존: server.listen(3000, () => { ... });

// 변경: 클라우드 포트 환경변수(process.env.PORT)를 우선 사용하도록 수정
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 디스코드 서버가 가동되었습니다! 포트: ${PORT}`);
});