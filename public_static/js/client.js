/**
 * Created by av on 14/7/17.
 */


let socket = io();

$(function () {

    let newMsg = $('#newmsg');
    let sendMsgBtn = $('#sendmsg');
    let msgList = $('#msglist');

    let username = $('#username');
    let loginBtn = $('#login');

    let loginFrame = $('#login-container');
    let channelFrame = $('#channel-container');

    loginBtn.click(function () {
        socket.emit('login', username.val());
    });

    socket.on('logged_in', (data) => {

        loginFrame.hide();
        channelFrame.show();
        console.log('logged_in');
        let user_login = data.username;
        for(let chat of data.chats){
            msgList.append($(`<li>${chat}</li>`));
        }
    });

    socket.on('join', (data) => {
        msgList.append($(`<li>${data}</li>`));
    });


    sendMsgBtn.click(function () {
        console.log('Message Sent');
       socket.emit('new_message', newMsg.val());
    });

    socket.on('recv_message', (data) => {
        console.log('msg_recvd');
        msgList.append($(`<li>${data}</li>`));
    });


    socket.on('disconnect', () => {
        console.log('User logged out :' + socket.id);
        channelFrame.hide();
        loginFrame.show();
        msgList.empty();
    });
});