(function () {
  var QxEmotion = function (_emotion_btn, _edit) {
    _emotion_btn.on('click', function(){
      var emotion_panel = $('.emotion-panel');
      if(0 == emotion_panel.length) {
        emotion_panel = QxEmotion._CreateEmotionPanel();
        emotion_panel.find('td').on('click', function () {
          var emotion_name = $(this).children('img').attr('alt');
          _edit.val(_edit.val() + '[#' + emotion_name + ']');
          _edit.focus();
          emotion_panel.hide(60);

        });
      }
      if (emotion_panel.is(':visible')) {
        emotion_panel.hide(60);
      } else {
        var emotion_btn = $('#emotion-btn');
        emotion_panel.css("left", emotion_btn.offset().left);
        emotion_panel.css("top", emotion_btn.offset().top - emotion_panel.height() - 5);
        emotion_panel.show(60);
      }
    });
  };

  QxEmotion.Parse = function (_text) {
    var re_ret;
    var re = new RegExp("[[]#(.+?)]","gm");
    var emotion_name = '';
    var emotion_path = '';
    while((re_ret = re.exec(_text)) != null){
      emotion_name = re_ret[1];
      if(undefined != QxEmotion.data[emotion_name]){
        emotion_path = QxEmotion.path + QxEmotion.data[emotion_name];
        _text = _text.replace(re_ret[0], '<img src="' + emotion_path + '" atl="' + emotion_name + '">');
      }
    }
    return _text;
  };

  QxEmotion.path = '/img/qqface/';

  QxEmotion.data = {
    '微笑' : '36.gif',
    '亲亲' : '3.gif',
    '流泪' : '41.gif',
    '调皮' : '44.gif',
    '阴险' : '40.gif',
    '大笑' : '85.gif',
    '晕倒' : '96.gif',
    '白眼' : '80.gif',
    '脸红' : '75.gif',
    '妩媚' : '15.gif',
    '疑问' : '1.gif',
    '尴尬' : '4.gif',
    '啤酒' : '5.gif',
    '吃饭' : '6.gif',
    '灯泡' : '7.gif',
    '困' : '8.gif',
    '抓狂' : '9.gif',
    '奋斗' : '10.gif',
    'ok' : '11.gif',
    '折磨' : '12.gif',
    '委屈' : '13.gif',
    '嘘' : '14.gif',
    '刀' : '16.gif',
    '饥饿' : '17.gif',
    '闭嘴' : '18.gif',
    '爱你' : '19.gif',
    '口罩' : '20.gif',
    '猪头' : '21.gif',
    '难过' : '22.gif',
    '鄙视' : '23.gif',
    '蛋糕' : '24.gif',
    '哈欠' : '25.gif'
  };

  QxEmotion._CreateEmotionPanel = function () {
    //创建panel
    var emotion_html = '<div class="panel panel-default emotion-panel">' +
      '<div class="panel-body"><table class="table-condensed table-bordered"><tbody>';
    var column_count = 0;
    for(var emotion_name in QxEmotion.data){
      //创建tr
      if(column_count == 0) {
        emotion_html += '<tr>';
      }
      //生成img
      var path = QxEmotion.path + QxEmotion.data[emotion_name];
      emotion_html += '<td><img src="'+ path + '" alt="' + emotion_name + '"></td>';
      column_count++;
      //闭合tr
      if(column_count == 8){ //这里可以设定列数
        emotion_html += '</tr>';
        column_count = 0;
      }
    }
    //闭合panel
    emotion_html += '</tbody></table></div></div>';
    $('body').append(emotion_html);

    return $('.emotion-panel');
  };

  window.QxEmotion = QxEmotion;
})();

