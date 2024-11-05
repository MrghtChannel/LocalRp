const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const exec = require('child_process').exec;

let mainWindow;
let isMainLoaded = false;
const configPath = path.join(app.getPath('userData'), 'config.json');
const currentVersion = "1.0.0"; // Актуальна версія додатку. Перед зборкою нової версії програми необхідно вказати новий номер версії.

function readConfig() {
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (error) {
        return {};
    }
}

function saveConfig(data) {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

async function checkInternet() {
    try {
        await axios.get('https://www.google.com', { timeout: 5000 });
        return true;
    } catch (error) {
        return false;
    }
}

async function downloadFiveM() {
    const fileUrl = 'https://runtime.fivem.net/client/FiveM.exe';
    const filePath = path.join(app.getPath('userData'), 'FiveM.exe');

    if (fs.existsSync(filePath)) {
        console.log('FiveM вже завантажений.');
        return filePath;
    }

    console.log('Завантаження FiveM...');
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        const fileWriter = fs.createWriteStream(filePath);
        response.data.pipe(fileWriter);

        fileWriter.on('finish', () => {
            const config = readConfig();
            config.fiveMDownloaded = true;
            saveConfig(config);
            resolve(filePath);
        });
        fileWriter.on('error', reject);
    });
}

async function launchFiveM(filePath, serverIp) {
    const command = serverIp ? `"${filePath}" +connect ${serverIp}` : `"${filePath}"`;
    exec(command, (error) => {
        if (error) {
            console.error('Не вдалося запустити FiveM:', error);
        }
    });
}

async function checkForUpdates() {
    try {
        const response = await axios.get('http://localhost:3000/api/update');
        const { version, url, notes } = response.data;

        if (version !== currentVersion) {
            const userResponse = await mainWindow.webContents.executeJavaScript(
                `confirm("Доступна нова версія: ${version}. ${notes || ''}\\nБажаєте завантажити оновлення?")`
            );
            if (userResponse) {
                await downloadUpdate(url);
            }
        } else {
            console.log("Клієнт вже оновлений до актуальної версії.");
        }
    } catch (error) {
        console.error('Помилка при перевірці оновлень:', error);
    }
}

async function downloadUpdate(url) {
    const filePath = path.join(app.getPath('userData'), 'update.exe');
    
    console.log('Завантаження оновлення...');
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        const fileWriter = fs.createWriteStream(filePath);
        response.data.pipe(fileWriter);

        fileWriter.on('finish', () => {
            exec(`"${filePath}"`, (error) => {
                if (error) {
                    console.error('Не вдалося запустити оновлення:', error);
                } else {
                    app.quit();
                }
            });
            resolve();
        });
        fileWriter.on('error', reject);
    });
}

async function createWindow() {
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

    const isConnected = await checkInternet();

    if (isConnected) {
        mainWindow.loadURL('http://localhost:5173/');
        isMainLoaded = true;

        const config = readConfig();
        if (!config.fiveMDownloaded) {
            await downloadFiveM();
            console.log('FiveM завантажено.');
        }
        
        await checkForUpdates();
    } else {
        mainWindow.webContents.send('no-internet', 'У вас немає підключення до інтернету');
    }

    setInterval(async () => {
        const hasInternet = await checkInternet();
        if (!hasInternet) {
            mainWindow.webContents.send('no-internet', 'У вас немає підключення до інтернету');
        } else if (!isMainLoaded) {
            mainWindow.loadURL('http://localhost:5173/');
            isMainLoaded = true;
        }
    }, 10000);

    ipcMain.on('close-app', () => {
        app.quit();
    });

    ipcMain.on('minimize-app', () => {
        mainWindow.minimize();
    });

    ipcMain.on('open-external-link', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.on('connect-to-server', async (event, serverIp) => {
        const filePath = path.join(app.getPath('userData'), 'FiveM.exe');
        await launchFiveM(filePath, serverIp);
    });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
