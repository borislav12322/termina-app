const path = require('path');

const { contextBridge, ipcRenderer, webFrame, webContents } = require('electron');

// By default, it writes logs to the following locations:

// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log

ipcRenderer.once('setZoomFactor', (event, arg) => {
  try {
    webFrame.setZoomFactor(arg);
  } catch (e) {
    console.error(e);
  }
});

let staticPath = '';

ipcRenderer.invoke('setStaticPath').then(data => {
  staticPath = data;
});

const redirectPausedValueObj = {
  _value: false,
  get value() {
    return this._value;
  },
  set value(bool) {
    this._value = bool;
  },
};

ipcRenderer.on('main:setIsRedirectPaused', (event, args) => {
  const { value } = args;

  redirectPausedValueObj.value = value;
});

contextBridge.exposeInMainWorld('api', {
  log: options => {
    return ipcRenderer.invoke('log', options);
  },
  getAppVersion: () => {
    return ipcRenderer.invoke('getAppVersion');
  },
  getConfig: () => {
    return ipcRenderer.invoke('getConfig');
  },
  printPdf: arrayBuffer => {
    return ipcRenderer.invoke('printPdf', arrayBuffer);
  },
  cancelAllPrint: () => {
    console.log('Была ошибка в принтере, очищаем печать!');

    return ipcRenderer.invoke('cancelAllPrint');
  },
  getFileFromStatic: file => {
    return path.join(staticPath, file);
  },
  webviewSetPartitionListeners: partitionId => {
    return ipcRenderer.invoke('webview:setPartitionListeners', partitionId);
  },
  // openNativeKeyboard: () => {
  //   return ipcRenderer.invoke('openNativeKeyboard');
  // },
  // closeNativeKeyboard: () => {
  //   return ipcRenderer.invoke('closeNativeKeyboard');
  // },
  toggleNativeKeyboard: () => {
    return ipcRenderer.invoke('toggleNativeKeyboard');
  },
  hideNativeKeyboard: () => {
    return ipcRenderer.invoke('hideNativeKeyboard');
  },
  isRedirectPaused: () => {
    return redirectPausedValueObj.value;
  },
  setIsRedirectPaused: bool => {
    redirectPausedValueObj.value = bool;
  },
  setUnpauseDestroyedListener: () => {
    return ipcRenderer.invoke('setUnpauseDestroyedListener');
  },
});
