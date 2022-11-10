const { app, BrowserWindow } = require('electron');

require('@electron/remote/main').initialize();

const path = require('path');

const isDev = require('electron-is-dev');

function createWindow() {
  const window = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  window.loadURL(
    isDev
      ? 'http://localhost:3015'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
