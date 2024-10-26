const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
        frame: false,
        resizable: false,
    });

    mainWindow.loadFile('loading.html');

    setTimeout(() => {
        mainWindow.loadURL('http://localhost:5173/');
    }, 1000); 

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            document.body.style.overflow = 'hidden'; 
            document.documentElement.style.overflow = 'hidden'; // Для HTML
            // Додаємо стилі для приховування скроллбарів
            document.body.style.scrollbarWidth = 'none'; // Для Firefox
            document.body.style.msOverflowStyle = 'none'; // Для Internet Explorer та Edge
            const style = document.createElement('style');
            style.innerHTML = '::-webkit-scrollbar { display: none; }'; // Для Chrome, Safari та Opera
            document.head.appendChild(style);
        `);
    });

    ipcMain.on('close-app', () => {
        app.quit();
    });

    ipcMain.on('minimize-app', () => {
        mainWindow.minimize();
    });

    ipcMain.on('move-window', (event, { x, y }) => {
        mainWindow.setPosition(x, y);
    });

    ipcMain.on('open-external-link', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.on('run-on-start', (event, enabled) => {
        console.log('Run on start:', enabled);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
