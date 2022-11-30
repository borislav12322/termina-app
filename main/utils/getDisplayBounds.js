const electron = require('electron');

module.exports = (display = 1) => {
  const displays = electron.screen.getAllDisplays();
  const selectedDisplay = displays[display];
  const {
    bounds: {
      x, y, width, height,
    },
  } = selectedDisplay;
  return {
    x: (x - 50), y: (y - 50), width, height,
  };
};
