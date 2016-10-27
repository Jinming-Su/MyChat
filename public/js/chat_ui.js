var g_nickname = '';

// scroll chatbody to bottom
function chatBodyToBottom() {
  var height = $('.chat-body').prop('scrollHeight');
  $('.chat-body').prop('scrollTop', height);
}

function addMessage(_name, _time, _content) {
  var msg_list = $('.msg-list-body');
  var tmp_content = '<div class="clearfix msg-wrap">' +
    '<div class="msg-head">' +
      '<span class="msg-name label label-primary pull-left">' +
      '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + _name + '</span>' +
      '<span class="msg-time label label-default pull-left">' +
      '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
    '</div>' +
    '<div class="msg-content">'+ _content + '</div>' +
  '</div>';
  msg_list.append(tmp_content);
  chatBodyToBottom();
}

function addServerMessage(_time, _content) {
  var msg_list = $('.msg-list-bogy');
  var tmp_content = '<div class="clearfix msg-wrap">' +
    '<div class="msg-head">' +
      '<span class="msg-name label label-primary pull-left">' +
      '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;System message</span>' +
      '<span class="msg-time label label-default pull-left">' +
      '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
    '</div>' +
    '<div class="msg-content">'+ _content + '</div>' +
  '</div>';
  msg_list.append(tmp_content);
  chatBodyToBottom();
}

function removeUserFromList(_user) {
  $('.list-table tr').each(function() {
    if(_user == $(this).find('td').text()) {
      $(this).remove();
    }
  });
}

function addUserToList(_user) {
  var tmp_content = '<tr><td>' + _user + '</td></tr>'
  $('.list-table').append(tmp_content);
}

function useUserList(_user_list) {
  $('.list-table').html('');
  for(var i = 0; i < _user_list.length; i++) {
    addUserToList(_user_list[i]);
  }
  updateListCount();
}

function updateListCount() {
  var list_count = $('.list-table').find('tr').length;
  console.log('list_count: ' + list_count);
  if(g_nickname != '' && g_nickname != null) {
    list_count = list_count + 1;
  }
  $('#list-count').text('Number of online: ' + list_count);
}

//event
function onClickSendMessage() {
  if(g_nickname == '') {
    return $('#login-modal').modal('show');
  }
  var edit = $('#input-edit');
  if(edit.val() == '') {
    return ;
  }
  //broadcast`
  say(edit.val());
  //me
  addMessage('Me', getLocalHMS(), edit.val());
  edit.val('');
}

function onClickApplyNickname() {
  if($('#nickname-edi').val() == '') {
    $('#nickname-error').text('Fill in nickname');
    $('#nickname-error').show();
    $('#nickname-edit').focus();
    return ;
  }
  changeNickname($('#nickname-edit').val());
}

function onClickChangeNickname() {
  $('#login-modal').modal('show');
}

//event response
$('div[role="dialog"]').on('show.bs.modal', function(){
  $(this).css({
    "display": "block",
    "margin-top": function() {
      return ($(this).height()/3);
    }
  });
});

$('#login-modal').on('show.bs.modal', function(e) {
  $('#nickname-edit').val('');
  $('#nickname-error').hide();
});

$('#login-modal').on('shown.bs.modal', function(e) {
  $('#nickname-edit').focus();
});

document.onkeydown = function(event) {
  //enter
  if(event.keyCode == 13) {
    if(document.activeElement.id == 'input-edit') {
      onClickSendMessage();
    } else if(document.activeElement.id == 'nickname-edit') {
      onClickApplyNickname();
    }
  }
};
