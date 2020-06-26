const jp = require('fs-jetpack');

function initialDocument (callback) {
 
  jp.readAsync('userdata/01.data')
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
