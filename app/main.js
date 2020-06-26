
const {app, BrowserWindow} = require('electron')
const path = require('path')

require('./shortcuts.js');
require('./evaluate.js');

global.config = {
  currentFile: 'data/01.data',
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

  mainWindow.webContents.executeJavaScript(`
  var path = require('path');
  module.paths.push(path.resolve('node_modules'));
  module.paths.push(path.resolve('../node_modules'));
  module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
  module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
  module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
  module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
  path = undefined;
`);

  // and load the index.html of the app.
 mainWindow.loadFile('index.html')
 
  // Open the DevTools.
 //
 
 //mainWindow.webContents.openDevTools()
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
