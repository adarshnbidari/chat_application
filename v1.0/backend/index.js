const express = require('express');

const path = require('path');

const hbs = require('hbs');

const http = require('http');

const socketio = require('socket.io');

const app = express();



const server = http.createServer(app);

const io = socketio(server);

app.set('view engine', 'hbs');

// const publicDir=path.join(__dirname,'./public');

app.use(express.static(path.join(__dirname, 'views')));


app.get('/', (req, res) => {

    res.render('index');

});


app.get('/msg', (req, res) => {

    res.render('users');

});



io.on("connection", connection => {

    var username, person;

    // 

    var saveUserInput = require('./chatBackend/index.js');

    connection.on("message", async (msg) => {


        let roomName = createRoomName(username, person);

        let msg_seen_id = Math.floor(Math.random() * 100000) + new Date().getMilliseconds();

        msg.msg_seen_id = msg_seen_id;

        io.to(roomName).emit("message", msg);

        let messages = {

            msgData: msg.msg,
            sentFrom: msg.user,
            msg_seen_id,
            time: msg.time

        };

        saveUserInput(roomName, [msg.user, msg.person], messages);


    });



    connection.on("msgDelivered", data => {

        console.log(`updating message status for msg_id ${data.msg_seen_id}`);

        const update_msg_status = require('./chatBackend/update_msg_status/index.js');

        let roomName = createRoomName(username, person);

        update_msg_status(roomName, data);


    });





    connection.on("chatInfo", data => {

        username = data.me;
        person = data.you;

        let roomName = createRoomName(username, person);


        connection.join(roomName, () => {
            console.log(`${username} joined the room ${roomName}`);
        });

        let joinedMessage = `${username} you are connected to the room ${roomName}`;

        let joinedData = {
            msg: joinedMessage,
            user: username,
            time: data.time
        };

        connection.emit("message", joinedData);

    });


    connection.on('disconnect', () => {


        let roomName = createRoomName(username, person);

        connection.broadcast.to(roomName).emit("message", `${username} left chat`);

    });


});


function createRoomName(usr1, usr2) {

    return [usr1, usr2].sort().join('');

}




server.listen(80, () => {
    console.log('Server running at localhost');

});

