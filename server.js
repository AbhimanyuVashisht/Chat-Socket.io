/**
 *
 * Created by av on 14/7/17.
 */


 const express = require('express');
 const path = require('path');
 const http = require('http');
 const socketio = require('socket.io');


 const app = express();
 const server = http.Server(app);
 const io = socketio(server);

 let users = {};
 let chats = [];

 app.use('/', express.static(__dirname + "/public_static"));

 io.on('connection', (socket)=>{
  console.log("New client connected");


  socket.on('login', (username) => {
      console.log('User logged in :' + socket.id);
      users[socket.id] = username;


      socket.emit('logged_in', {username, chats});
     });

  socket.on('new_message', (data) => {
     let chat = users[socket.id] + ':' + data;
     console.log(chat);
     chats.push(chat);
     console.log('msg_recieved');
     io.emit('recv_message', chat);
  });

  socket.on('disconnect', () => {
        console.log('User logged out :' + socket.id);
     });


 });



 server.listen(8000, function(){
     console.log("ServerRunning on http://localhost:8000/");
 });

