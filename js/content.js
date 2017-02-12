var fotouploader_status_flg = true;
var fotouploader_percent_min = 10;
var fotouploader_percent_max = 200;
var fotouploader_direct_min = 10;
var fotouploader_direct_max = 4000;
var showInputError = function(msg) {
  'use strict';
  var $error_message = $('#scale-modal').find('.fotouploader-message-error');
  if($error_message.length == 0) {
    $error_message = $('<p class="fotouploader-message fotouploader-message-error">' + msg + '</p>');
    $('#scale-modal').prepend($error_message);
  } else {
    $error_message.text(msg);
  }
}
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
  var $scale_modal_radio_percent = $('<div class="fotouploader-scale-type"><input type="radio" name="scale-type" value="percent" checked="checked">縮尺率を指定</div>');
  var $scale_modal_input_percent = $('<div class="fotouploader-input-group"> <div class="fotouploader-inline fotouploader-input-label"><span>縮尺：</span></div> <div class="fotouploader-inline"><input class="fotouploader-input-text" id="fotouploader-scale-percent" type="text" name="scale-percent" placeholder="縮尺率">%</div>');
  var $scale_modal_radio_direct = $('<div class="fotouploader-scale-type"><input type="radio" name="scale-type" value="direct">サイズを直接指定</div>');
  var $scale_modal_input_direct = $('<div class="fotouploader-input-group"><div class="fotouploader-inline fotouploader-input-label"><span>幅：</span></div><div class="fotouploader-inline"><input class="fotouploader-input-text" id="fotouploader-scale-width" type="text" placeholder="幅">ピクセル</input></div></div> <div class="fotouploader-input-group"> <div class="fotouploader-inline fotouploader-input-label"><span>高さ：</span></div><div class="fotouploader-inline"><input class="fotouploader-input-text" id="fotouploader-scale-height" type="text" placeholder="高さ">ピクセル</input></div></div>');

  var $scale_upload_button = $('<button class="fotouploader-button" name="submit">アップロード</button>');
  $scale_upload_button.on('click',function(){
    var $scale_modal = $('#scale-modal');
    var scale_type = $('input[name=scale-type]:checked').val();
    if (scale_type === "percent") {
      var percent = $('#fotouploader-scale-percent').val();
      if (percent.match(/\D+/) || percent < fotouploader_percent_min || percent > fotouploader_percent_max) {
        showInputError('縮尺率は10〜200の範囲の整数で入力してください');
      } else {
        $scale_modal.fadeOut();
        chrome.runtime.sendMessage({type: scale_type, percent: percent,src: $('#fotouploader-src').val()});
      }
    } else if (scale_type === "direct") {
      var uwidth = $('#fotouploader-scale-width').val();
      var uheight = $('#fotouploader-scale-height').val();

      if ((uwidth.match(/\D+/) || uwidth < fotouploader_direct_min || uwidth > fotouploader_direct_max) || 
          (uheight.match(/\D+/) || uheight < fotouploader_direct_min || uheight > fotouploader_direct_max)) {
        showInputError('幅と高さは10〜4000の範囲の整数で入力してください');
      } else {
        $scale_modal.fadeOut();
        chrome.runtime.sendMessage({type: scale_type, uwidth: uwidth, uheight: uheight,src: $('#fotouploader-src').val()});
      }
    } else {
      showInputEttor('「縮尺率を指定」または「サイズを直接指定」のどちらかを選択してください');
    }
  });
  var $scale_cancel_button = $('<button class="fotouploader-button" name="cancel">キャンセル</button>');
  $scale_cancel_button.on('click',function() {
    $('#scale-modal').fadeOut();
    $('#fotouploader-modal-background').fadeOut();
  });

  $scale_modal.append($('<hidden id="fotouploader-src"></hidden>'));
  $scale_modal.append($scale_modal_radio_percent);
  $scale_modal.append($scale_modal_input_percent);
  $scale_modal.append($scale_modal_radio_direct);
  $scale_modal.append($scale_modal_input_direct);
  $scale_modal.append($('<div class="scale-buttons"/>').append($scale_upload_button));
  $scale_modal.append($('<div class="scale-buttons"/>').append($scale_cancel_button));
  $upload_modal.append($scale_modal);


  chrome.runtime.onMessage.addListener(function(message) {
    $(this).blur();
    $('#fotouploader-modal-background').fadeIn();

    var json_message = JSON.parse(message);
    var message_type = json_message['type'];
    if (message_type === "notice") {
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
      var src_image = new Image();
      src_image.src = json_message['src'];
      $('#fotouploader-scale-width').val(src_image.width);
      $('#fotouploader-scale-height').val(src_image.height);
      $scale_modal.fadeIn();
      $('#fotouploader-scale').focus();
    }
  });
});
