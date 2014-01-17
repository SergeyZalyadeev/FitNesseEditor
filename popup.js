
function initMode(){
    var settings = localStorage || {};
    for(var key in settings){
      window[key].value = settings[key];
    }
    
    $('#mode').change( function(evt){
        sendMessageToContent({mode:evt.target.value});
    });
    
    $('#theme').change(function(evt){
        sendMessageToContent({theme:evt.target.value});
    });
    
    $('#fontsize').change(function(evt){
        sendMessageToContent({fontsize:evt.target.value});
    });
}

function sendMessageToContent(message){
    chrome.tabs.query({ active: true, currentWindow: true}
    , function(tabs) {
        chrome.tabs.sendMessage(
                tabs[0].id
                , { from: "popup-ace-config", message: message }
                , function(resp){console.log(resp);} );
    });
}



function initPopup(){
    console.log('POPUP!!!!!!!!!!!!!!!!!!!!');
    initMode();
}


$(document).ready(initPopup);

