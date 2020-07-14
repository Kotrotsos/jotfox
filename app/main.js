
const {app, BrowserWindow} = require('electron')
const path = require('path')

require('./shortcuts.js');
require('./evaluate.js');

global.config = {
  currentFile: '1.data',
  environment: 'development',

};
console.log(":", new Date(), global.config.environment)
if (global.config.environment === 'development') {
  require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
  });
}


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
 

  // Open the DevTools.
 //
 
 if (global.config.environment === 'development') { mainWindow.webContents.openDevTools(); }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
    app.quit()
 
});
