const log = require('electron-log');
const path = require('path');

log.transports.file.resolvePath = (variables) => {
  const { fileName } = variables;
  return path.join(path.resolve('./logs'), fileName);
};

module.exports = log;
