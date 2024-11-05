const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    closeApp: () => ipcRenderer.send('close-app'),
    minimizeApp: () => ipcRenderer.send('minimize-app'),
    openExternalLink: (url) => ipcRenderer.send('open-external-link', url), 
    connectToServer: (serverIp) => ipcRenderer.send('connect-to-server', serverIp),
});

document.addEventListener('DOMContentLoaded', () => {

    let isDragging = false;
    let offsetX, offsetY;

    document.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX;
        offsetY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            window.electron.moveWindow(x, y); 
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
