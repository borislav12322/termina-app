import { Store } from 'pullstate';

export const App = new Store({
  app: {
    isLoading: false,
    isModalVisible: false,
    documentVisitorData: null,
    terminalVisitorPhoto: null,
    isKeyboardVisible: false,
    error: '',
  },
});
