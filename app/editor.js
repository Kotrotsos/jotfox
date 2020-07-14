const jp = require("fs-jetpack");

const remote = require("electron").remote;
const app = remote.app;
const userPath = app.getPath('userData');
import File  from "./files"; //whaat?
const { ipcRenderer } = require("electron");

const $input = document.getElementById("editor");
const file = new File(userPath);

let evalType;

const editor = CodeMirror.fromTextArea($input, {
  theme: "one-dark",
  mode: "jot",
  gutter: true,
  lineNumbers: false,
  foldGutter: true,
  lineWrapping: true,
  matchBrackets: true,
  extraKeys: {
    "Ctrl-Y": cm => CodeMirror.commands.foldAll(cm),
    "Ctrl-I": cm => CodeMirror.commands.unfoldAll(cm),
    "Ctrl-F": function (cm) {
      cm.foldCode(cm.getCursor());
    },
    "Ctrl-S": function (cm) {
      saveEditorContents();
    },
    "Ctrl-R": function (cm) {
      if (editor.getSelection()) {
        evalType = 0;
        console.log(editor.getSelection());
        ipcRenderer.send("evaluate", editor.getSelection());
      }
    },
    Tab: function (cm) {
      if (editor.getSelection()) {
        console.log(editor.getSelection());
      } else {
        var start_cursor = editor.getCursor(); //I need to get the cursor position
        var line = editor.doc.getLine(start_cursor.line);
        if (line.startsWith("=>", 0)) {
          var retVal = parse(line);
          editor.replaceRange(
            retVal,
            { line: start_cursor.line, ch: 0 },
            { line: start_cursor.line }
          );
        } else {
          if (line.startsWith(";", 0)) {
            evalType = 1;
            var codeToEvaluate = line.substr(1);
            ipcRenderer.send("evaluate", codeToEvaluate);
            
          } else {
            return CodeMirror.Pass;
          }
          
        }
      }
    },
  },
  gutters: ["CodeMirror-foldgutter"]
});

  
const parse = (line) => {
  if (String(line).indexOf("date") != -1) {
    return "Date: " + new Date();
  }
  return line;
};

 


ipcRenderer.on("evaluate-response", (event, arg) => {
  var start_cursor = editor.getCursor(); //I need to get the cursor position
  var selection = editor.getSelection();
  var rows =  (selection.match(/\n/g) || '').length;

  editor.replaceRange(
    selection + "\n// " + arg + "\n",
    { line: start_cursor.line + evalType, ch: 0 },
    { line: start_cursor.line + rows}
  );
});


//events

document
  .querySelector('.jotfox-add')
  .addEventListener('click', function(){

    file.add();

    jp.readAsync(userPath + '/userdata/' + file.getCurrent() + '.data').then(function(e) {
      editor.setValue(e)
    })
    
  });
  document
  .querySelector('.jotfox-delete')
  .addEventListener('click', function(){
    console.log('delete')
    jp.readAsync(userPath + '/userdata/' +  file.delete()).then(function(e) {
      editor.setValue(e);
    });
  });
  document
  .querySelector('.jotfox-previous')
  .addEventListener('click', function(){   
    jp.readAsync(userPath + '/userdata/' +  file.previous()).then(function(e) {
      editor.setValue(e);
    });
  });
  document
  .querySelector('.jotfox-next')
  .addEventListener('click', function(){
    jp.readAsync(userPath + '/userdata/' +  file.next()).then(function(e) {
      editor.setValue(e);
    })
  });

const saveEditorContents = () => {
  jp.writeAsync(userPath + "/userdata/" + localStorage.getItem('currentFile'), editor.getValue());
}

if (remote.getGlobal("config").environment !== "development") {
  setInterval(() => {
    saveEditorContents();
  }, 1000);
}
// Need to find the proper lifecycle method for this.
setTimeout(() => {
  CodeMirror.commands.foldAll(editor)
}, 100);