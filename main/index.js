require('./initPaths')();
const http = require('http');
const path = require('path');

const {
  app,
  Menu,
  Tray,
  ipcMain,
  screen,
  BrowserWindow,
  shell,
  session,
  webContents,
} = require('electron');

const { version } = require('../version.json');

const appServer = require('./app');
const { printPdf, cancelAllPrint } = require('./utils/abtLinuxPrint');
const createWindow = require('./utils/createWindow');
const logger = require('./utils/logger');
const {
  openNativeKeyboard,
  closeNativeKeyboard,
  checkNativeKeyboard,
  toggleVisibilityNativeKeyboard,
  hideNativeKeyboard,
} = require('./utils/nativeKeyboard');
const paxPayment = require('./utils/payment/paxPayment');
const Scanner = require('./utils/scanner');
const { config, store } = require('./utils/store');
const webviewPartitionStore = require('./utils/webviewPartitionStore');

console.log('ISDEVELOP', process.env.DEVELOP);
// eslint-disable-next-line no-underscore-dangle
console.log('electron dir', __electronDir);

const appWindows = [];
const appTray = null;

const { port = 48181, reactPort = 3030, paymentCheckInterval, windows } = config;

ipcMain.handle('getAppVersion', async () => {
  return version;
});

ipcMain.handle('log', async (event, options) => {
  const {
    level, // необязательно error | warn | info | verbose | debug | silly
    type, // необязательно
    message,
  } = options;
  // if (type === 'webview') {
  //   webviewLogger.info(message);
  //   return;
  // }

  if (level) {
    logger[level](message);

    return;
  }

  logger.info(message);
});

ipcMain.handle('setUnpauseDestroyedListener', async event => {
  const webContentsArr = webContents.getAllWebContents();

  webContentsArr
    .filter(item => {
      const type = item.getType();
      const title = item.getTitle();
      // eslint-disable-next-line prefer-regex-literals
      const devtoolsRegexp = new RegExp(/devtools/, 'gi');
      const reactRegexp = new RegExp(/react app/, 'gi');

      if (
        new RegExp(/webview/, 'gi').test(type) ||
        new RegExp(/window/, 'gi').test(type)
      ) {
        if (devtoolsRegexp.test(title) || reactRegexp.test(title)) {
          return false;
        }

        return true;
      }

      return false;
    })
    .forEach(item => {
      item.addListener('destroyed', () => {
        event.sender.send('main:setIsRedirectPaused', {
          value: false,
        });

        item.removeAllListeners();
      });
    });
});

ipcMain.handle('getConfig', async event => {
  const storeConfig = await store.get('config');

  return storeConfig;
});

ipcMain.on('setConfig', (event, arg) => {
  try {
    const currentConfig = store.get('config');

    store.set('config', {
      ...currentConfig,
      ...arg,
    });
    // eslint-disable-next-line no-param-reassign
    event.returnValue = true;
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = false;
  }
});

ipcMain.handle('printPdf', async (event, arrayBuffer) => {
  // Нам приходит ArrayBuffer, мы превращаем в Buffer
  try {
    const binary = Buffer.from(arrayBuffer);

    await printPdf(binary);

    return {
      success: true,
    };
  } catch (e) {
    logger.error(e);

    return {
      success: false,
      error: e,
    };
  }
});

ipcMain.handle('cancelAllPrint', async () => {
  try {
    await cancelAllPrint();

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
});

ipcMain.handle('webview:setPartitionListeners', async (event, partitionId) => {
  try {
    const { prev } = webviewPartitionStore;

    if (prev !== null) {
      const prevSession = session.fromPartition(prev);

      prevSession.removeAllListeners();
      prevSession.clearCache();
      prevSession.clearStorageData();
    }

    webviewPartitionStore.prev = partitionId;

    session
      .fromPartition(partitionId)
      .addListener('will-download', (willDownloadEvent, item) => {
        willDownloadEvent.preventDefault();
      });

    return {
      success: true,
    };
  } catch (err) {
    console.error("ipcMain.handle: 'webview:setPartitionListeners' ~ err", err);

    return {
      success: false,
      error: err,
    };
  }
});

// ipcMain.handle('openNativeKeyboard', async () => {
//   try {
//     await openNativeKeyboard();
//     return {
//       success: true,
//     };
//   } catch (err) {
//     console.error('openNativeKeyboard catch: ', err);
//     return {
//       success: false,
//       error: err,
//     };
//   }
// });
// ipcMain.handle('closeNativeKeyboard', async () => {
//   try {
//     await closeNativeKeyboard();
//     return {
//       success: true,
//     };
//   } catch (err) {
//     console.error('closeNativeKeyboard catch: ', err);
//     return {
//       success: false,
//       error: err,
//     };
//   }
// });

ipcMain.handle('toggleNativeKeyboard', async () => {
  try {
    await toggleVisibilityNativeKeyboard();

    return {
      success: true,
    };
  } catch (err) {
    console.error('toggleNativeKeyboard catch: ', err);

    return {
      success: false,
      error: err,
    };
  }
});

ipcMain.handle('hideNativeKeyboard', async () => {
  try {
    await hideNativeKeyboard();

    return {
      success: true,
    };
  } catch (err) {
    console.error('hideNativeKeyboard catch: ', err);

    return {
      success: false,
      error: err,
    };
  }
});

ipcMain.handle('getWindowType', async event => {
  const { id } = event.sender;

  return BrowserWindow.fromId(id).type;
});

ipcMain.handle('setStaticPath', async event => {
  return path.resolve(__staticDir);
});

const createWindows = async () => {
  // logger.info('Try to init scanner');
  const scanner = Scanner();
  const devices = await scanner.getDevices();

  logger.info(devices);
  if (devices.length > 0) {
    const defaultDevice = devices[0];

    scanner.setDeviceId(defaultDevice);
    global.scanner = scanner;
    logger.info(`Success init scanner ${defaultDevice}`);
  } else {
    logger.info('12 init scanner');
  }

  // paxPayment.checkStatus();
  // setInterval(() => {
  //   paxPayment.checkStatus();
  // }, paymentCheckInterval * 60 * 1000);

  if (windows.length > 0) {
    windows.forEach(win => {
      try {
        logger.info('создаем окно', windows);
        const nW = createWindow(win, port);

        appWindows.push(nW);
      } catch (e) {
        logger.error(e);
      }
    });
  } else {
    // const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const nW = createWindow(`http://localhost:${port}/localapp`, 0, port, false);

    appWindows.push(nW);
  }

  // Menu.setApplicationMenu(null);
};

appServer.set('mainWindow', windows);

const onListening = () => {
  const uri = `http://localhost:${port}`;

  logger.info(`Listening on port ${port}`);
  logger.info(`Test ${uri}`);
};

const server = http.createServer(appServer);

server.on('listening', onListening);
server.listen(port);

app.on('ready', createWindows);
app.on('window-all-closed', () => {
  server.close();
  app.quit();
});

app.disableHardwareAcceleration();

app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('enable-usermedia-screen-capturing', 'true');
