(function() {
  'use strict';

  var channel, username;

  var nodeLiveChat = angular.module('nodeLiveChat', [
    'ngRoute'
  ]);

  nodeLiveChat.config(['$httpProvider', '$routeProvider', '$locationProvider',
    function($httpProvider, $routeProvider, $locationProvider) {
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      $routeProvider.when('/', {
          template: '<ng-include src="path"></ng-include>',
          controller: 'ServerSideController'
      });
        
      $routeProvider.when('/:path*', {
          template: '<ng-include src="path"></ng-include>',
          controller: 'ServerSideController'
      });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }
  ]);

  nodeLiveChat.run(function($rootScope, $location) {
    $rootScope.historyBack = function() {
      window.history.back();
    };

    if ($location.path().search('chat') > -1) {
      $location.path('/');
    }
  });

  nodeLiveChat.controller('ServerSideController', function($scope, $routeParams) {
    if ($routeParams.path !== undefined) {
      $routeParams.path = '/' + $routeParams.path;
    }

    $scope.path = $routeParams.path || '/';
  });

  nodeLiveChat.controller('JoinRoomFormCtrl', function($scope, $location) {
    $scope.username = '';

    $scope.usernameValid = true;
    $scope.inputsInvalid = true;

    var pattern = /^[0-9a-zA-Z_]+$/;

    $scope.validate = function() {
      var usernameEmpty = ($scope.username + '').length === 0;
      var usernameValid = pattern.test($scope.username);

      $scope.usernameValid = usernameEmpty || usernameValid;
      $scope.inputsInvalid = usernameEmpty || !usernameValid;
    };

    $scope.login = function() {
      username = $scope.username;

      $location.path('/chat');
    };
  });

  nodeLiveChat.controller('ChatWindowCtrl', function($scope, $location) {
    var chat = new Chat(socketUrl);
    var body = document.querySelector('body');
    var messagesDom = document.getElementById('messages');
    var messages = angular.element(messagesDom);

    var getMessageElement = function(username, message) {
      var item = angular.element('<li />');
      var usernameEl = angular.element('<strong />');
      var messageEl = angular.element('<span />');
      
      usernameEl.text(username);
      messageEl.text(message);
      
      item.append(usernameEl).append(messageEl);
      return item;
    };

    var scrollToBottom = function() {
      body.scrollTop = body.scrollHeight;
    };

    chat.login(channel, username);

    chat.onServerMessage(function(message) {
      var item = getMessageElement('', message);
      item.addClass('server');

      messages.append(item);
    });
    
    chat.onType(function(username, message) {
      var item = angular.element(
        messagesDom.querySelector('[data-username="' + username + '"]')
      );

      if (item.length && !message) {
        item.remove();
      }

      if (item.length) {
        item.find('span').text(message);
        return;
      }

      if (!message) {
        return;
      }

      item = getMessageElement(username, message);
      item.addClass('typing').attr('data-username', username);
      
      messages.append(item);
      scrollToBottom();
    });

    chat.onReceive(function(username) {
      var item = angular.element(
        messagesDom.querySelectorAll('[data-username="' + username + '"]')
      );

      item.removeClass('typing');
      item.removeAttr('data-username');
    });

    chat.onChatDisconnect(function(reason) {
      $location.path('/');
      $scope.$apply();

      window.alert(reason);
    });

    chat.onDisconnect(function() {
      $location.path('/');
      $scope.$apply();
    });

    $scope.type = function() {
      chat.type($scope.message);
    };

    $scope.send = function() {
      chat.send();

      messages.append(getMessageElement(username, $scope.message));
      scrollToBottom();

      $scope.message = '';
    };
  });

}());