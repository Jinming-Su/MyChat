var io = require('socket.io')();
var nickname_list = new Array();

function hasNickname(_nickname) {
  for(var i = 0; i<nickname_list.length; i++) {
    if(nickname_list[i] == _nickname) {
      return true;
    }
  }
  return false;
}

function removeNickname(_nickname) {
  for(var i = 0; i < nickname_list.length; i++) {
    if(nickname_list[i] == _nickname) {
      nickname_list.splice(i, 1);
    }
  }
}

io.on('connection', function(_socket) {
  console.log(_socket.id + ': connection');
  _socket.emit('user_list', JSON.stringify(nickname_list));
  _socket.emit('server_message', 'Welcome');

  _socket.on('disconnect', function() {
    console.log(_socket.id + ': disconnect');
    if(_socket.nickname != null && _socket.nickname != '') {
      _socket.broadcast.emit('user_quit', _socket.nickname);
      removeNickname(_socket.nickname);
    }
  });

  _socket.on('change_nickname', function(_nickname) {
    _nickname = _nickname.trim();
    console.log(_socket.id + ': change_nickname(' + _nickname + ')');
    //cal Chinese
    var name_len = _nickname.replace(/[^\u0000-\u00ff]/g,"tt").length;
    if(name_len < 6 || name_len > 16) {
      return _socket.emit('change_nickname_error', 'Nickname length is range 6 - 16');
    }
    if(_socket.nickname == _nickname) {
      return _socket.emit('change_nickname_error', 'The same as you');
    }
    if(hasNickname(_nickname)) {
      return _socket.emit('change_nickname_error', 'The nickname is existed');
    }

    var old_name = '';
    if(_socket.nickname != null && _socket.nickname != '') {
      old_name = _socket.nickname;
      removeNickname(old_name);
    }

    nickname_list.push(_nickname);
    _socket.nickname = _nickname;
    console.log('nickname_list: ' + nickname_list);

    _socket.emit('change_nickname_done', old_name, _nickname);
    if(old_name == '') {
      _socket.broadcast.emit('user_join', _nickname);
    } else {
      _socket.broadcast.emit('user_change_nickname', old_name, _nickname);
    }

  });

  _socket.on('say', function (_content) {
    _content = _content.trim();
    console.log(_socket.id + ': say(' + _content + ')');
    _socket.broadcast.emit('user_say', _socket.nickname, _content);
  });
});

exports.listen = function(_server) {
  io.listen(_server);
}
