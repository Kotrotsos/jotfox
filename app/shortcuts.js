const { app, globalShortcut } = require("electron");


// const { menubar } = require("menubar");
// let mainWindow;
// const mb = menubar();

let dvisible = true;

//  mb.on("ready", () => { 
   
// });
// mb.on('after-create-window', () => {
//     mb.window.openDevTools()
//   });
  

  
app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+Space', () => {
  // Please refactor as soon as possible, this is killing
      if (dvisible) {
        let mainwindowHide = require('electron-main-window').getMainWindow();
        mainwindowHide.hide();
           
        dvisible = !dvisible;
      } else {     
        let mainWindowShow = require('electron-main-window').getMainWindow();
        mainWindowShow.show();
        dvisible = !dvisible;
      }
    })
});
app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Space')
  
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })