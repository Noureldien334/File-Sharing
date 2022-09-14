const express = require('express');
const app = express()
const port = 3000;
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

io.on('connection', (socket) => {
    socket.on('sender-join', (data) => {
        socket.join(data.uid);
    })

    socket.on('reciever-join', (data) => {
        socket.join(data.uid);
        socket.to(data.sender_uid).emit('init', data.uid);
    })

    socket.on('file-meta', (data) => {
        socket.to(data.uid).emit('fs-meta', data.metadata)
    })

    socket.on('fs-start', (data) => {
        socket.to(data.uid).emit('fs-share', {});
    })

    socket.on('file-raw', (data) => {
        socket.to(data.uid).emit('fs-share', data.buffer);
    })
})

app.use(express.static(path.join(__dirname + '/public')));

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
