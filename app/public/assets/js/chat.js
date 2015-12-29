/*!
 * node-live-chat
 * See messages as they are typed.
 *
 * @author    Raphael Marco
 * @link      http://pinodex.github.io
 * @license   MIT
 */

(function() {

  'use strict';

  var Chat = function Chat(socketUrl) {
    var events = {
      onServerMessage: function() {},
      onType: function() {},
      onReceive: function() {},
      onChatDisconnect: function() {},
      onDisconnect: function() {}
    };

    this.socket = io(socketUrl);

    this.onServerMessage = function(callback) {
      events.onServerMessage = callback;
    };
    
    this.onType = function(callback) {
      events.onType = callback;
    };

    this.onReceive = function(callback) {
      events.onReceive = callback;
    };

    this.onDisconnect = function(callback) {
      events.onDisconnect = callback;
    };

    this.onChatDisconnect = function(callback) {
      events.onChatDisconnect = callback;
    };

    this.socket.on('message:server', function(message) {
      events.onServerMessage(message);
    });

    this.socket.on('message:type', function(data) {
      console.log(data);
      events.onType(data.username, data.message);
    });

    this.socket.on('message:receive', function(username) {
      events.onReceive(username);
    });

    this.socket.on('chat:disconnect', function(reason) {
      events.onChatDisconnect(reason);
    });

    this.socket.on('disconnect', function() {
      events.onDisconnect();
    });
  };

  Chat.prototype.login = function(username, callback) {
    this.socket.emit('chat:login', {
      username: username
    });

    if (callback) {
      this.socket.on('chat:login', callback);
    }
  };

  Chat.prototype.type = function(message) {
    this.socket.emit('message:type', message);
  };

  Chat.prototype.send = function() {
    this.socket.emit('message:send');
  };

  window.Chat = Chat;

}());