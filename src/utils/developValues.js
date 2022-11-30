const appealAccountNumber = '900000086086';
const accountNumber1 = '9383836415';
const accountNumber2 = '9086092299';
const street = 'Колонцова';
const home = '15';
const apartment = '21';
const fio = 'Шрек Болотный Навсегда';
const tel = '+7 (123) 435-66-66';
const email = 'korolmira@kek.ru';

const changeStateToDevelop = () => {
  return {
    paymentScreenProviderData: {
      accountNumber: accountNumber2,
    },
    metersScreenProviderData: {
      accountNumber: accountNumber2,
    },
    appealScreenProviderData: {
      inputs: {
        ls: appealAccountNumber,
        street,
        home,
        apartment,
        fio,
        tel,
        email,
      },
    },
  };
};

export default changeStateToDevelop;
