// scroll chatbody to bottom
function chatBodyToBottom() {
  var height = $('.chat-body').prop('scrollHeight');
  $('.chat-body').prop('scrollTop', height);
}

function addMessage(_name, _time, _content) {
  var msg_list = $('.msg-list-body');
      _content = QxEmotion.Parse(_content);
  var tmp_content = '<div class="clearfix msg-wrap">' +
    '<div class="msg-head">';
  if(_name == $.cookie('chat_nickname')) {
    tmp_content += '<span class="msg-name label label-danger pull-left">';
  } else {
    tmp_content += '<span class="msg-name label label-primary pull-left">';
  }
    tmp_content +=
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
  var msg_list = $('.msg-list-body');
      _content = QxEmotion.Parse(_content);
  var tmp_content = '<div class="clearfix msg-wrap system-msg">' +
    '<div class="msg-head">' +
      '<span class="msg-name label label-default pull-left">' +
      '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;System message</span>' +
      '<span class="msg-time label label-default pull-left">' +
      '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
    '</div>' +
    '<div class="msg-content text-muted">'+ _content + '</div>' +
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
    addUserToList($.cookie('chat_nickname'));
  for(var i = 0; i < _user_list.length; i++) {
    addUserToList(_user_list[i]);
  }
  updateListCount();
}

function updateListCount() {
  var list_count = $('.list-table').find('tr').length + 1;
  $('#list-count').text('Number of online: ' + list_count);
}

//event
function onClickSendMessage() {
  if($.cookie('chat_nickname') == '' || $.cookie('chat_nickname') == null) {
    return $('#login-modal').modal('show');
  }
  var edit = $('#input-edit');
  var content = edit.val();
  if(content == '') {
    return ;
  }
  //broadcast`
  say(content);
  //me
  addMessage($.cookie('chat_nickname'), getLocalHMS(), content);
  edit.val('');
}

function onClickApplyNickname() {
  var name = $('#nickname-edit').val();
  if(name == '') {
    $('#nickname-error').text('Fill in nickname');
    $('#nickname-error').show();
    $('#nickname-edit').focus();
    return ;
  }
  var name_len = getStringLength(name);
  if(name_len < 2 || name_len > 16) {
    $('#nickname-error').html('Nickname length is range 2 - 16');
    $('#nickname-error').show();
    return ;
  }
  if(name == $.cookie('chat_nickname')) {
    $('#nickname-error').html('The same as you');
    $('#nickname-error').show();
    return ;
  }
  changeNickname(name);
}

function onClickChangeNickname() {
  $('#login-modal').modal('show');
}

function onClickEmotion() {
  var emotion_panel = $('.emotion-panel');
  if(emotion_panel.length == 0) {
    emotion_panel = createEmotionPanel();
  }
  if(emotion_panel.is(':visible')) {
    emotion_panel.hide(60);
  } else {
    var emotion_btn = $('#emotion-btn');
    emotion_panel.css('left', emotion_btn.offset().left);
    emotion_panel.css('top', emotion_btn.offset().top - emotion_panel.height() - 5);
    emotion_panel.show(60);
  }
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

QxEmotion($('#emotion-btn'), $('#input-edit'));
