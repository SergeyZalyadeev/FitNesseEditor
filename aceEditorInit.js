function aceInit()
{
    console.log('aceInit');
    var settings = getSettings();
    if(settings.ace_editor_disabled == "true") return;

    if(aceInit.DONE) return;
    aceInit.DONE = true;
    if( $('#pageContent').length == 0 ) return;
    
    $('#editor').append($('<div id="ACEditor"/>'))
    var editor = window.aceEditor = ace.edit("ACEditor");
    
    editor.setTheme(settings.theme);
    var session = editor.getSession();
    
    var mode = settings.mode;
    
    session.setMode("ace/mode/"+mode);
    session.setUseSoftTabs(settings.soft_tab);
    session.setUseWrapMode(settings.textwrap);
    
    editor.setShowInvisibles(true);
    editor.setDisplayIndentGuides(true);
    editor.setHighlightActiveLine(true);
    editor.getSelectionRange(0);
    editor.setFontSize(localStorage.fontsize);
    editor.setOption("useIncrementalSearch", settings.isearch);   
    editor.setReadOnly(settings.read_only); 
    
    editor.setValue(window.pageContent.value);
    editor.gotoLine(0);
    
    $(window.f).submit(function(){
        if($('#ACEditor').is(':visible')){ 
            window.f.pageContent.value = editor.getValue();
        }
        this.submit();
    });
    
    $('.editor-toggle').hide();
    $('#tt-wrap-text').hide();
    toggleACEditor(true);
    overrideButtons();
    
}

function getLocalStorageValue(key, defaultVal)
{
    var val = localStorage[key];
    if(val !== undefined)
    {
      return val.match(/true|false/) ? val === "true" : val;
    }
    
    return defaultVal;
}

function getSettings(){
    var settings = {
      mode:'sql',
      fontsize:'14px',
      theme: 'textmate',
      soft_tab:true,
      isearch:true,
      read_only:false,
      textwrap:false,
      ace_editor_disabled:false
    }
   
    $.map(settings, function(value, key){
      settings[key] = getLocalStorageValue(key, value) ;
    });
    
    return settings;
}

/*
function appendModeSelector(){
    var editor = window.aceEditor;
    var modeSel = $('<fieldset><label id="lmode"> Mode: </label>'
                        +'<select id="mode" size="1">'
                        +'<option value="sql">SQL</option>'
                        +'<option value="powershell">Powershell</option>'
                        +'<option value="javascript">JavaScript</option>'
                        +'<option value="python">Python</option></select></fieldset>');
    modeSel.insertBefore($('#editor'))
    //$('.textarea-toolbar').append(modeSel);
    
    $('#mode').change( function(evt){
        console.log("mode:", evt.target.value)
        editor.getSession().setMode("ace/mode/"+evt.target.value);
        $.cookie("FIT_ACE_MODE", evt.target.value, { expires: 9999 });
    });
    $('#mode').val($.cookie("FIT_ACE_MODE") || "sql");
    
}


function overrideEditorToggle(){
    var editor = window.aceEditor;
    $('#editor-textarea-1').click(function(){
        editor.setValue(window.f.pageContent.value);
        editor.gotoLine(0);
        toggleACEditor(true);
    });
    
    $('#editor-wysiwyg-1').click(function(){
        window.f.pageContent.value = editor.getValue();
        toggleACEditor(false);
    });
    
    function last2first(handlers){  handlers.splice(0, 0, handlers.pop()); }
    last2first($('#editor-wysiwyg-1').data('events').click);
    
}
*/

function toggleACEditor(bShow){
    if( bShow ){
        $('#ACEditor').show();
        $('#wysiwyg').hide()
        $('#pageContent').hide()
    } else {
        $('#ACEditor').hide();
        $('#wysiwyg').show()
    }
}


function overrideButtons(){
    $('input[value="Spreadsheet to FitNesse"]').click(SelectionSpreadsheetToWikiACEditor)
    $('input[value="FitNesse to Spreadsheet"]').click(SelectionWikiToSpreadsheetACEditor)
    $('input[value="Format"]').click(FormatWikiACEditor)
}

function applySelection(editor, format_callable){
    var selected_text = editor.session.getTextRange(editor.getSelectionRange());
    if(selected_text){
        editor.session.replace(aceEditor.getSelectionRange(), format_callable(selected_text) )
    }
    else{
        editor.setValue(format_callable(editor.getValue()));
    }
}

function FormatWikiACEditor()
{
    var editor = window.aceEditor;
    var formatter = new WikiFormatter();
    
    applySelection(editor, function(text){  return formatter.format(text); } )
}

function SelectionSpreadsheetToWikiACEditor()
{
    var editor = window.aceEditor;
    var translator = new SpreadsheetTranslator();
  
    applySelection(editor, function(text){  
        translator.parseExcelTable( text );
        return translator.getFitNesseTables();
    });
}

function SelectionWikiToSpreadsheetACEditor()
{
    var editor = window.aceEditor;

    applySelection(editor, function(text){
        return text.replace(/\r\n/g, '\n')
                   .replace(/\r/g, '\n')
                   .replace(/\|\n/g, '\n') // remove the last | at the end of the line
                   .replace(/\|/g, '\t'); // replace all remaining | with \t
    });
}



