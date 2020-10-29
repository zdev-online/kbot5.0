const { io } = require('../index');

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('ping', data => {
        socket.emit('ping', (new Date().getTime() - Number(data)) / 1000);
    });

    socket.on('stats-page', () => {});
});