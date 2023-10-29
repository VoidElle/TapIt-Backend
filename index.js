const server = require('http').createServer();
const io = require('socket.io')(server);

io.on("connection", socket => {
    console.log("CONNECTED");
});

server.listen(3000);