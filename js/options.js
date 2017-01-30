'use strict'
var saveSetting = function() {
   $('#AlertArea > .alert').remove();

   var hatena_id = $('#HatenaId').val(); 
   var api_key = $('#ApiKey').val(); 
   var folder = $('#Folder').val();
   if(hatena_id.match(/\S/g) && api_key.match(/\S/g)) {
     chrome.storage.local.set({'FotolifeUploader_HatenaId': hatena_id,'FotolifeUploader_ApiKey': api_key,'FotolifeUploader_Folder': folder},function() {
       console.log("save setting");
       var $success_message = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>設定を保存しました</div>');
       $('#AlertArea').append($success_message);
     });
   } else {
     var $danger_message = $('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>入力に誤りがあります</div>');
     $('#AlertArea').append($danger_message);
   }
}

var loadSetting = function(){
  chrome.storage.local.get(['FotolifeUploader_HatenaId','FotolifeUploader_ApiKey','FotolifeUploader_Folder'],function(value){
    $('#HatenaId').val(value.FotolifeUploader_HatenaId);
    $('#ApiKey').val(value.FotolifeUploader_ApiKey);
    $('#Folder').val(value.FotolifeUploader_Folder);
  });
  $('#SaveButton').on('click',saveSetting);
}

$(document).ready(loadSetting);
