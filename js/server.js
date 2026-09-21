const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 최근 채팅 메시지를 저장할 배열 (서버에 임시 저장)
const messageHistory = [];

app.use(express.static(path.join(__dirname, '..')));

io.on('connection', (socket) => {
    console.log('새로운 유저가 접속했습니다!');

    // 1. 새 유저가 접속하면 지금까지 쌓인 채팅 기록을 전달해 줍니다.
    socket.emit('loadHistory', messageHistory);

    // 2. 클라이언트가 메시지를 보냈을 때
    socket.on('sendMessage', (data) => {
        const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        
        const messageData = {
            user: data.user,
            message: data.message,
            time: time
        };

        // 채팅 기록 배열에 저장 (최대 100개까지만 유지)
        messageHistory.push(messageData);
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }

        // 접속 중인 모든 유저에게 메시지 전송
        io.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
        console.log('유저가 나갔습니다.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 디스코드 서버 가동 중! 포트: ${PORT}`);
});