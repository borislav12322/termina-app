import { Store } from 'pullstate';

export const App = new Store({
  app: {
    appConfig: {},
    isLoading: false,
    isModalVisible: false,
    documentVisitorData: null,
    terminalVisitorPhoto: null,
    isKeyboardVisible: false,
    error: '',
    currentVisitorPassportID: null,
    currentVisitorPassID: null,
    currentVisitorID: null,
    foundFacePassPhoto: null,
    dispenserInfo: null,
  },
});
