
var pageContent =  document.getElementById('pageContent');

if(pageContent && pageContent.tagName === 'TEXTAREA') 
{
    chrome.extension.sendRequest({}, function(response) {
        aceInit();
    });
}
    
