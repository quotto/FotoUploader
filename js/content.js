$(document).ready(function(){
  var $upload_modal = $('<div id="upload-modal" role="dialog"></div>');

  var $upload_modal_content = $('<div id="upload-modal-content"></div>');
  var $upload_message = $('<p></p>');

  $upload_modal_content.append($upload_message);
  $upload_modal.append($upload_modal_content);
  $upload_modal.on('click',function(){
    $(this).fadeOut();
  });
  $upload_modal.on('mousemove',function(){
    $(this).fadeOut();
  });

  $('body').append($upload_modal);

  chrome.runtime.onMessage.addListener(function(message) {
    $(this).blur();
    var json_message = JSON.parse(message);
    var $upload_modal = $('#upload-modal');
    var $upload_modal_content = $('#upload-modal-content');
    $upload_modal_content.find('p').text(json_message['message']);

    $('#upload-modal').fadeIn();
  });
});
