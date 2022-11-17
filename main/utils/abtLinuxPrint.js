const {
  spawn,
} = require('child_process');

// Это написал Серега
// Печать работает напрямую через буфер (stdin)
// Записывать файл не надо
// Печать работает ТОЛЬКО НА ЛИНУКСЕ

const printPdf = (buffer) => {
  return new Promise((res, rej) => {
    const lp = spawn('lp', ['-s', '-o', 'media=a4', '-'], {
      shell: true,
    });

    lp.on('close', (code) => {
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
    lp.stdin.write(buffer);
    lp.stdin.end();
  });
};

// Отменить все что есть в очереди печати
const cancelAllPrint = () => {
  return new Promise((res, rej) => {
    const lp = spawn('lprm', ['-'], {
      shell: true,
    });
    lp.on('close', (code) => {
      if (code === 0) {
        res();
      } else {
        rej(new Error(`Code ${code}`));
      }
    });
  });
};

module.exports = {
  printPdf,
  cancelAllPrint,
};
