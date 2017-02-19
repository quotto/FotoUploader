var fotouploader_status_flg = true;
var fotouploader_compress = 0;
var fotouploader_compress = 100;
var fotouploader_size_min = 0;
var fotouploader_size_max = 4000;
var fotouploader_size_perwidth = 0;
var fotouploader_size_perheight = 0;
var showInputError = function(msg) {
  'use strict';
  var $error_message = $('#custom-modal').find('.fotouploader-message-error');
  if($error_message.length == 0) {
    $error_message = $('<p class="fotouploader-message fotouploader-message-error">' + msg + '</p>');
    $('#custom-modal').prepend($error_message);
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

  var $custom_modal = $('<div id="custom-modal" class="fotouploader-modal-content"></div>');
  var $custom_modal_compress_label = $('<div class="fotouploader-label"><span>圧縮率</span></div>');
  var $custom_modal_compress_input = $('<div class="fotouploader-input-group"><div class="fotouploader-inline fotouploader-input-label"></div><input class="fotouploader-input-text fotouploader-compress-input" id="fotouploader-compress-percent" type="text" name="custom-compress" placeholder="圧縮率" /><span>%</span><div class="fotouploader-compress-notice"><div class="fotouploader-inline fotouploader-input-label"></div><div class="fotouploader-inline"><span>※画像形式がJPEGの場合のみ有効です</span></div></div>');
  var $custom_modal_size_label = $('<div class="fotouploader-label">画像サイズ</div>');
  var $custom_modal_size_width = $('<div class="fotouploader-inline fotouploader-input-label"><span>幅：</span></div><div class="fotouploader-inline"><input class="fotouploader-input-text fotouploader-size-input" id="fotouploader-custom-width" type="text" placeholder="幅">ピクセル</input></div></div>');
  $custom_modal_size_width.find('#fotouploader-custom-width').on('keyup',function(){
    var checked = $('#fotouploader-size-auto:checked').val();
    if(checked) {
      $('#fotouploader-custom-height').val(Math.round($(this).val() * fotouploader_size_perheight));
    }
  });
  var $custom_modal_size_height = $('<div class="fotouploader-inline fotouploader-input-label"><span>高さ：</span></div><div class="fotouploader-inline"><input class="fotouploader-input-text fotouploader-size-input" id="fotouploader-custom-height" type="text" placeholder="高さ">ピクセル</input></div>');
  $custom_modal_size_height.find('#fotouploader-custom-height').on('keyup',function(){
    var checked = $('#fotouploader-size-auto:checked').val();
    if(checked) {
      $('#fotouploader-custom-width').val(Math.round($(this).val() * fotouploader_size_perwidth));
    }
  });
  var $custom_modal_size_auto = $('<div class="fotouploader-inline fotouploader-input-label"></div><div class="fotouploader-inline"><input id="fotouploader-size-auto" type="checkbox" checked="checked">縦横比を固定する</input></div>');
  var $custom_modal_size_input = $('<div class="fotouploader-input-group"> <div class="fotouploader-input-group"></div>');
  $custom_modal_size_input.append($custom_modal_size_width);
  $custom_modal_size_input.append($custom_modal_size_height);
  $custom_modal_size_input.append($custom_modal_size_auto);
  var $custom_modal_format_label = $('<div class="fotouploader-label"><span>画像形式</span></div>');
  var $custom_modal_format = $('<div class="fotouploader-format"><div class="fotouploader-inline fotouploader-input-label"></div> <select name="fotouploader-format"><option value="default">デフォルト</option> <option value="jpeg">jpg</option> <option value="png">png</option> <option value="gif">gif</option> </select> </div>');

  var $custom_upload_button = $('<button class="fotouploader-button" name="submit">アップロード</button>');
  $custom_upload_button.on('click',function(){
    var $custom_modal = $('#custom-modal');
    var custom_type = $('input[name=custom-type]:checked').val();
    var format_value = $('select[name=fotouploader-format]').val();

    var compress_percent = $('#fotouploader-compress-percent').val();
    if (compress_percent === '') {
      compress_percent = '0';
    }
    if (compress_percent.match(/\D+/) || compress_percent < fotouploader_size_min || compress_percent > fotouploader_size_max) {
      showInputError('圧縮率は0〜100の範囲で入力してください');
      return;
    } 

    var uwidth = $('#fotouploader-custom-width').val();
    var uheight = $('#fotouploader-custom-height').val();

    if ((uwidth.match(/\D+/) || uwidth < fotouploader_size_min || uwidth > fotouploader_size_max) || 
        (uheight.match(/\D+/) || uheight < fotouploader_size_min || uheight > fotouploader_size_max)) {
      showInputError('幅と高さは0〜4000の範囲の整数で入力してください');
      return;
    } 

    $custom_modal.fadeOut();
    chrome.runtime.sendMessage({type: 'custom', compress_percent: compress_percent,type: custom_type, uwidth: uwidth, uheight: uheight,src: $('#fotouploader-src').val(),format: format_value});
  });
  var $custom_cancel_button = $('<button class="fotouploader-button" name="cancel">キャンセル</button>');
  $custom_cancel_button.on('click',function() {
    $('#custom-modal').fadeOut();
    $('#fotouploader-modal-background').fadeOut();
  });

  $custom_modal.append($('<hidden id="fotouploader-src"></hidden>'));
  $custom_modal.append($custom_modal_compress_label);
  $custom_modal.append($custom_modal_compress_input);
  $custom_modal.append($custom_modal_size_label);
  $custom_modal.append($custom_modal_size_input);
  $custom_modal.append($custom_modal_format_label);
  $custom_modal.append($custom_modal_format);
  $custom_modal.append($('<div class="custom-buttons"/>').append($custom_upload_button));
  $custom_modal.append($('<div class="custom-buttons"/>').append($custom_cancel_button));
  $upload_modal.append($custom_modal);


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
      var $custom_modal = $('#custom-modal');

      // エラーメッセージが出っぱなしの場合は削除する
      var $error_message = $custom_modal.find('.fotouploader-message-error');
      if ($error_message.length > 0) {
        $error_message.remove();
      }
      $('#fotouploader-src').val(json_message['src']);
      $('#fotouploader-compress-percent').val('100');
      var src_image = new Image();
      src_image.src = json_message['src'];

      fotouploader_size_perwidth = src_image.width / src_image.height;
      fotouploader_size_perheight = src_image.height / src_image.width;
      $('#fotouploader-custom-width').val(src_image.width);
      $('#fotouploader-custom-height').val(src_image.height);
      $custom_modal.fadeIn();
      $('#fotouploader-custom').focus();
    }
  });
});
