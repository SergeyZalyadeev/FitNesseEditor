
var popupEvents = {}; 
 
chrome.runtime.onMessage.addListener(
    function(msg, sender, response) 
    {
        if(msg.from && msg.from === "popup-ace-config" )
        {
            for(var key in msg.message)
            {
                popupEvents["on_"+key].call(null, msg.message);
            }
        }
    }
);
  
popupEvents.on_mode = function(message)
{
    console.log(message);
    window.aceEditor.getSession().setMode("ace/mode/"+message.mode);
}

popupEvents.on_theme = function(message)
{
    console.log(message);
    window.aceEditor.setTheme(message.theme);
}

popupEvents.on_fontsize = function(message)
{
    console.log(message);
    window.aceEditor.setFontSize(message.fontsize);
}