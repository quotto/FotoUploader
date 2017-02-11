var fotouploader_status_flg = true;
$(document).ready(function(){
  "use strict";
  var $upload_modal = $('<div id="fotouploader-modal-background" role="dialog"></div>');
  $upload_modal.on('click',function(){
    if(fotouploader_status_flg) {
      $('#message-modal').fadeOut();
      $(this).fadeOut();
    }
  });
  $upload_modal.on('mousemove',function(){
    if(fotouploader_status_flg) {
      $('#message-modal').fadeOut();
      $(this).fadeOut();
    }
  });
  $('body').append($upload_modal);

  var $message_modal = $('<div id="message-modal" class="fotouploader-modal-content"></div>');
  var $upload_message = $('<p class="fotouploader-message"></p>');
  $message_modal.append($upload_message);
  $upload_modal.append($message_modal);

  var $scale_modal = $('<div id="scale-modal" class="fotouploader-modal-content"></div>');
  var $scale_upload_input = $('<div><input id="fotouploader-scale" type="text" name="scale" placeholder="縮尺率を入力"></input>%</div>');
  var $scale_upload_button = $('<button class="fotouploader-button" name="submit">アップロード</button>');
  $scale_upload_button.on('click',function(){
    var $scale_modal = $('#scale-modal');
    var scale = $scale_modal.find('input[name="scale"]').val();
    if (scale.match(/\D+/) || scale < 10 || scale > 200) {
      // エラーメッセージが出力されている場合はそのまま
      var $error_message = $scale_modal.find('.fotouploader-message-error');
      if($error_message.length == 0) {
        $error_message = $('<p class="fotouploader-message fotouploader-message-error">縮小率は10〜200の範囲で入力して下さい</p>');
        $('#scale-modal').prepend($error_message);
      }
    } else {
      $scale_modal.fadeOut();
      chrome.runtime.sendMessage({scale: scale,src: $('#fotouploader-src').val()});
    }
  });
  var $scale_cancel_button = $('<button class="fotouploader-button" name="cancel">キャンセル</button>');
  $scale_cancel_button.on('click',function() {
    $('#fotouploader-modal-background').fadeOut();
  });

  $scale_modal.append($('<hidden id="fotouploader-src"></hidden>'));
  $scale_modal.append($scale_upload_input);
  $scale_modal.append($('<div class="scale-buttons"/>').append($scale_upload_button));
  $scale_modal.append($('<div class="scale-buttons"/>').append($scale_cancel_button));
  $upload_modal.append($scale_modal);


  chrome.runtime.onMessage.addListener(function(message) {
    $(this).blur();
    $('#fotouploader-modal-background').fadeIn();

    var json_message = JSON.parse(message);
    var message_type = json_message['type'];
    if (message_type == "notice") {
      fotouploader_status_flg = true;
      var $message_modal = $('#message-modal');
      $message_modal.find('p').text(json_message['message']);
      $message_modal.fadeIn();
    } else {
      fotouploader_status_flg = false;
      var $scale_modal = $('#scale-modal');

      // エラーメッセージが出っぱなしの場合は削除する
      var $error_message = $scale_modal.find('.fotouploader-message-error');
      if ($error_message.length > 0) {
        $error_message.remove();
      }
      $('#fotouploader-src').val(json_message['src']);
      $('#fotouploader-scale').val('');
      $scale_modal.fadeIn();
      $('#fotouploader-scale').focus();
    }
  });
});
