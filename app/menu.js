const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;

const createTray = () => {
        
    // Base 64 icon
    let base64Icon = `data:image/png;base64__[YOUR_ICON]`;
    
    // Setup the menubar with an icon
    let icon = nativeImage.createFromDataURL(base64Icon);
    
    // Creating icon
    tray = new Tray(icon);

    // Context Menu
    const contextMenu = Menu.buildFromTemplate([
        { label: 'About',           role: 'about' },
        { label: 'Separator',       type: 'separator'},
        { label: 'Status',          
            submenu: [
                {label: 'On',  type: 'radio', checked: true,  click: () => mainWindow.webContents.send('status', 'on')  }, 
                {label: 'Off', type: 'radio', checked: false, click: () => mainWindow.webContents.send('status', 'off') }
            ]
        },
        { label: 'Separator',       type: 'separator'},
        { label: 'Quit',            role: 'quit' },
    ]);
    
    // Setting context Menu 
    tray.on('right-click', (event) => tray.popUpContextMenu(contextMenu));
    
    // Add a click handler so that when the user clicks on the menubar icon, it shows
    // our popup window
    tray.on('click', (event) => { mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show() });  
    
}