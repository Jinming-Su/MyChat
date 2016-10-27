var socket = io.connect('http://localhost:3000');

socket.on('server_message', function(_message) {
  addServerMessage(getLocalHMS(), _message);
});

socket.on('change_nickname_error', function(_error_msg) {
  console.log('change_nickname_error:' + _error_msg);
  $("#nickname-error").text(_error_msg);
  $("#nickname-error").show();
  $("#nickname-edit").focus();
});

socket.on('change_nickname_done', function(_old_name, _new_nickname) {
  console.log('change_nickname_done(' + _new_nickname + ',' + _old_name + ')');
  g_nickname = _new_nickname;
  $("#login-modal").modal('hide');
  $("#my-nickname").text('Nickname: ' + _new_nickname);
  if(_old_name != null && _old_name != '') {
    addServerMessage(getLocalHMS(), '[' + _old_name + '] change as [' + _new_nickname + ']');
  }
  updateListCount();
});

socket.on('say_error', function(_error_msg){
  console.log('say_error:' + _error_msg);
});

socket.on('say_done', function() {
  console.log('say_done');
});

socket.on('user_list', function(_list) {
  console.log('user_list(' + _list + ')');
  var user_list = eval('(' + _list + ')');
  useUserList(user_list);
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
});

socket.on('user_quit', function(_nickname) {
  console.log('user_quit(' + _nickname + ')');
  removeUserFromList(_nickname);
  updateListCount();
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
