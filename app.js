var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

users = {};

function checkIfNotTaken(user) {
    for (var u in users) {
        console.log("Checking " + u);
        if (user.s == users[u].s) {
            console.log("taken");
            return true;
        }
    }
};

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
    socket.on('login', function (user) {
        var taken = checkIfNotTaken(user);
        if(!taken) {
        socket.emit('loginSuccess', null);
        users[socket.id] = user;
        console.log(users);
        io.sockets.emit('join', user.n);
        } else socket.emit('loginError');
    });

    socket.on("im", function (msg) {
        io.emit("im", msg);
    });

    socket.on("disconnect", function () {
        delete users[socket.id];
        console.log(users);
        io.sockets.emit('updateUL', users);
    });
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});