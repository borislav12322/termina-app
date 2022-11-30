const {
  default: axios,
} = require('axios');
const path = require('path');

const checkStatus = async () => {
  try {
    const {
      paymentPort,
    } = require(path.join(__configDir, 'config.json'));

    // `http://192.168.4.134:${paymentPort}/reconciliation`,

    const res = await axios.post(`http://localhost:${paymentPort}/reconciliation`);
    console.log('🚀 ~ checkStatus ~ res', res);
  } catch (err) {
    console.error(err);
  }
};

const pay = async (data) => {
  try {
    const {
      paymentPort,
    } = require(path.join(__configDir, 'config.json'));

    const res = await axios.post(
      // `http://192.168.4.134:${paymentPort}/pay`,
      `http://localhost:${paymentPort}/pay`,
      data,
    );

    if (!res) {
      return {
        success: false,
        error: 'Нет ответа от модуля оплаты',
      };
    }

    if (res.status !== 200) {
      return {
        success: false,
        error: res.data.error || 'Ошибка модуля оплаты',
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.response?.data.error || err.message || 'Ошибка модуля оплаты',
    };
  }
};

module.exports = {
  checkStatus,
  pay,
};
