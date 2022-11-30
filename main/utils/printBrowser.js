const { BrowserWindow } = require('electron');
const path = require('path');
const { store } = require('./store');

const config = store.get('config');
const { port, printerName } = config;

module.exports = (filePath) => {
  const win = new BrowserWindow({
    width: 500, height: 500, useContentSize: true, show: false,
  });
  win.loadURL(`http://localhost:${port}/printPng?file=${path.resolve(filePath)}`);
  win.setMenu(null);
  const printers = win.webContents.getPrinters();
  // console.log(printers);
  const defaultPrinter = (printers.length > 0) ? printers.find((pr) => pr.isDefault) : { name: '' };
  const toPrinter = (printerName !== '') ? printerName : defaultPrinter.name;
  // console.log('to', toPrinter);
  win.webContents.on('did-finish-load', () => {
    const pageSettingsSilent = {
      silent: true,
      margins: {
        marginType: 'none',
      },
      color: false,
      scaleFactor: 0,
      deviceName: toPrinter,
      printBackground: true,
      dpi: {
        horizontal: 300,
        vertical: 300,
      },
    };
    // win.webContents.openDevTools();
    win.webContents.print(pageSettingsSilent, (success) => {
      win.close();
    });
  });
};
