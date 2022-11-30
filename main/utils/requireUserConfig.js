/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const {
  diff, addedDiff, deletedDiff, detailedDiff, updatedDiff,
} = require('deep-object-diff');
const defaultConfig = require('../defaultConfig.json');
const logger = require('./logger');

/*
diff(originalObj, updatedObj) returns the difference of the original and updated objects

addedDiff(original, updatedObj) returns only the values added to the updated object

deletedDiff(original, updatedObj) returns only the values deleted in the updated object

updatedDiff(original, updatedObj) returns only the values that have been changed in the updated object

detailedDiff(original, updatedObj) returns an object with the added, deleted and updated differences
*/

module.exports = () => {
  try {
    const pathToUserConfig = path.join(__configDir, 'config.json');
    if (fs.existsSync(pathToUserConfig)) {
      const userConfig = require(pathToUserConfig);
      // addedDiff - это только НОВЫЕ поля (буквально новые)
      // diff - это НОВЫЕ поля + ИЗМЕНЕННЫЕ старые
      // addedDiff 1-ый аргумент что возможно надо дополнить
      // 2ой - темплейт (с чем сравниваем)
      const configDiffrence = addedDiff(userConfig, defaultConfig);
      // Если есть различия
      if (Object.keys(configDiffrence).length) {
        logger.info('Различия в конфиге', configDiffrence);
        const deepChange = (diffObj, oldConfig) => {
          for (const key in diffObj) {
            if (Object.hasOwnProperty.call(oldConfig, key)) {
              if (typeof diffObj[key] === 'object') {
                deepChange(diffObj[key], oldConfig[key]);
              } else {
                oldConfig[key] = diffObj[key];
              }
            } else {
              oldConfig[key] = diffObj[key];
            }
          }
        };
        deepChange(configDiffrence, userConfig);
        fs.writeFileSync(pathToUserConfig, JSON.stringify(userConfig, null, 1));
        logger.info('В конфиг добавленны новые поля!');
      }
      return userConfig;
    }
    if (!fs.existsSync(__configDir)) {
      fs.mkdirSync(__configDir);
    }
    fs.writeFileSync(pathToUserConfig, JSON.stringify(defaultConfig, null, 1));
    logger.info('Создаю дефолтный конфиг');
    return defaultConfig;
  } catch (e) {
    console.log(e);
    logger.error('Не могу распарсить config (не валидный JSON)');
  }
};
