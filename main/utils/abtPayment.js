const path = require('path');

const {
  default: axios,
} = require('axios');

const abtPayment = async (dataObj, cancelToken) => {
  try {
    const {
      paymentGateUrl,
    } = require(path.join(__configDir, 'config.json'));

    const res = await axios.post(`${paymentGateUrl}/api/payment`, dataObj, cancelToken);

    if (!res) {
      return {
        success: false,
      };
    }

    if (!res.data.success) {
      return {
        success: false,
      };
    }

    return res.data;
  } catch (err) {
    console.error('abtPayment err: ', err.message);

    if (!/cancelToken/gi.test(err.message)) {
      return {
        success: false,
        error: err.response?.data.error || err.message || 'Ошибка шлюза оплаты',
      };
    }
  }
};

module.exports = abtPayment;
