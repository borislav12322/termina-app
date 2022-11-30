const {
  spawn,
} = require('child_process');

const openNativeKeyboard = () => {
  return new Promise((res, rej) => {
    const cmd = spawn('onboard', {
      shell: true,
    });

    cmd.on('close', (code) => {
      console.log('close code : ', code);
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
  });
};

const closeNativeKeyboard = () => {
  return new Promise((res, rej) => {
    const cmd = spawn('wmctrl', ['-Fc', '"Onboard"'], {
      shell: true,
    });

    cmd.on('close', (code) => {
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
  });
};

const checkNativeKeyboard = () => {
  return new Promise((res, rej) => {
    const cmd = spawn('wmctrl', ['-l'], {
      shell: true,
    });

    cmd.stdout.on('data', (data) => {
      if (!data) rej();
      const regex = new RegExp('Onboard', 'g');
      const isExist = regex.test(data);

      res(isExist);
    });
  });
};

const toggleVisibilityNativeKeyboard = () => {
  return new Promise((res, rej) => {
    const cmd = spawn(
      'dbus-send',
      [
        '--type=method_call',
        '--dest=org.onboard.Onboard',
        '/org/onboard/Onboard/Keyboard',
        'org.onboard.Onboard.Keyboard.ToggleVisible',
      ],
      {
        shell: true,
      },
    );

    cmd.on('close', (code) => {
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
  });
};

const hideNativeKeyboard = () => {
  return new Promise((res, rej) => {
    const cmd = spawn(
      'dbus-send',
      [
        '--type=method_call',
        '--dest=org.onboard.Onboard',
        '/org/onboard/Onboard/Keyboard',
        'org.onboard.Onboard.Keyboard.Hide',
      ],
      {
        shell: true,
      },
    );

    cmd.on('close', (code) => {
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
  });
};

module.exports = {
  openNativeKeyboard,
  closeNativeKeyboard,
  checkNativeKeyboard,
  toggleVisibilityNativeKeyboard,
  hideNativeKeyboard,
};
