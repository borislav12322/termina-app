const { execFileSync } = require('child_process');
const fs = require('fs');

module.exports = (file, options = {}) => {
  if (!fs.existsSync(file)) throw 'No such file';
  const { printer } = options;
  const args = [file];
  if (printer) {
    args.push('-d', printer);
  }
  return execFileSync('lp', args);
};
