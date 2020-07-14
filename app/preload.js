const jp = require('fs-jetpack');
const remote = require("electron").remote;
const app = remote.app;


const userPath = app.getPath('userData');
function initialDocument (callback) {

  if (!localStorage.getItem('currentFile')) {
    // No initial file found, using 1.data

    localStorage.setItem('currentFile', '1.data')
    console.log(localStorage.getItem('currentFile'), userPath)
     
  }
  jp.readAsync(userPath + '/userdata/' + localStorage.getItem('currentFile'))
  .then((data) => {
        return callback(data);
    })
  }


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const $input = document.getElementById('editor');
  initialDocument(function(data){
    editor.setValue( data );
    editor.refresh();
  })
  

})
