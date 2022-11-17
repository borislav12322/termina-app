const { HID, setDriverType } = require('node-hid');

const P = 0x50;
const N = 0x4E;
const ACK = 0x06; // Подтверждаю
const NAK = 0x15;
const STX = 0xF2; // Стартовый бит
const ETX = 0x03; // Конечный бит

const C = 0x43;

const UNLOCK_CARD = [0xB0, 0x31];
const CHECK_CARD_IN_READER = [0x31, 0x30];
const AUTO_LOCK_CARD = [0xB0, 0x32];
const AUTO_SELECT_PROTOCOL = [0x51, 0x39];
const CPU = [0x51, 0x30, 0x33];
const CAPDU1 = [0x00, 0xa4, 0x04, 0x0c, 0x09, 0x66, 0x6f, 0x6d, 0x73, 0x5f, 0x72, 0x6f, 0x6f, 0x74];
const CAPDU2 = [0x00, 0xa4, 0x04, 0x0c, 0x07, 0x46, 0x4f, 0x4d, 0x53, 0x5f, 0x49, 0x4e, 0x53];
const CAPDU3 = [0x00, 0xa4, 0x04, 0x0c, 0x07, 0x46, 0x4f, 0x4d, 0x53, 0x5f, 0x49, 0x44];
const CAPDU4 = [0x00, 0xa4, 0x02, 0x0c, 0x02, 0x02, 0x01];
const CAPDU5 = [0x00, 0xb0, 0x00, 0x00, 0x00];

const createCommand = (cmdArr, CAPDU = []) => {
  const LEN = cmdArr.length + CAPDU.length + 1;
  const woBCC = [STX, 0x00, LEN, C, ...cmdArr.concat(CAPDU), ETX];
  // eslint-disable-next-line no-bitwise
  const BCC = ((arr) => arr.reduce((prev, cur) => prev ^ cur, 0x00))(woBCC);
  return [...woBCC, BCC];
};

const promiseFactory = ([[firstCmd, ...restCmd], cpdus], fn) => {
  if (!cpdus) {
    return restCmd.reduce((prev, curr) => prev.then(() => fn(curr)), Promise.resolve(fn(firstCmd)));
  }
  const [firstCpdus, ...restCpdus] = cpdus;
  return restCmd.reduce((prev, curr) => prev.then(
    () => fn(curr, restCpdus.shift()),
  ), Promise.resolve(fn(firstCmd, firstCpdus)));
};

const sleep = (ms) => new Promise((_) => setTimeout(_, ms));

const hexToString = (str) => {
  const buf = Buffer.from(str, 'hex');
  return buf.toString('utf8');
};

// const config = {
//   vendorId: 9176,
//   productId: 645,
// };

