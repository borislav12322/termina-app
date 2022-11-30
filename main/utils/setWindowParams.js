const getDisplayBounds = require('./getDisplayBounds');

module.exports = async (window, {
  url, display, alwaysOnTop = false, kiosk = false, width, height,
}) => {
  console.log(display);

  window.setKiosk(kiosk);
  window.setAlwaysOnTop(alwaysOnTop);
  window.setContentSize(width, height);
  const displayBounds = getDisplayBounds(display);
  const {
    x, y,
  } = displayBounds;

  console.log('123312', displayBounds);

  window.setBounds({
    x,
    y,
  });

  await window.loadURL(url);
};
