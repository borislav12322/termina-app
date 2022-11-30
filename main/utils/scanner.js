const { exec } = require('child_process');

module.exports = () => {
  const scanner = {
    config: {
      defaultResolution: 150,
      defaultMode: 'Color',
      resolutions: [
        75,
        150,
        300,
        600,
        1200,
        2400,
      ],
    },
    /*
             * sets the scanner device id to use for scan operations
             */
    setDeviceId(deviceId) {
      if (!deviceId || typeof (deviceId) !== 'string') throw new Error(`No or invalid deviceId: ${deviceId}`);
      this.config.deviceId = deviceId;
    },
    /*
             * gets a list of attached devives
             */
    getDevices() {
      return new Promise((resolve, reject) => {
        const command = 'scanimage -f \'%d;\'';
        try {
          exec(command, { encoding: 'binary', maxBuffer: 5000 * 1024 }, (error, stdout) => {
            const devices = [];
            if (stdout) {
              const stdArray = stdout.split(';');
              stdArray.forEach((d) => {
                if (d !== '') devices.push(d.trim());
              });
            }
            resolve(devices);
          });
        } catch (e) {
          reject(e);
        }
      });
    },

    /*
     * helper method to parse the provided options
     */
    parseOptions(obj = {}) {
      const { resolution, mode } = obj;
      const opts = {};
      if (!resolution) opts.resolution = this.config.defaultResolution;
      if (!mode) opts.mode = this.config.defaultMode;
      opts.deviceId = this.config.deviceId;
      return opts;
    },

    isConfigured() {
      return typeof (this.config.deviceId) === 'string';
    },

    scanWithProgress(options, callback, done) {
      const params = this.parseOptions(options);

      const command = `scanimage --device "${params.deviceId}" `
                    + `--resolution ${params.resolution} `
                    + `--mode ${params.mode} `;
      exec(command, { encoding: 'binary', maxBuffer: 50000 * 1024 }, (error, stdout) => {
        callback(stdout);
      }).on('close', () => {
        done();
      });
    },

    scanSync(options) {
      return new Promise((resolve, reject) => {
        const params = this.parseOptions(options);
        const command = `scanimage --device "${params.deviceId}" `
            + `--resolution ${params.resolution} `
            + `--mode ${params.mode} | pnmtojpeg`;
        // start to scan the image
        try {
          exec(command, { encoding: 'binary', maxBuffer: 50000 * 1024 }, (error, stdout) => {
            if (error) reject(error);
            resolve(Buffer.from(stdout, 'binary'));
          }).on('close', () => {
            // done();
          });
        } catch (e) {
          reject(e);
        }
      });
    },
  };
  return scanner;
};