class CardReader extends HID {
  constructor({ vendorId, productId }) {
    super(vendorId, productId);
    setDriverType('libusb');
    this.cardFound = false;
    this.cardReaderState = 'CARD_OUT';
    this.cardOut = false;
    this.done = false;
    this.data = [];
    this.oms = {};
    this.readData = false;
    this.totalDataLength = null;
    this.currentDataLength = null;
    this.pollInterval = null;
    this.capdus = [CAPDU5, CAPDU4, CAPDU3, CAPDU2, CAPDU1];
    this.writeCmd = this.writeCmd.bind(this);
    this.apduWrite = this.apduWrite.bind(this);
    this.init = this.init.bind(this);
    this.cpuInit = this.cpuInit.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  async writeCmd(cmd, timeout = 300) {
    this.write(createCommand(cmd));
    await sleep(timeout);
  }

  async apduWrite(cmd, CAPDU, timeout = 300) {
    this.write(createCommand(cmd, CAPDU));
    await sleep(timeout);
  }

  async init() {
    await this.writeCmd(AUTO_LOCK_CARD)
      .then(() => {
        this.pollInterval = setInterval(async () => this.poll(), 300);
      });
  }

  async cpuInit() {
    await this.writeCmd(CPU);
  }

  async getInfo() {
    const cmds = new Array(5).fill(AUTO_SELECT_PROTOCOL);
    const cpdus = [CAPDU1, CAPDU2, CAPDU3, CAPDU4, CAPDU5];
    await promiseFactory([cmds, cpdus], this.apduWrite);
  }

  async sendCAPDU(CAPDU) {
    await this.apduWrite(AUTO_SELECT_PROTOCOL, CAPDU);
  }

  async cardShouldOut() {
    await this.writeCmd(UNLOCK_CARD);
    this.done = true;
  }

  async poll() {
    if (this.cardFound) {
      if (this.done) {
        await this.writeCmd(CHECK_CARD_IN_READER);
        if (this.cardOut) {
          console.log('CARD OUT!!!!');
          this.reset();
        } else console.log('DONE, YOU SHOULD CARD OUT!');
      } else console.log('IN PROCESSING');
    } else {
      await this.writeCmd(CHECK_CARD_IN_READER);
    }
  }

  reset() {
    this.done = false;
    this.cardFound = false;
    this.cardOut = false;
    this.capdus = [CAPDU5, CAPDU4, CAPDU3, CAPDU2, CAPDU1];
    this.data = [];
    this.oms = {};
    this.cardReaderState = 'CARD_OUT';
  }

  parse(data) {
    const omsKeys = {
      26: 'omsnum',
      21: 'surname',
      22: 'name',
      23: 'patronymic',
      24: 'birthdate',
      '2a': 'issuedate',
    };
    const cleanData = data.slice(6).slice(0, -4).replace('7f3033', '');
    const dArray = cleanData.split('5f');
    const filterData = dArray.filter((el) => (Object.keys(omsKeys).indexOf(el.slice(0, 2)) > -1));
    filterData.forEach((el) => {
      const key = el.slice(0, 2);
      const value = el.slice(4);
      if (omsKeys[key].indexOf('date') > -1) {
        this.oms[omsKeys[key]] = el.slice(4, 12);
      } else {
        this.oms[omsKeys[key]] = hexToString(value);
      }
    });
  }
}

const createCardReader = (config) => {
  const cardReader = new CardReader(config);

  const answers = {
    CHECK_CARD_IN_READER: '49 48', // [0x31, 0x30]
    AUTO_SELECT_PROTOCOL: '81 57', // [0x51, 0x39]
    CPU_INIT: '81 48', // [0x51, 0x30]
  };

  const status = {
    LOCKED_CARD_INSIDE: '48 50', // [0x30, 0x32]
    REALESED_NO_CARD: '49 48', // [0x31, 0x30]
    REALESED_NOT_PLACE: '49 49', // [0x31, 0x31]
  };

  cardReader.on('data', (data) => {
    if (!cardReader.readData) {
      const [startBit,, len, ...rawResponse] = data;
      if (startBit === ACK) {
        // console.log('\x1b[34m%s\x1b[0m', 'DONE (ACK)');
      } else if (startBit === NAK) console.log('NOT DONE!');
      else if (startBit === STX) {
        const [statusCode, CM, PM, ...body] = rawResponse.slice(0, len);
        const CM_PM = `${CM} ${PM}`;
        if (statusCode === P) {
          const [ST1, ST0, ...DATA] = body;
          const ST1_ST0 = `${ST1} ${ST0}`;
          // console.log('COMMAND: ',
          //   Buffer.from([CM, PM]),
          //   'POSITIVE: ',
          //   Buffer.from([ST1, ST0]),
          //   'DATA : ',
          //   Buffer.from(DATA));
          if (CM_PM === answers.CHECK_CARD_IN_READER) {
            if (ST1_ST0 === status.LOCKED_CARD_INSIDE) {
              cardReader.cardFound = true;
              cardReader.cardReaderState = 'CARD_IN';
              cardReader.cpuInit();
            } else if (
              (ST1_ST0 === status.REALESED_NO_CARD || ST1_ST0 === status.REALESED_NOT_PLACE)
              && cardReader.done) {
              cardReader.cardOut = true;
            }
          } else if (CM_PM === answers.CPU_INIT) {
            if (ST1_ST0 === status.LOCKED_CARD_INSIDE && cardReader.cardFound) {
              cardReader.sendCAPDU(cardReader.capdus.pop());
            }
          } else if (CM_PM === answers.AUTO_SELECT_PROTOCOL) {
            if (DATA.length > 3) {
              cardReader.readData = true;
              cardReader.totalDataLength = len - DATA.length;
              cardReader.data.push(...DATA);
            } else if (DATA.join(' ') === '144 0') {
              cardReader.sendCAPDU(cardReader.capdus.pop());
            } else {
              console.log('NOT READABLE');
              cardReader.cardShouldOut();
            }
          }
        } else if (statusCode === N) {
          // const [E1, E0, ...DATA] = body;
          // console.log('COMMAND: ',
          //   Buffer.from(CM_PM.split(',')),
          //   'NEGATIVE: ',
          //   Buffer.from([E1, E0]),
          //   'DATA : ',
          //   Buffer.from(DATA));
          console.log('NOT READABLE');
          cardReader.cardShouldOut();
        } else console.log('UNKNOWN RETURN');
      }
    } else {
      const result = [...data];
      cardReader.data.push(...result.slice(0, cardReader.totalDataLength));
      cardReader.totalDataLength -= data.length;
      // console.log(cardReader.totalDataLength);
      if (cardReader.totalDataLength <= 0) {
        cardReader.parse(Buffer.from(cardReader.data).toString('hex'));
        cardReader.readData = false;
        cardReader.cardShouldOut();
      }
    }
  });
  cardReader.on('error', () => {
    clearInterval(cardReader.pollInterval);
    cardReader.cardReaderState = 'ERROR';
  });
  return cardReader;
};

module.exports = createCardReader;
