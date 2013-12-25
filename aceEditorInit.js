function aceInit()
{
    console.log('aceInit');

    if(aceInit.DONE) return;
    aceInit.DONE = true;
    if( $('#pageContent').length == 0 ) return;
    
    $('#editor').append($('<div id="ACEditor"/>'))
    var editor = window.ACEditor = ace.edit("ACEditor");
    editor.setTheme("ace/theme/textmate");
    var session = editor.getSession();
    
    var mode = $.cookie("FIT_ACE_MODE") || "sql";
    
    session.setMode("ace/mode/"+mode);
    session.setUseSoftTabs(true);
    session.setUseWrapMode($.cookie('textwrapon') === 'true');
    
    editor.setShowInvisibles(true);
    editor.setDisplayIndentGuides(true);
    editor.setHighlightActiveLine(true);
    editor.getSelectionRange(0);
    $('#ACEditor')[0].style.fontSize='14px';
        
    editor.setValue(document.f.pageContent.value);
    editor.gotoLine(0);
    
    $(document.f).submit(function(){
        if($('#ACEditor').is(':visible')){ 
            document.f.pageContent.value = editor.getValue();
        }
        this.submit();
    });
    
    appendModeSelector();
    overrideButtons();
    overrideEditorToggle();
    toggleACEditor( $.cookie('wysiwyg') != 'wysiwyg');
}
function appendModeSelector(){
    var editor = window.ACEditor;
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
    var editor = window.ACEditor;
    $('#editor-textarea-1').click(function(){
        editor.setValue(document.f.pageContent.value);
        editor.gotoLine(0);
        toggleACEditor(true);
    });
    
    $('#editor-wysiwyg-1').click(function(){
        document.f.pageContent.value = editor.getValue();
        toggleACEditor(false);
    });
    
    function last2first(handlers){  handlers.splice(0, 0, handlers.pop()); }
    last2first($('#editor-wysiwyg-1').data('events').click);
    
    $('#tt-wrap-text').click(function() {
        window.ACEditor.getSession().setUseWrapMode(this.checked);
    });
}

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
        editor.session.replace(ACEditor.getSelectionRange(), format_callable(selected_text) )
    }
    else{
        editor.setValue(format_callable(editor.getValue()));
    }
}

function FormatWikiACEditor()
{
    var editor = window.ACEditor;
    var formatter = new WikiFormatter();
    
    applySelection(editor, function(text){  return formatter.format(text); } )
}

function SelectionSpreadsheetToWikiACEditor()
{
    var editor = window.ACEditor;
    var translator = new SpreadsheetTranslator();
  
    applySelection(editor, function(text){  
        translator.parseExcelTable( text );
        return translator.getFitNesseTables();
    });
}

function SelectionWikiToSpreadsheetACEditor()
{
    var editor = window.ACEditor;

    applySelection(editor, function(text){
        return text.replace(/\r\n/g, '\n')
                   .replace(/\r/g, '\n')
                   .replace(/\|\n/g, '\n') // remove the last | at the end of the line
                   .replace(/\|/g, '\t'); // replace all remaining | with \t
    });
}



//$(document).ready(aceInit)
