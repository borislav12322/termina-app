import { Store } from 'pullstate';

export const App = new Store({
  app: {
    isLoading: false,
    isModalVisible: false,
  },
});
