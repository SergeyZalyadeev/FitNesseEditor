
var popupEvents = {}; 
 
chrome.runtime.onMessage.addListener(
    function(msg, sender, response) 
    {
        if(msg.from && msg.from === "popup-ace-config" )
        {
            for(var key in msg.message)
            {
                popupEvents["on_"+key].call(null, msg.message,response);
                saveOption(key, msg.message[key]);
            }
        }
    }
);
  
function saveOption(name, value)
{
    localStorage && localStorage.setItem(name, value)
}

popupEvents.on_get_settings = function(message, sendResponse)
{
    console.log(message);
    sendResponse(getSettings());
}
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

popupEvents.on_fontsize = function(message)
{
    console.log(message);
    window.aceEditor.setFontSize(message.fontsize);
}

popupEvents.on_soft_tab = function(message)
{
    window.aceEditor.session.setUseSoftTabs(message.soft_tab);
}
popupEvents.on_isearch = function(message)
{
    window.aceEditor.setOption("useIncrementalSearch",message.isearch);
}
popupEvents.on_read_only = function(message)
{
    window.aceEditor.setReadOnly(message.read_only);
}
popupEvents.on_textwrap = function(message)
{
    window.aceEditor.session.setUseWrapMode(message.textwrap);
}

