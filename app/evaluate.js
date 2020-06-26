const {ipcMain} = require('electron');


ipcMain.on('evaluate', (event, arg) => { 
    let evaluatedCode;
    try {
        evaluatedCode = eval(arg);
    } catch (e) {
        if (e instanceof SyntaxError) {
            evaluatedCode = "Syntax Error";
        } else {
            throw e;
        }
    }
     

    let mainWindow = require('electron-main-window').getMainWindow();

    mainWindow.webContents.send('evaluate-response', evaluatedCode); 
});
