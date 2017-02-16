var changeUploadingModal = function(tab_id,status_text,message) {
  "use strict";
  message = message.replace(/\//g,'\\\/');
  message = message.replace(/"/g,'\\\"');
  var send_message = '{"type": "notice","status": "' + status_text + '", "message": "' + message + '"}';
  chrome.tabs.sendMessage(tab_id,send_message);
}
var getIsoString = function (){
  "use strict";
  var d = new Date;
  var year = d.getFullYear();
  var month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1):d.getMonth().toString();
  var date = d.getDate() < 10 ? "0" + d.getDate():d.getDate().toString();
  var hour = d.getHours() < 10 ? "0" + d.getHours():d.getHours().toString();
  var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes().toString();
  var sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds().toString();
  var mil = d.getMilliseconds();
  var pad = '';
  if(d.getMilliseconds() < 100) {
    if(d.getMilliseconds() < 10) {
      pad = "000";
    } else {
      pad = "00";
    }
  }
  return year + "-" + month + "-" + date + "T" + hour + ":" + minute + ":" + sec +"." + pad + mil +"Z";
}

var doUpload = function(src,request,tab) {
  "use strict";
  chrome.storage.local.get(['FotolifeUploader_HatenaId','FotolifeUploader_ApiKey','FotolifeUploader_Folder'],function(value){
    changeUploadingModal(tab.id,'load','はてなフォトライフへアップロードしています……');
    var xhr = new XMLHttpRequest();
    xhr.open('GET',src);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      var bytes = new Uint8Array(this.response);
      var descriptor_hex = '';
      for (var i = 0; i < 8; i++) {
        descriptor_hex += bytes[i].toString(16);
      }

      var descriptor = '';
      if(descriptor_hex.substr(0,4) === 'ffd8') {
        descriptor = 'jpeg';
      } else if(descriptor_hex.substr(0,8) === '89504e47') {
        descriptor = 'png';
      } else if(descriptor_hex.substr(0,8) === '47494638') {
        descriptor = 'gif';
      } else if(descriptor_hex.substr(0,4) === '424d') {
        //bmpの場合はjpegとしてアップロードする
        descriptor = 'jpeg';
      } else {
        changeUploadingModal(tab.id,'error','この画像はアップロードできません。');
        return;
      }

      var binaryData = '';
      for(var i = 0; i < bytes.byteLength; i++) {
        binaryData += String.fromCharCode(bytes[i]);
      }

      var upload_url = 'https://hatenablog.wackwack.net/hatena_blog/fotolife_upload';
      var hatena_id = value.FotolifeUploader_HatenaId;
      var api_key = value.FotolifeUploader_ApiKey;
      var folder_name = value.FotolifeUploader_Folder;
      var sha_obj = new jsSHA('SHA-1','TEXT');
      var rand_str= Math.random().toString();
      sha_obj.update(rand_str);
      var nonce = sha_obj.getHash('B64');
      var base64nonce = btoa(nonce);

      var timestamp = getIsoString();

      var sha_obj2 = new jsSHA('SHA-1','TEXT',{numRounds:1});
      sha_obj2.update(nonce + timestamp + api_key);
      var digest = sha_obj2.getHash('B64');

      var p_options = {type: "normal",percent: 0, uwidth: 0, uheight: 0, format: descriptor};
      if (request != null) {
        p_options.type = request.type;
        p_options.percent = request.percent;
        p_options.uwidth = request.uwidth;
        p_options.uheight = request.uheight;
        if (request.format === "default") {
          p_options.format  = descriptor;
        } else {
          p_options.format = request.format;
        }
      }

      $.ajax({
        url: upload_url,
        method: 'POST',
        data: {imagedata: btoa(binaryData), folder: folder_name,id: hatena_id,api_key: api_key, digest: digest, nonce: base64nonce, timestamp: timestamp, type: p_options.type, percent: p_options.percent, uwidth: p_options.uwidth, uheight:p_options.uheight, format: p_options.format},
        dataType: 'json'
      }).done(function(data,statusText,jqXHR) { 
        changeUploadingModal(tab.id,'success','アップロードが完了しました。');
      }).fail(function(jqXHR,statusText,errorThrown) {
        var message = '';
        switch(jqXHR.status) {
          case 403:
          case 404:
            message = 'フォトライフのアップロードに失敗しました。はてなidとAPIキーの設定を確認して下さい。';
            break;  
          default:
            message = 'エラーが発生しました。しばらく経ってから実行するか開発者にお問い合わせください。';
            break;
        }
        changeUploadingModal(tab.id,'error',message);
      });
    }
    xhr.send();
  });
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
  doUpload(request.src,request,sender.tab);
});

chrome.contextMenus.create({
  title: "そのままアップロード",
  onclick: function(info,tab) {
    doUpload(info.srcUrl,null,tab);
  },
  contexts:['image']
});
chrome.contextMenus.create({
  title: "画像サイズを変えてアップロード",
  contexts:['image'],
  onclick: function(info,tab) {
    chrome.tabs.sendMessage(tab.id,'{"type": "set_scale", "src": "' + info.srcUrl + '"}');
  }
});
