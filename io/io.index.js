const { io } = require('../index');

io.on('connection', (socket) => {
    socket.on('ping', clientPing => {
        socket.emit('ping', new Date().getTime());
    });
});