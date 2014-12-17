var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(8080);

var chat = io
    .of('/chat')
    .on("connection", function(socket){
        socket.emit("chat", {msg: "Chat message"});
    });
    
var news = io
    .of('/news')
    .on("connection", function(socket){
        socket.emit("news", {msg: "News message"});
    });

io.on("connection", function(socket) {
    socket.broadcast.emit("news", {msg: "User connected"});
    socket.on('my other event', function (data) {
        console.log(data);
    });
})

app.get("/socket/send", function(req, res, next) {
    io.sockets.emit("news", {msg: "This is custom message"});
    next("Message send");
})