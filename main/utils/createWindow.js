const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const { BrowserWindow, screen, Tray, Menu, app, session, ipcMain } = require('electron');

const logger = require('./logger');

const appTrays = [];

const createWindow = (windowProps, port) => {
  const {
    url = `http://localhost:${port}/preloader/`,
    display = 0,
    kiosk = true,
    alwaysOnTop = true,
    type = 'main',
    zoomFactor = 1,
    width = 1000,
    height = 1000,
    frame = false,
    devTools = true,
    devToolWidth = 900,
    devToolHeight = 500,
    resizable = false,
    restartTime = 5000,
  } = windowProps;
  const iconpath = path.join(__assetsDir, `/icons/${type}/trayIcon.png`);
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const allDisplays = screen.getAllDisplays();
  let newWindow;
  const loading = new BrowserWindow({
    show: false,
    frame: false,
    kiosk,
    x: allDisplays[display] ? allDisplays[display].bounds.x : 50,
    y: allDisplays[display] ? allDisplays[display].bounds.y : 50,
    icon: iconpath,
    width,
    height,
  });

  loading.once('show', () => {
    newWindow = new BrowserWindow({
      x: allDisplays[display] ? allDisplays[display].bounds.x : 50,
      y: allDisplays[display] ? allDisplays[display].bounds.y : 50,
      icon: iconpath,
      title,
      show: false,
      kiosk,
      alwaysOnTop,
      width,
      height,
      useContentSize: true,
      frame,
      webPreferences: {
        plugins: true,
        contextIsolation: true,
        preload: path.join(__dirname, './initApi.js'),
        webviewTag: true,
        webSecurity: false,
      },
    });
    let isFailStart = false;
    let windowInit = false;
    let failStartTimer;
    const errorHandler = () => {
      console.log('error load', newWindow.type);
      isFailStart = true;
    };
    const domHandler = () => {
      if (!isFailStart && !windowInit) {
        newWindow.webContents.send('setZoomFactor', zoomFactor);
        // newWindow.webContents.send('setStaticPath', __staticDir);
        newWindow.setResizable(resizable);
        newWindow.show();
        loading.hide();
        loading.close();
        if (devTools) {
          // const {
          //   width: mainDisplayWidth,
          //   height: mainDisplayHeight,
          // } = allDisplays[0].bounds;
          // const devToolX = mainDisplayWidth - devToolWidth;
          // const devToolY = devToolHeight * display;
          // const devtools = new BrowserWindow({
          //   width: devToolWidth,
          //   height: devToolHeight,
          //   x: devToolX,
          //   y: devToolY,
          // });
          // newWindow.webContents.setDevToolsWebContents(devtools.webContents);
          // devtools.setMenuBarVisibility(false);
          // newWindow.webContents.openDevTools({
          //   mode: 'detach',
          // });
          newWindow.webContents.openDevTools({
            mode: 'detach',
          });
        }
        windowInit = true;

        session.defaultSession.on(
          'will-download',
          (willDownloadEvent, item, webContents) => {
            willDownloadEvent.preventDefault();
          },
        );

        newWindow.webContents.removeListener('did-fail-load', errorHandler);
        newWindow.webContents.removeListener('dom-ready', domHandler);
      } else {
        failStartTimer = setTimeout(() => {
          console.log('restart', newWindow.type);
          newWindow.loadURL(process.env.DEVELOP ? url : `http://localhost:${port}/`);
          isFailStart = false;
        }, restartTime);
      }
    };

    newWindow.webContents.on('did-fail-load', errorHandler);
    newWindow.webContents.on('dom-ready', domHandler);

    newWindow.webContents.on('did-attach-webview', (event, webviewContents) => {
      const { webviewBlockList, webviewWhiteList } = require(path.join(
        __configDir,
        'config.json',
      ));

      /**
       * @param {string} urlStr
       * @param {('navigate'|'newWindow')} eventType
       */
      const checkIfUrlAllowed = (urlStr, eventType = 'navigate') => {
        const arrToCheck = webviewWhiteList[eventType];

        return arrToCheck.some(allowedUrl => {
          const regex = new RegExp(allowedUrl, 'i');

          if (regex.test(urlStr)) {
            return true;
          }

          return false;
        });
      };

      webviewContents.addListener('will-navigate', async (e, willNavigateUrl) => {
        const isUrlAllowed = checkIfUrlAllowed(willNavigateUrl);

        if (!isUrlAllowed) e.preventDefault();
      });
      webviewContents.addListener('will-redirect', async (e, willRedirectUrl) => {
        const isUrlAllowed = checkIfUrlAllowed(willRedirectUrl);

        if (!isUrlAllowed) e.preventDefault();
      });

      webviewContents.setWindowOpenHandler(e => {
        const isUrlAllowed = checkIfUrlAllowed(e.url, 'newWindow');

        if (!isUrlAllowed) {
          return {
            action: 'deny',
          };
        }

        newWindow.webContents.send('main:setIsRedirectPaused', {
          value: true,
        });

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            parent: newWindow,
            modal: true,
            // center: true,
            x: 0,
            y: 784,
            width: 940,
            height: 940,
            frame: true,
            alwaysOnTop: true,
            show: true,
            autoHideMenuBar: true,
            resizable: false,
            // movable: false,
            // maximizable: false,
            // closable: true,
            // type: 'toolbar',
          },
        };
      });
    });
    newWindow.setMenu(null);
    newWindow.loadURL(process.env.DEVELOP ? url : `http://localhost:${port}/`);
    newWindow.type = type;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Показать',
        click() {
          newWindow.show();
        },
      },
      {
        label: 'Отладка',
        click() {
          newWindow.webContents.openDevTools();
        },
      },
      {
        label: 'Выход',
        click() {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);
    const appTray = new Tray(iconpath);

    appTray.setContextMenu(contextMenu);
    appTray.setToolTip(type);

    appTray.on('click', () => {
      newWindow.show();
    });

    appTrays.push(appTray);

    newWindow.on('closed', () => {
      clearTimeout(failStartTimer);
      newWindow = null;
      process.exit(0);
    });
  });
  const loaderPath = path.join(__assetsDir, '/loader.html');

  loading.loadFile(loaderPath);
  loading.show();

  return newWindow;
};

module.exports = createWindow;
