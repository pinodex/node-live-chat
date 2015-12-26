/*!
 * node-live-chat
 * See messages as they are typed.
 *
 * @author    Raphael Marco
 * @link      http://pinodex.github.io
 * @license   MIT
 */

'use strict';

var chat = function Chat(io) {
  var users = {};
  var pattern = /^[0-9a-zA-Z_]+$/;

  io.on('connection', function(socket) {
    socket.on('disconnect', function() {
      var username = users[socket.id];
      
      if (username) {
        io.emit('message:server', username + ' left the chat');
        delete users[socket.id];
      }
    });

    socket.on('chat:login', function(data) {
      if (!pattern.test(data.username)) {
        socket.emit('chat:disconnect', 'Username contains invalid characters.');
        return;
      }

      for (var i in users) {
        if (data.username.toLowerCase() === users[i].toLowerCase()) {
          socket.emit('chat:disconnect', 'Username already in use.');
          
          return;
        }
      }

      users[socket.id] = data.username;
      
      socket.broadcast.emit('message:server', data.username + ' joined the chat');
      
      socket.emit('chat:login');
      socket.emit('message:server', 'Start chatting by typing in the message box below.');
    });

    socket.on('message:type', function(message) {
      var username = users[socket.id];

      if (!username) {
        return;
      }

      socket.broadcast.emit('message:type', {
        username: username,
        message: message
      });
    });

    socket.on('message:send', function() {
      var username = users[socket.id];

      if (!username) {
        return;
      }

      io.emit('message:receive', username);
    });
  });
};

module.exports = chat;