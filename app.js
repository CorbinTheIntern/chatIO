var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

users = {};

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
    console.log("A user has connected.");

    socket.on('login', function (user) {
        if (users) {
            for (var i = 0; i < users.length; i++) {
                if (user.s == users[i].s) {
                    socket.emit('loginError');
                    return null;
                }
            }
        }
        socket.emit('loginSuccess', null);
        users[socket.id] = user;
        console.log(users);
        io.sockets.emit('join', user.n);
    });

    socket.on("im", function (msg) {
        io.emit("im", msg);
    });

    socket.on("disconnect", function () {
        delete users[socket.id];
        io.sockets.emit('updateUL', users);
    });
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});
