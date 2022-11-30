const os = require('os');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const util = require('util');
const crypto = require('crypto');
const https = require('https');
const {
  spawn,
} = require('child_process');
const EventEmitter = require('events');

const iconv = require('iconv-lite');

const abtPayment = require('../utils/abtPayment');

const paymentLogger = require('../utils/paymentLogger');

module.exports = async (req, res) => {
  paymentLogger.info('initPaymentModule: начало оплаты');
  try {
    const {
      terminalNumber: configTerminalNumber,
      paymentOperatorName,
    } = require(path.join(__configDir, 'config.json'));

    const paymentPath = path.join(__auxiliaryDir, 'payment/');

    const {
      data,
    } = req.body;

    const {
      customerContact,
      customerId,
      cost,
    } = data;

    paymentLogger.info(`initPaymentModule: данные для оплаты -\n${JSON.stringify(data)}`);

    const isWindows = os.platform() === 'win32';
    let paymentPathRoot;
    let paymentCmd;
    if (isWindows) {
      paymentPathRoot = path.resolve(paymentPath, 'win');
      paymentCmd = path.join(paymentPathRoot, 'sb_pilot.exe');
    } else {
      paymentPathRoot = path.resolve(paymentPath, 'linux');
      paymentCmd = path.join(paymentPathRoot, 'sb_pilot');
    }
    const myEmitter = new EventEmitter();
    const eFilePath = path.join(paymentPathRoot, 'e');

    if (fs.existsSync(eFilePath)) {
      paymentLogger.info("Файл 'e' уже существует");
      paymentLogger.info('Очистка данных предыдущего платежа');
      fs.unlinkSync(eFilePath);
      console.log('eFilePath after : ', fs.existsSync(eFilePath));
    }

    if (!fs.existsSync(eFilePath)) {
      fs.writeFileSync(eFilePath, '');
      paymentLogger.info("Файл данных платежа 'e' отсутствует, создаем");
    }

    myEmitter.on('onExit', (isSuccess) => {
      if (isSuccess) {
        const resJson = {};
        const keys = [
          'status',
          'maskedNumber',
          'cardExpired',
          'authCode',
          'internalOperNumber',
          'cardType',
          'sberCardSign',
          'terminalNumber',
          'date',
          'transRefNumber',
          'hash',
          'track3',
          'spasiboSum',
          'merchNumber',
          'monitoringSystemTypeMsg',
          'gpc',
          'monitoringSystemMsg',
          'loyalityNumber',
          'command49res',
          'operationId',
          'flags',
          'loyalMifare',
          'vas',
        ];
        let stringIndex = 0;
        const rd = readline.createInterface({
          input: fs.createReadStream(path.join(paymentPathRoot, 'e')).pipe(iconv.decodeStream('koi8-r')),
          output: process.stdout,
          console: false,
        });
        rd.on('line', (line) => {
          resJson[keys[stringIndex]] = line;
          stringIndex += 1;
        });
        rd.on('close', async () => {
          paymentLogger.info(`readline.on 'close' - файл 'e' записан, json -\n${JSON.stringify(resJson)}`);

          const {
            status,
            transRefNumber,
            maskedNumber,
            authCode,
            terminalNumber,
          } = resJson;

          const paxStatusCode = parseInt(status, 10);
          paymentLogger.info(`paxStatusCode - ${paxStatusCode}`);

          if (paxStatusCode !== 0) {
            paymentLogger.error('Оплата не проведена ОШИБКА терминала');
            paymentLogger.info('==========================================');
            return res.json({
              success: false,
              error: 'Ошибка терминала оплаты',
            });
          }

          /*
            transactionCode: transRefNumber - от pax
            maskedNumber: maskedNumber - от pax
            authCode: authCode - от pax
            paymentTerminalNumber: terminalNumber - от pax

            terminalIdent: "название терминала" - из конфига

            customerContact: "email" - из req
            customerId: "nls | accountNumber | ls" - из req
            cost: "" - из req (0.00)
            cancelToken - из req
          */

          const abtPaymentObj = {
            transactionCode: transRefNumber,
            maskedNumber,
            authCode,
            paymentTerminalNumber: terminalNumber,
            customerContact,
            customerId,
            terminalIdent: configTerminalNumber,
            cost,
          };

          // paymentLogger.info('Отправка данных на шлюз оплаты после успешной оплаты на терминале');
          // const abtPaymentResponse = await abtPayment(abtPaymentObj, data.cancelToken);

          // if (
          //   !abtPaymentResponse
          // ) {
          //   paymentLogger.info('Нет ответа от шлюза оплаты');
          //   return res.json({
          //     success: false,
          //     error: 'Во время оплаты произошла ошибка',
          //   });
          // }

          // if (
          //   !abtPaymentResponse.success
          // ) {
          //   paymentLogger.info('Ответ от шлюза оплаты, неуспешно');
          //   return res.json({
          //     success: false,
          //     error: 'Во время оплаты произошла ошибка',
          //   });
          // }

          // paymentLogger.info('Ответ от шлюза оплаты, успешно');

          paymentLogger.info('Процесс оплаты завершен успешно');
          paymentLogger.info('==========================================');
          return res.json({
            success: true,
          });
        });
      } else {
        paymentLogger.error('Оплата не проведена');
        paymentLogger.info('==========================================');
        return res.json({
          success: false,
          error: 'Ошибка терминала оплаты',
        });
      }
    });

    const costKOP = (Number(cost) * 100).toFixed(0);

    const ls = spawn(`${paymentCmd}`, ['1', costKOP]);
    paymentLogger.info('sb_pilot: spawn');
    ls.on('close', (code) => {
      // console.log('ls.on \'close\' code : ', code);
      paymentLogger.info(`sb_pilot: закрыт с кодом - ${code}`);
      if (code !== 0) {
        myEmitter.emit('onExit', false);
        return;
      }
      myEmitter.emit('onExit', true);
    });
  } catch (error) {
    paymentLogger.error(`initPaymentModule: ошибка операции оплаты - ${error}`);
    paymentLogger.error('Оплата не проведена ОШИБКА ТЕРМИНАЛА ОПЛАТЫ');
    paymentLogger.info('==========================================');
    return res.json({
      success: false,
      error: 'Во время оплаты произошла ошибка',
    });
  }
};
