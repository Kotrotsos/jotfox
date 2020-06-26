const jp = require("fs-jetpack");
const remote = require("electron").remote;
const { ipcRenderer } = require("electron");

const $input = document.getElementById("editor");

const editor = CodeMirror.fromTextArea($input, {
  theme: "one-dark",
  mode: "jot",
  gutter: true,
  lineNumbers: false,
  foldGutter: true,
  lineWrapping: true,
  matchBrackets: true,
  extraKeys: {
    "Ctrl-F": function (cm) {
      cm.foldCode(cm.getCursor());
    },
    "Ctrl-S": function (cm) {
      saveEditorContents();
    },
    "Ctrl-R": function (cm) {
      if (editor.getSelection()) {
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
          return CodeMirror.Pass;
        }
      }
    },
  },
  gutters: ["CodeMirror-foldgutter"],
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

  editor.replaceRange(
    selection + "\n// " + arg,
    { line: start_cursor.line, ch: 0 },
    { line: start_cursor.line }
  );
});

const saveEditorContents = () => {
  jp.writeAsync("userdata/01.data", editor.getValue());
}

if (remote.getGlobal("config").environment !== "development") {
  setInterval(() => {
    saveEditorContents();
  }, 1000);
}
