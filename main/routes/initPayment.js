const path = require('path');
const abtPayment = require('../utils/abtPayment');
const paxPayment = require('../utils/payment/paxPayment');
const paymentLogger = require('../utils/paymentLogger');

module.exports = async (req, res) => {
  paymentLogger.info('initPaymentModule: начало оплаты');

  const handleError = (errMsg) => {
    return res.json({
      success: false,
      error: errMsg,
    });
  };

  try {
    const {
      paymentTerminalNumber: configTerminalNumber,
    } = require(path.join(__configDir, 'config.json'));

    const {
      customerContact,
      customerId,
      cost, // в рублях
      cancelToken,
    } = req.body;

    paymentLogger.info(`initPaymentModule: данные для оплаты -\n${JSON.stringify(req.body)}`);

    const amountKOP = (Number(cost) * 100).toFixed(0);
    const payData = {
      amount: Number(amountKOP),
    };

    paymentLogger.info(`запрос на терминал оплаты,\nданные: ${JSON.stringify(payData)}`);
    const paymentRes = await paxPayment.pay(payData);

    if (!paymentRes) {
      paymentLogger.warn('Нет ответа от терминала оплаты');
      handleError('Нет ответа от терминала оплаты');
      return;
    }

    if (!paymentRes.success) {
      paymentLogger.warn('Ошибка терминала оплаты');
      handleError(paymentRes?.error || 'Ошибка терминала оплаты');
      return;
    }

    paymentLogger.info(`Ответ от терминала оплаты: успешно,\nданные: ${JSON.stringify(paymentRes.data)}`);

    const {
      authCode,
      maskedNumber,
      terminalNumber,
      transactionCode,
    } = paymentRes.data;
    /*
      transactionCode: transRefNumber - от pax
      maskedNumber: maskedNumber - от pax
      authCode: authCode - от pax
      paymentTerminalNumber: terminalNumber - от pax

      terminalIdent: "название терминала" - из конфига (поле "paymentTerminalNumber")

      customerContact: "email" - из req
      customerId: "nls | accountNumber | ls" - из req
      cost: "" - из req (0.00)
    */

    // const abtPaymentObj = {
    //   transactionCode: transRefNumber,
    //   maskedNumber,
    //   authCode,
    //   paymentTerminalNumber: terminalNumber,
    //   customerContact,
    //   customerId,
    //   terminalIdent: configTerminalNumber,
    //   cost,
    // };

    const abtPaymentGateReqData = {
      authCode,
      maskedNumber,
      paymentTerminalNumber: terminalNumber,
      transactionCode,
      terminalIdent: configTerminalNumber,
      customerContact,
      customerId,
      cost,
    };

    paymentLogger.info(`Отправка данных на шлюз оплаты после успешной оплаты на терминале,\nданные (cost в рублях): ${JSON.stringify(abtPaymentGateReqData)}`);
    const abtPaymentGateResponse = await abtPayment(abtPaymentGateReqData, cancelToken);

    if (
      !abtPaymentGateResponse
    ) {
      paymentLogger.warn('Нет ответа от шлюза оплаты');
      handleError('Произошла ошибка. Нет ответа от шлюза оплаты');
      return;
    }

    if (
      !abtPaymentGateResponse.success
    ) {
      const errMsg = abtPaymentGateResponse.error;
      paymentLogger.warn(`Ответ от шлюза оплаты, неуспешно, ошибка: ${typeof errMsg === 'string'
        ? errMsg
        : JSON.stringify(errMsg)}`);
      handleError(typeof errMsg === 'string' ? errMsg : 'Ошибка шлюза оплаты');
      return;
    }

    paymentLogger.info('Ответ от шлюза оплаты, успешно');

    paymentLogger.info('Процесс оплаты завершен успешно');
    paymentLogger.info('==========================================');

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    paymentLogger.error('Оплата не проведена');
    paymentLogger.info('==========================================');
    handleError(err.response?.data.error || err.message || 'Ошибка модуля оплаты');
  }
};
