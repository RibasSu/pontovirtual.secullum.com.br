const { app, BrowserWindow, Menu, ipcMain, session, shell } = require('electron');
const path = require('node:path');

const APP_URL = 'https://pontovirtual.secullum.com.br/';
const APP_ORIGIN = new URL(APP_URL).origin;
const OFFLINE_PAGE = path.join(__dirname, 'offline.html');
const ALLOWED_PERMISSIONS = new Set([
  'camera',
  'geolocation',
  'media',
  'microphone',
  'notifications'
]);

function isAllowedAppUrl(url) {
  try {
    return new URL(url).origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

async function hasConnection() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(APP_URL, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });

    return response.ok || response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadAppOrOffline(mainWindow) {
  if (await hasConnection()) {
    await mainWindow.loadURL(APP_URL);
    return;
  }

  await mainWindow.loadFile(OFFLINE_PAGE);
}

function configurePermissions() {
  const defaultSession = session.defaultSession;

  defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const requestingUrl = details.requestingUrl || webContents.getURL();
    callback(ALLOWED_PERMISSIONS.has(permission) && isAllowedAppUrl(requestingUrl));
  });

  defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    const requestingUrl = requestingOrigin || details?.requestingUrl || webContents?.getURL();
    return ALLOWED_PERMISSIONS.has(permission) && isAllowedAppUrl(requestingUrl);
  });

  defaultSession.setDevicePermissionHandler(({ origin, deviceType }) => {
    return isAllowedAppUrl(origin) && ['camera', 'media', 'microphone'].includes(deviceType);
  });
}

function configureOfflineRetry() {
  ipcMain.handle('retry-connection', async (event) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);

    if (!mainWindow) {
      return false;
    }

    await loadAppOrOffline(mainWindow);
    return isAllowedAppUrl(mainWindow.webContents.getURL());
  });
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: 'Ponto Virtual Secullum',
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: `${__dirname}/preload.js`
    }
  });

  loadAppOrOffline(mainWindow);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedAppUrl(url)) {
      return { action: 'allow' };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAllowedAppUrl(url)) {
      return;
    }

    if (url.startsWith('file://')) {
      return;
    }

    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on('did-fail-load', (_event, _errorCode, _errorDescription, validatedUrl) => {
    if (isAllowedAppUrl(validatedUrl)) {
      mainWindow.loadFile(OFFLINE_PAGE);
    }
  });

  return mainWindow;
}

function createMenu() {
  const template = [
    {
      label: 'Aplicativo',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'zoomIn', label: 'Aumentar zoom' },
        { role: 'zoomOut', label: 'Diminuir zoom' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela cheia' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.setAppUserModelId('br.com.secullum.pontovirtual');

app.whenReady().then(() => {
  configurePermissions();
  configureOfflineRetry();
  createMenu();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
