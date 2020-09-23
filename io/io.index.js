const { io } = require('../index');


io.on('connection', (socket) => {
    socket.on('disconnect', (reason) => {});
});