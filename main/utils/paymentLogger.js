const path = require('path');
const electronLog = require('electron-log');

const log = electronLog.create('paymentLogger');

log.transports.file.resolvePath = () => {
  return path.join(path.resolve('./logs', 'payment.log'));
};

module.exports = log;
