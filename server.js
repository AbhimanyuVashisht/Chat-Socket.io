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

      socket.join(username);

      let join = username + ' Joined';
      socket.emit('logged_in', {username,chats});
      io.emit('join',join);
      chats.push(join);
     });

  socket.on('new_message', (data) => {

      if(data.charAt(0) === '@'){
          let sendTo = data.substr(1).split(' ')[0];
          let chat = users[socket.id] + ':' + data;

          io.to(sendTo).emit('recv_message', chat);
      }
      else{
          let chat = users[socket.id] + ':' + data;
          chats.push(chat);
          console.log('msg_recieved');
          io.emit('recv_message', chat);
      }

  });

  socket.on('disconnect', () => {
        console.log('User logged out :' + socket.id);
        let chat = users[socket.id] + ': disconnected';
        chats.push(chat);
        io.emit('recv_message',chat);
     });
 });



 server.listen(8000, function(){
     console.log("ServerRunning on http://localhost:8000/");
 });

