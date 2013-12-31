
function initMode(){
    console.log('init mode');
    var mode = $.cookie("FIT_ACE_MODE") || "sql";
    console.log('set:'+mode);
    $('#mode').val(mode)
    
    $('#mode').change( function(evt){
        var mode = evt.target.value;
        $.cookie("FIT_ACE_MODE", mode, { expires: 9999 });
        sendMessageToContent({mode:mode});
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



function initialize(){
    console.log('POPUP!!!!!!!!!!!!!!!!!!!!');
    initMode();
}


$(document).ready(initialize);

