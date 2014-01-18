
function initControls(settings){
    console.log('initControls');
    console.log(settings);
 
    $.map(['mode','theme','fontsize'],
      function(key){ 
        var e=$('#'+key);
        e.val(settings[key]); 
        e.change( function(evt){
          var msg = {};
          msg[key]=evt.target.value;
          sendMessageToContent(msg);
        });
    });    
  
    $.map(['isearch','read_only','soft_tab','textwrap'],
      function(key){ 
        var e=$('#'+key);
        e.prop('checked', settings[key])
        e.change( function(evt){
          var msg = {};
          msg[key]=evt.target.checked;
          sendMessageToContent(msg);
        });
    });    
   
}

function sendMessageToContent(message, callback){
    chrome.tabs.query({ active: true, currentWindow: true}
    , function(tabs) {
        chrome.tabs.sendMessage(
                tabs[0].id
                , { from: "popup-ace-config", message: message }
                , callback );
    });
}



function initPopup(){
    console.log('POPUP!!!!!!!!!!!!!!!!!!!!');
    sendMessageToContent({get_settings:true}, initControls)
}


$(document).ready(initPopup);

