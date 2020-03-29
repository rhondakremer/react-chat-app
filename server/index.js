const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const app = express();

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');
app.use(cors());


const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);
        // let user know he/she has joined
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}!`})
        // let everyone else know user has joined
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined.`})
        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback();
    });
    // waiting for message from frontend
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left the chat.` })
        }
        console.log('Loser user has left');
    })
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}!`))