var socket = io.connect('http://localhost:3000');

socket.on('server_message', function(_message) {
  addServerMessage(getLocalHMS(), _message);
});

socket.on('need_nickname', function() {
  if($.cookie('chat_nickname') == null) {
    $('#login-modal').modal('show');
  } else {
    changeNickname($.cookie('chat_nickname'));
  }
});

socket.on('change_nickname_error', function(_error_msg) {
  console.log('change_nickname_error:' + _error_msg);
  $("#nickname-error").text(_error_msg);
  $("#nickname-error").show();
  $("#nickname-edit").focus();
});

socket.on('change_nickname_done', function(_old_name, _new_nickname) {
  console.log('change_nickname_done(' + _new_nickname + ',' + _old_name + ')');
  $.cookie('chat_nickname', _new_nickname);
  $("#login-modal").modal('hide');
  $("#my-nickname").html('Nickname: ' + _new_nickname);
  if(_old_name != null && _old_name != '') {
    addServerMessage(getLocalHMS(), '[' + _old_name + '] change as [' + _new_nickname + ']');
  }
  updateListCount();
});

socket.on('say_done', function(_nickname, _content) {
  console.log('user_say(' + _nickname + ', ' + _content + ')');
  addMessage(_nickname, getLocalHMS(), _content);
});

socket.on('user_list', function(_list) {
  console.log('user_list(' + _list + ')');
  useUserList(_list);
});

socket.on('user_change_nickname', function(_old_nickname, _new_nickname) {
  console('user_change_nickname(' + _old_nickname + ', ' + _new_nickname + ')');
  removeUserFromList(_old_nickname);
  addUserToList(_new_nickname);
  addServerMessage(getLocalHMS(), '[' + _old_nickname + '] change as [' + _new_nickname + ']');
});

socket.on('user_join', function(_nickname) {
  console.log('user_join(' + _nickname + ')');
  addUserToList(_nickname);
  updateListCount();
  addServerMessage(getLocalHMS(), '[' + _nickname + '] come in');
});

socket.on('user_quit', function(_nickname) {
  console.log('user_quit(' + _nickname + ')');
  removeUserFromList(_nickname);
  updateListCount();
  addServerMessage(getLocalHMS(), '[' + _nickname + '] go out');
});

socket.on('user_say', function(_nickname, _content) {
  console.log('user_say(' + _nickname + ', ' + _content + ')');
  addMessage(_nickname, getLocalHMS(), _content);
});

function changeNickname(_nickname) {
  socket.emit('change_nickname', _nickname);
};

function say(_content) {
  socket.emit('say', _content);
};
