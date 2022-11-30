/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const path = require('path');

module.exports = () => {
  const paths = {
    __electronDir: './main',
    __reactBuildDir: './build',
    __rootDir: './',
    __auxiliaryDir: './auxiliary',
    __assetsDir: './assets',
    __configDir: './config',
    __staticDir: './static',
  };

  for (const key in paths) {
    const curPath = path.resolve(paths[key]);

    global[key] = path.resolve(paths[key]);
  }
  // console.log(global);
};
