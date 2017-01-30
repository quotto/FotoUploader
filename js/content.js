$(document).ready(function(){
  var $uploading_modal = $('<div id="uploadModal" class="modal fade" tabindex="-1" role="dialog"></div>');

  var $uploading_modal_document = $('<div class="modal-dialog modal-sm" role="document"></div>');
  var $uploading_modal_document_content = $('<div class="modal-content"></div>');
  var $uploading_modal_document_content_body = $('<div class="modal-body"></div>');
  var $uploading_message = $('<p></p>');

  $uploading_modal_document_content_body.append($uploading_message);
  $uploading_modal_document_content.append($uploading_modal_document_content_body);
  $uploading_modal_document.append($uploading_modal_document_content);
  $uploading_modal.append($uploading_modal_document);

  $('body').append($uploading_modal);

  chrome.runtime.onMessage.addListener(function(message) {
    var json_message = JSON.parse(message);
    var $uploading_modal = $('#uploadModal');
    $uploading_modal.find('p').text(json_message['message']);

    $('#uploadModal').modal('show');
  });
});
