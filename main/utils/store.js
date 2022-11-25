const Store = require('electron-store');

const logger = require('./logger');
const requireUserConfig = require('./requireUserConfig');

const userConfig = requireUserConfig();

const store = new Store();

store.set('config', userConfig);

const config = store.get('config');

// logger.info('Load config === ', config);

module.exports = {
  config,
  store,
};
