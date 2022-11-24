const fs = require('fs');
const os = require('os');
const path = require('path');

const express = require('express');

const { version } = require('../../package.json');
const abtPayment = require('../utils/abtPayment');
const logger = require('../utils/logger');
const printBrowser = require('../utils/printBrowser');
const printLinux = require('../utils/printLinux');
const setWindowParams = require('../utils/setWindowParams');
const { store } = require('../utils/store');

const initPayment = require('./initPayment');
const paymentProcessing = require('./paymentProcessing');

const router = express.Router();

router.get('/version', (req, res) => {
  res.json({
    success: true,
    version,
  });
});

router.get('/config', (req, res) => {
  const config = store.get('config');

  if (config) {
    res.json(config);
  } else {
    res.json({
      success: false,
    });
  }
});

router.post('/print', (req, res, next) => {
  const appConfig = store.get('config');
  const { printerName } = appConfig;
  const { data } = req.body;
  const imagePath = path.join(os.tmpdir(), 'lastPrintedImage.png');
  const imgBuffer = Buffer.from(data, 'base64');

  fs.writeFileSync(imagePath, imgBuffer, 'binary', err => {
    logger.error('Error save image file', err); // writes out file without error, but it's not a valid image
  });
  const platform = os.platform();

  try {
    if (platform === 'linux') {
      const printOptions = {};

      if (printerName) {
        printOptions.printer = printerName;
      }
      printLinux(imagePath, printOptions);
    } else {
      printBrowser(imagePath);
    }
    res.json({
      success: true,
    });
  } catch (e) {
    logger.error(e.message);
    res.json({
      success: false,
      error: e,
    });
  }
});

router.get('/tilesConfig', (req, res) => {
  try {
    // eslint-disable-next-line global-require
    const tiles = require('../../config/config.json');
    const answer = {
      success: true,
      tiles,
    };

    res.json(answer);
  } catch (e) {
    res.json({
      success: false,
    });
  }
});

router.post('/initPaymentModule', paymentProcessing);
router.post('/initPayment', initPayment);

module.exports = router;
